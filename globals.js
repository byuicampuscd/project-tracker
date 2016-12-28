/* eslint-env browser */
/* eslint no-unused-vars:0 */
/* global moment*/

var constants = {
    DATE_FORMAT: "YYYY-MM-DD"
}

function dateIn(year, month, day) {
    if (year.toString(10).length !== 4) {
        throw new Error("Year '" + year + "' is not length 4.");
    }
    return moment(year + '-' + month + '-' + day, constants.DATE_FORMAT).format(constants.DATE_FORMAT);
}
