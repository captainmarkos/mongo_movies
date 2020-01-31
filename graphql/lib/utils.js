const {ObjectID } = require('mongodb');

const isLeapYear = (yr) => {
    return (yr % 400 === 0) || (yr % 4 === 0 && yr % 100 !== 0);                                                           
};

const isValidDate = (date_string) => {
    // Because Date(0) and Date(null) will return a date.
    if (!date_string) { return false; }

    try {
        let d = new Date(date_string);
        if (d.toString() === 'Invalid Date') { return false; }
    } catch (e) {
        console.log('--> Exception caught: ', e.toString());
        return false;
    }
    return true;
};

const isValidMongoID = (id) => {
    try {
        let mongo_id = ObjectID(id);
        if (id !== mongo_id.toString()) { return false; }
    } catch (e) {
        return false;
    }
    return true;
};

const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};

/*
const isValidDate = (date_string) => {
    // Assumes the format of date_string is YYYY-MM-DD.
    const months = [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ];
    const days_in_month = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    try {
        let parts = date_string.split('-');

        if (isLeapYear(parseInt(parts[0], 10))) { days_in_month[1] = 29; }
        if (!date_string.match(/^\d{4}-\d{2}-\d{2}$/)) { return false; }

        // validate year
        if (parts[0].length !== 4) { return false; }
        if (parts[0] === '0000') { return false; }

        // validate month
        if (!months.includes(parts[1])) { return false; }

        // validate day
        if (parts[2].length !== 2) { return false; }
        if (parts[2] === '00') { return false; }

        let month_idx = parseInt(parts[1], 10);
        if (parseInt(parts[2], 10) > days_in_month[month_idx - 1]) { return false; }
    } catch (e) {
        return false;
    }

    return true;
};
*/

module.exports = { isEmptyObject, isValidMongoID, isLeapYear, isValidDate };
