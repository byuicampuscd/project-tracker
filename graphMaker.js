/* estlint-env browser */
/* eslint no-console:0, no-unused-vars:0, semi:2 */
/* global c3, ss, console, moment, constants */

var graphMaker = (function () {
    function offsetFromDate(date, offset) {
        return moment(date, constants.DATE_FORMAT).add(offset, 'days').format(constants.DATE_FORMAT);
    }


    /***********************************************************
     *********************** ADD SERIES ************************
     ***********************************************************/
    function addSeries(name, series, showIt, typeOfGraph, data) {
        if (!Array.isArray(data.addedSeries)) {
            data.addedSeries = [];
        }

        data.addedSeries.push({
            name: name,
            data: series,
            showIt: showIt,
            type: typeOfGraph
        });
    }

    /***********************************************************
     ********************* ADD SUM SERIES **********************
     ***********************************************************/
    function addSumSeries(data) {
        var seriesOut = [];
        data.series.filter(function (siri) {
                return siri.showIt;
            })
            .forEach(function (siri) {
                //siri get it, thats one series
                siri.data.forEach(function (dataPoint) {
                    var i,
                        foundIt = false;

                    //loop them all and one more
                    for (i = 0; i < seriesOut.length; ++i) {
                        if (seriesOut[i].x === dataPoint.x) {
                            foundIt = true;
                            //add to the sum total for that date that is stored in the y val
                            seriesOut[i].y += dataPoint.y;

                            //skip to the end
                            i = seriesOut.length;
                        }

                    }

                    //didn't find it need to add it
                    if (!foundIt) {
                        seriesOut.push({
                            x: dataPoint.x,
                            y: dataPoint.y
                        });
                    }
                });
            });

        //make sure they are in order
        seriesOut.sort(function (a, b) {
            if (a.x < b.x) return -1;
            if (a.x > b.x) return 1;
            return 0;
        });

        //should check to make sure didn't skip any dates in the validate data part before we do anything


        //this adds a series record it
        addSeries("Sum", seriesOut, false, 'line', data);
    }

    function getSumSeries(data) {
        var sumSeries;
        data.addedSeries.forEach(function (siri) {
            if (siri.name === "Sum") {
                sumSeries = siri;
            }
        });

        //check if we didn't find one
        if (typeof sumSeries === "undefined") {
            throw new Error("Must run addSumSeries() before addTrendLine().");
        }

        return sumSeries;
    }
    /***********************************************************
     ********************* ADD TREND LINE **********************
     ***********************************************************/
    function addTrendLine(data) {


        function makeLineMBObj(sumSeries) {
            //make it the correct format
            var sumDataSet = sumSeries.data.map(function (item, index) {
                return [index, item.y];
            });

            //return the mbLine object
            return ss.linearRegression(sumDataSet);
        }


        var seriesOut = [],
            sumSeries = getSumSeries(data),
            trendLineMBObj = makeLineMBObj(sumSeries),
            trendLineFun = ss.linearRegressionLine(trendLineMBObj),
            slopeIsNegitive = trendLineMBObj.m < 0,
            pointsCountMax = 25,
            dataPoint, i,
            isPositive = true;
        console.log("slopeIsNegitive", slopeIsNegitive);

        //go till we get to negitive or the max
        for (i = 0; isPositive && (slopeIsNegitive || i < pointsCountMax); ++i) {

            //make the point
            dataPoint = {
                x: offsetFromDate(sumSeries.data[0].x, i),
                y: trendLineFun(i)
            };

            //check if we hit negitive yet
            if (dataPoint.y < 0.5) {
                dataPoint.y = 0;
                isPositive = false;
            }

            //put it in
            seriesOut.push(dataPoint);
        }

        //console.log("Trend:", seriesOut);

        //save it for later
        addSeries("Trend", seriesOut, true, "line", data);
    }
    /***********************************************************
     ******************** ADD DUE DATE LINE ********************
     ***********************************************************/
    function addDueDateLine(data) {

        function getMaxY(max, day) {
            return Math.max(max, day.y);
        }

        var sumSeries = getSumSeries(data),
            maxY = sumSeries.data.reduce(getMaxY, sumSeries.data[0].y),
            seriesOut = [{
                    x: data.settings.dueDate,
                    y: 0
                }, {
                    x: data.settings.dueDate,
                    y: maxY
                }
            ];

        //save it
        addSeries("Due Date", seriesOut, true, "line", data);
    }

    /***********************************************************
     ****************** ADD ADJUSTMENT LINE ********************
     ***********************************************************/
    function addAdjustmentLine(data) {


        //get the last x and y in the sum
        var sumData = getSumSeries(data).data,
            sumLastDay = sumData[sumData.length - 1],
            diffInDays = moment(data.settings.dueDate, constants.DATE_FORMAT).diff(moment(sumLastDay.x, constants.DATE_FORMAT), "day"),
            points = [[0, sumLastDay.y], [diffInDays, 0]],
            lineMBObj = ss.linearRegression(points),
            lineFun = ss.linearRegressionLine(lineMBObj),
            seriesOut = [],
            i;


        // plot points from last to due day
        for (i = 0; i <= diffInDays; ++i) {
            seriesOut.push({
                x: offsetFromDate(sumLastDay.x, i),
                y: lineFun(i)
            });
        }

        console.log("Adustment Line:", JSON.stringify(seriesOut, null, 4));

        //save it
        addSeries("Adustment Line", seriesOut, true, "line", data);
    }

    /***********************************************************
     *********************** MAKE CHART ************************
     ***********************************************************/
    function makeChart(data) {

        function makeTypesObj(objOut, series) {
            objOut[series.name] = series.type;
            return objOut;
        }

        function makeXSeriesName(name) {
            return name + "Xs";
        }

        function getSeriesToPlot(data) {
            var series = data.series.filter(function (siri) {
                    return siri.showIt;
                }),
                addSeriesToPlot = data.addedSeries.filter(function (siri) {
                    return siri.showIt;
                });

            //get all of them
            return series.concat(addSeriesToPlot);
        }

        function makeXs(Xs, siri) {
            Xs[siri.name] = makeXSeriesName(siri.name);
            return Xs;
        }

        function makeColumns(columns, siri) {
            //add the names first because c3 columns like that
            var yList = [siri.name],
                xList = [makeXSeriesName(siri.name)];

            //get the values
            siri.data.forEach(function (day) {
                yList.push(day.y);
                xList.push(day.x);
            });

            //save them
            columns.push(yList);
            columns.push(xList);

            //pass it allong
            return columns;
        }

        function makeTicks(seriesToPlot) {
            var startingX = moment(seriesToPlot[0].data[0].x, constants.DATE_FORMAT),
                minX = startingX,
                maxX = startingX,
                ticks = [],
                currentDay, maxDay;

            seriesToPlot.forEach(function (siri) {
                siri.data.forEach(function (day) {
                    var dayX = moment(day.x, constants.DATE_FORMAT);

                    if (!maxX.isAfter(dayX)) {
                        maxX = dayX;
                    }
                    if (!minX.isBefore(dayX)) {
                        minX = dayX;
                    }
                });
            });
            currentDay = minX;
            maxDay = maxX;

            while (!currentDay.isSame(maxDay, "day")) {
                ticks.push(currentDay.format(constants.DATE_FORMAT));
                currentDay.add(1, "day");
            }

            //add the last one
            ticks.push(currentDay.format(constants.DATE_FORMAT));

            return ticks;
        }

        function makeGroups(siri) {
            return siri.name;
        }

        var chartSettings,
            seriesToPlot = getSeriesToPlot(data),
            xs = seriesToPlot.reduce(makeXs, {}),
            columns = seriesToPlot.reduce(makeColumns, []),
            types = data.addedSeries.reduce(makeTypesObj, {}),
            groups = data.series.map(makeGroups),
            ticks = makeTicks(seriesToPlot);

        console.log("seriesToPlot:", seriesToPlot);
        console.log("xs:", JSON.stringify(xs, null, 4));
        console.log("columns:", JSON.stringify(columns, null, 4));
        console.log("types:", JSON.stringify(types, null, 4));
        console.log("groups:", JSON.stringify(groups, null, 4));


        //put it all together
        chartSettings = {
            bindto: '#chart',
            data: {
                xs: xs,
                columns: columns,
                type: 'bar',
                types: types,
                groups: [groups]
            },
            tooltip: {
                format: {
                    value: function (value) {
                        return Math.round(value);
                    }
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: "%m/%d",
                        culling: false,
                        values: ticks
                    }
                },
                y: {
                    label: {
                        text: 'Issues Remaining',
                        position: 'outer-middle'
                    }
                }
            }
        };

        //make chart
        c3.generate(chartSettings);
    }

    function plot(data) {
        //mess with it
        //make a spot to put all this


        addSumSeries(data);
        addTrendLine(data);
        addDueDateLine(data);
        addAdjustmentLine(data);
        console.log("fixed data:", data);

        //plot it
        makeChart(data);

    }

    return plot;

}());
