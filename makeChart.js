/* estlint-env browser */
/* global c3 */

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
    function addTotals(item) {

        return item;

    }

    function addPaceLine(item) {


    }

    data = data
        .map(addTotals)
        .map(addPaceLine);

}


function makeChart(data) {
    function makeGroups(data) {
        var skip = ["pace"];
        return Object.keys(data).filter(function (name) {
            return skip.indexOf(name) === -1;
        });

    }

    var chartSettings = {
        bindto: '#chart',
        data: {
            json: data,
            type: 'bar',
            types: {
                "pace": 'bar'
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
        Corey: 240
    },
    {
        Josh: 60,
        Corey: 130
    },
    {
        Josh: 50,
        Corey: 220
    }
];




var data = {
    "Josh": [30, 20, 50, 40, 60, 50],
    "Corey": [200, 130, 90, 240, 130, 220]
};

makeChart(data);
