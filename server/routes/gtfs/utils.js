const Agency = require('../../models/gtfs/agency');
const Route = require('../../models/gtfs/route');
const Trip = require('../../models/gtfs/trip');
const Stop = require('../../models/gtfs/stop');
const StopTime = require('../../models/gtfs/stop-time');
const Calendar = require('../../models/gtfs/calendar');
const CalendarDate = require('../../models/gtfs/calendar-date');
const FareAttribute = require('../../models/gtfs/fare-atttribute');
const FareRule = require('../../models/gtfs/fare-rule');
const Shape = require('../../models/gtfs/shape');
const Pathway = require('../../models/gtfs/pathway');
const Level = require('../../models/gtfs/level');

const Lists = [
  { model: "Agency", getModel: Agency },
  { model: "Route", getModel: Route },
  { model: "Trip", getModel: Trip },
  { model: "Stop", getModel: Stop },
  { model: "StopTime", getModel: StopTime },
  { model: "Calendar", getModel: Calendar },
  { model: "CalendarDate", getModel: CalendarDate },
  { model: "FareAttribute", getModel: FareAttribute },
  { model: "FareRule", getModel: FareRule },
  { model: "Shape", getModel: Shape },
  { model: "Pathway", getModel: Pathway },
  { model: "Level", getModel: Level },
]
exports.liveUpdate =  async (req, res, next) => {
    try {
      const editObject = Lists.filter((e) => { return e.model == req.params.model})[0].getModel
      const query = {_id: req.body[0]._id};
      const object = await editObject.findOneAndUpdate(query, req.body[0])
      res.status(201).json(object)
      //console.log('object', object)
    } catch (err) {
      next(err)
    }



}
