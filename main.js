/* eslint-env browser */
/* eslint */
/* global dateIn, graphMaker*/

/*
    series:
        will have a value for each person in people, 
        will have a Date value 
        will not skip any dates
    
*/
var dataStart = {
    settings: {
        startDate: dateIn(2016, 1, 1),
        dueDate: dateIn(2016, 1, 11),
        people: ["Josh", "Corey"],
        addedSeries: []

    },
    series: [
        {
            Josh: 30,
            Corey: 20,
            Date: dateIn(2016, 1, 1)
        },
        {
            Josh: 25,
            Corey: 19,
            Date: dateIn(2016, 1, 2)
        },
        {
            Josh: 25,
            Corey: 19,
            Date: dateIn(2016, 1, 3)
        },
        {
            Josh: 20,
            Corey: 18,
            Date: dateIn(2016, 1, 4)
        },
        {
            Josh: 15,
            Corey: 17,
            Date: dateIn(2016, 1, 5)
        },
        {
            Josh: 10,
            Corey: 16,
            Date: dateIn(2016, 1, 6)
        }
]
};


/*
var data = {
    settings: {
        startDate: dateIn(2016, 1, 1),
        dueDate: dateIn(2016, 1, 11),
        people: ["Josh", "Corey"],
        addedSeries: []

    },
    series: [
        {
            name: "Josh",
            data: [{
                    x: dateIn(2016, 1, 1),
                    y: 30
                }, {
                    x: dateIn(2016, 1, 2),
                    y: 25
                }, {
                    x: dateIn(2016, 1, 3),
                    y: 20
                }, {
                    x: dateIn(2016, 1, 4),
                    y: 15
                }, {
                    x: dateIn(2016, 1, 5),
                    y: 10
                }, {
                    x: dateIn(2016, 1, 6),
                    y: 5
                }
                  ]
        }, {
            name: "Corey",
            data: [{
                    x: dateIn(2016, 1, 1),
                    y: 20
                }, {
                    x: dateIn(2016, 1, 2),
                    y: 19
                }, {
                    x: dateIn(2016, 1, 3),
                    y: 19
                }, {
                    x: dateIn(2016, 1, 4),
                    y: 18
                }, {
                    x: dateIn(2016, 1, 5),
                    y: 17
                }, {
                    x: dateIn(2016, 1, 6),
                    y: 16
                }
            ]
        }
    ]
}

*/

graphMaker(dataStart);
