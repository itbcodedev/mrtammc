const moment = require('moment');
let weekday = moment().format('dddd');
let calendar = ''
exports.gtfsCalendar = () => {
    if ( weekday == "Sunday")  {
        calendar  = 'SU'
    } else if (weekday == "Saturday") {
        calendar  = 'SA'
    } else {
        calendar  = 'WD'
    }
    return  calendar
}