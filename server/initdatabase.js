const {init, DATABASE} = require('./initdb');

const Agency = require('./models/gtfs/agency')
const CalendarDate = require('./models/gtfs/calendar-date')
const Calendar = require('./models/gtfs/calendar')
const FareAttribute =  require('./models/gtfs/fare-atttribute')
const FareRule = require('./models/gtfs/fare-rule')
const FeedInfo = require('./models/gtfs/feed-info')
const Frequency = require('./models/gtfs/level')
const Level = require('./models/gtfs/level')
const Pathway = require('./models/gtfs/pathway')
const Route = require('./models/gtfs/route')
const Shape = require('./models/gtfs/shape')
const StopTime = require('./models/gtfs/stop-time')
const Stop = require('./models/gtfs/stop')
const Transfer = require('./models/gtfs/transfer')
const Trip = require('./models/gtfs/trip')

const main = async () => {
  const result = await init()
  if (result) {
    console.log('Success initial database');
    console.log('Please Press Ctrl+c, to finish');
  } else {
    console.log('Unexpect error');
  }
  
}
main();

