const moment = require('moment');
let weekday = moment().format('dddd');
let calendar = []
exports.gtfsCalendar = () => {
    if ( weekday == "Sunday")  {
        calendar  = ['SU','WE']
    } else if (weekday == "Saturday") {
        calendar  = ['SA','WE']
    } else {
        calendar  = ['WD']
    }
    return  calendar
}