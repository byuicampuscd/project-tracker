/* estlint-env browser */
/* eslint no-console:0, no-unused-vars:0 */
/* global c3, ss, console, moment, constants */

var graphMaker = (function () {

    function fixUpData(data) {

        function recordSeriesName(name, showIt, typeOfGraph, data) {
            data.settings.addedSeries.push({
                name: name,
                showIt: showIt,
                type: typeOfGraph
            });
        }

        function addSumSeries(data) {
            //this adds a series record it
            recordSeriesName("Sum", false, 'line', data);

            // loop the keys so that we get all of them
            data.series.forEach(function (day) {
                var sum = 0;
                data.settings.people.forEach(function (person) {
                    //not planning on not having one but just in case
                    sum += day[person] || 0;
                });

                //put the data point on the day 
                day.Sum = sum;
            });

        }

        function addTrendLine(data) {

            function makeTrendLineFun(data) {
                //make it the correct format
                var sumDataSet = data.series.map(function (item, index) {
                        return [index, item.Sum];
                    }),
                    calcLinearReg = ss.linearRegression(sumDataSet),
                    makeFun = ss.linearRegressionLine(calcLinearReg);

                return makeFun;
            }

            var trendLineFun = makeTrendLineFun(data),
                currentY = 1, //just to enter while loop
                x = -1,
                pointsCountMax = 25;

            //this adds a series record it
            recordSeriesName("Trend", true, 'line', data);

            //add points to Trend until it gets to 0 or we have too many
            while (currentY >= 0 && x < pointsCountMax) {
                //next round
                x += 1;
                //round it down
                currentY = trendLineFun(x);
                //currentY = trendLineFun(x);

                //make sure that we have a place to save it
                if (typeof data.series[x] === "undefined") {
                    data.series[x] = {};
                }

                //save the value to the series 
                if (currentY < 0) {
                    //must be the last round
                    data.series[x].Trend = 0;

                } else {
                    data.series[x].Trend = currentY;
                }
            }

        }

        function fixDates(data) {
            //redo all the dates in case we are missing any from the trendlines
            data.series.forEach(function (day, index) {
                var dayZero = moment(data.settings.startDate, constants.DATE_FORMAT);
                day.Date = dayZero.add(index, 'days').format(constants.DATE_FORMAT);
            });
        }

        addSumSeries(data);
        addTrendLine(data);
        fixDates(data);

        //add vert Due  date line on graph

        //convertToC3JSON(data);

        return data;
    }


    function makeChart(data) {


        function makeGraphKeys(data) {
            function byShowIt(series) {
                return series.showIt;
            }

            function toNames(series) {
                return series.name;
            }

            var namesToShow = data.settings.addedSeries
                .filter(byShowIt)
                .map(toNames);

            return data.settings.people.concat(namesToShow);
        }

        function makeTypesObj(data) {
            function makeNameToType(objOut, series) {
                objOut[series.name] = series.type;
                return objOut;
            }

            return data.settings.addedSeries.reduce(makeNameToType, {});

        }

        var chartSettings = {
            bindto: '#chart',
            data: {
                json: data.series,
                keys: {
                    x: 'Date',
                    value: makeGraphKeys(data),
                },
                type: 'bar',
                types: makeTypesObj(data),
                groups: [data.settings.people]
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
                        culling: false
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
        makeChart(fixUpData(data));
    }

    return plot;

}())
