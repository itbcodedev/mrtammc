const RouteFormat = require('../../models/non-standard/route-format')

// Find a single note with a noteId
exports.findAllRouteformat = (req, res) => {
    try {
        const  routeformats = await RouteFormat.find({});
        res.status(200).json(routeformats)
      } catch (err) {
        next(err)
      }
};

// Find a single note with a noteId
exports.createRouteformat = (req, res) => {
    try {
        const newRouteFormat = new Route(req.body)
        const routeformat = await newRouteFormat.save();
        res.status(201).json(routeformat)
      } catch (err) {
        next(err)
      }
};
