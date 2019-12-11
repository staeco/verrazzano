"use strict";

exports.__esModule = true;
exports.default = void 0;

var _from = _interopRequireDefault(require("from2"));

var _gdal = _interopRequireDefault(require("gdal"));

var _lodash = _interopRequireDefault(require("lodash.mapvalues"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const wgs84 = _gdal.default.SpatialReference.fromEPSG(4326);

const isGDALDate = v => v && typeof v === 'object' && v.year != null && v.month != null && v.day != null;

const parseGDALDate = time => {
  const utcTime = Date.UTC(time.year || 0, time.month - 1 || 0, time.day || 0, time.hour || 0, time.minute - 1 || 0, time.second || 0);
  if (!time.timezone) return new Date(utcTime).toISOString();
  const offset = 60000 * (time.timezone / 100);
  return new Date(utcTime + offset).toISOString();
};

const fixDates = v => isGDALDate(v) ? parseGDALDate(v) : v; // GDAL File -> GeoJSON Features
// Inspired by shp2json


var _default = path => {
  const file = _gdal.default.open(path);

  const layerCount = file.layers.count();
  let nextLayer = 0;
  let currentLayer, currentTransformation;

  const getNextLayer = () => {
    currentLayer = file.layers.get(nextLayer++);
    currentTransformation = new _gdal.default.CoordinateTransformation(currentLayer.srs || wgs84, wgs84);
  };

  getNextLayer();
  return _from.default.obj(function (size, next) {
    let pushed = 0;

    const writeFeature = () => {
      const isLastLayer = nextLayer === layerCount; // grab the feature we're working with

      let feature = currentLayer.features.next();

      if (!feature) {
        if (isLastLayer) {
          // we hit the end of the final layer, finish
          this.push(null);
          return;
        } // we hit the end of the layer, go to the next layer and continue


        getNextLayer();
        feature = currentLayer.features.next();
      } // get the geometry and project the coordinates


      let geometry;

      try {
        geometry = feature.getGeometry();
        if (geometry) geometry.transform(currentTransformation);
      } catch (e) {
        return process.nextTick(writeFeature); // go to next feature in layer
      }

      const featureObject = {
        type: 'Feature',
        properties: (0, _lodash.default)(feature.fields.toObject(), fixDates),
        geometry: geometry ? geometry.toObject() : undefined
      };
      ++pushed;
      this.push(featureObject);
      if (pushed >= size) return next(null); // no more space available to write, write what we have and wait

      process.nextTick(writeFeature); // more space available to write, go to next feature in layer
    };

    writeFeature();
  });
};

exports.default = _default;
module.exports = exports.default;