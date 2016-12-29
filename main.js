/* eslint-env browser */
/* eslint */
/* global dateIn, graphMaker*/

/*
    series:
        will have a value for each person in people, 
        will have a Date value 
        will not skip any dates
    
*/

var data = {
    settings: {
        startDate: dateIn(2016, 1, 1),
        dueDate: dateIn(2016, 1, 5),
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

graphMaker(data);
