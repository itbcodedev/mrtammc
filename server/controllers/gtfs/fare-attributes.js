const FareAttribute = require('../../models/gtfs/fare-atttribute');

/*
 * Returns an array of fare_attributes that match the query parameters.
 */
exports.getFareAttributes = (query = {}, projection = '-_id', options = {lean: true, timeout: true}) => {
  return FareAttribute.find(query, projection, options);
};
