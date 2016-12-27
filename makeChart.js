/* estlint-env browser */
/* eslint no-console:0, no-unused-vars:0 */
/* global c3, ss, console */

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

    function addPaceLines(data) {
        var keys = Object.keys(data[0]);
        console.log("keys:", keys);

        function getSumDataSet(item, index) {
            var sum = 0;

            // loop the keys so that we get all of them
            keys.forEach(function (key) {
                sum += item[key];
            });

            return [index, sum];
        }

        function addPaceVals() {

        }

        var sumDataSet = data.map(getSumDataSet),
            lineFun = ss.linearRegressionLine(ss.linearRegression(sumDataSet)),
            currentY = lineFun(0),
            x = -1,
            maxNumberOfPlottedPoints = 25;
        //plot points until it crosses x axes or we have too many
        while (currentY > 0 && x < maxNumberOfPlottedPoints) {
            x += 1;
            currentY = lineFun(x);
            if (typeof data[x] === "undefined") {
                data[x] = {};
            }
            //save the value to the series rounded down
            data[x].Pace = Math.floor(currentY);
        }

        //console.log(sumDataSet);

    }

    function convertToC3JSON(data) {
        var dataObj = {},
            keys = Object.keys(data[0]);
        console.log("keys:", keys);

        //for each key in the first obj get the all the data points in the col that goes with it
        keys.forEach(function (key) {
            dataObj[key] = data.map(function (point) {
                //get the value or get a val of 0
                return point[key] || 0;
            })
        });
        console.log("C3 JSON dataObj:", dataObj);
        return dataObj;
    }

    addPaceLines(data);
    console.log("fixed data:", data);
    return convertToC3JSON(data);
}


function makeChart(dataIn) {
    function makeGroups(data) {
        var skip = ["Pace"],
            list = Object.keys(data).filter(function (name) {
                //keep the names not on the skip list
                return skip.indexOf(name) === -1;
            });
        console.log("seriers that are in the bars group", list);
        return list;
    }

    var chartSettings = {
        bindto: '#chart',
        data: {
            json: dataIn,
            type: 'bar',
            types: {
                "Pace": 'line'
            },
            groups: [makeGroups(data)]
        },
        axis: {
            y: {
                label: {
                    text: 'Y Label',
                    position: 'outer-middle'
                }
            }
        }
    };

    //make chart
    c3.generate(chartSettings);
}

var dataStart = [
    {
        Josh: 30,
        Corey: 200
    },
    {
        Josh: 20,
        Corey: 130
    },
    {
        Josh: 50,
        Corey: 90
    },
    {
        Josh: 40,
        Corey: 40
    },
    {
        Josh: 60,
        Corey: 130
    },
    {
        Josh: 50,
        Corey: 20
    }
];

var dataEnd = fixUpData(dataStart);

console.log("converted:", dataEnd);

var data = {
    "Josh": [30, 20, 50, 40, 60, 50],
    "Corey": [200, 130, 90, 240, 130, 220]
};

makeChart(dataEnd);
