/* estlint-env browser */
/* eslint no-console:0, no-unused-vars:0 */
/* global c3, ss, console, moment */

function fixDataLengths(data) {
    function getLongestLength(longest, current) {
        var length = data[current].length;
        return length > longest ? length : longest;
    }

    var dataKeys = Object.keys(data),
        maxLength = dataKeys[0].reduce(getLongestLength, 0);

    data.forEach(function (row) {})
}


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
            var dayZero = moment(data.settings.startDate, "YYYY-MM-DD");
            day.Date = dayZero.add(index, 'days').format("YYYY-MM-DD");
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
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: "%m-%d-%Y"
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


/*
    series:
        will have a value for each person in people, 
        will have a Date value 
        will not skip any dates
    
*/
var dataStart = {
    settings: {
        startDate: "16-01-01",
        dueDate: "16-01-01",
        people: ["Josh", "Corey"],
        addedSeries: []

    },
    series: [
        {
            Josh: 30,
            Corey: 20,
            Date: "16-01-01"
        },
        {
            Josh: 25,
            Corey: 19,
            Date: "16-01-02"
        },
        {
            Josh: 25,
            Corey: 19,
            Date: "16-01-03"
        },
        {
            Josh: 20,
            Corey: 18,
            Date: "16-01-04"
        },
        {
            Josh: 15,
            Corey: 17,
            Date: "16-01-05"
        },
        {
            Josh: 10,
            Corey: 16,
            Date: "16-01-06"
        }
]
}


var dataEnd = fixUpData(dataStart);

console.log("fixed Up data:", dataEnd);


makeChart(dataEnd);

/*var dataOld = [
    {
        Josh: 30,
        Corey: 20,
        Date: "2016-01-01"
    },
    {
        Date: "2016-01-02"
    },
    {
        Date: "2016-01-03"
    },
    {
        Josh: 20,
        Corey: 18,
        Date: "2016-01-04"
    },
    {
        Josh: 15,
        Corey: 17,
        Date: "2016-01-05"
    },
    {
        Josh: 10,
        Corey: 16,
        Date: "2016-01-06"
    },
    {
        Date: "2016-01-07"
    }
];
var data = {
    "Josh": [30, 20, 50, 40, 60, 50],
    "Corey": [200, 130, 90, 240, 130, 220]
};*/
