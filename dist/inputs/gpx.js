"use strict";

exports.__esModule = true;
exports.default = void 0;

var _through = _interopRequireDefault(require("through2"));

var _pumpify = _interopRequireDefault(require("pumpify"));

var _fromFile = _interopRequireDefault(require("../reading/fromFile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const heartRegex = /<gpxtpx:hr>(\d*)<\/gpxtpx:hr>/; // Outputs GeoJSON Features

var _default = () => {
  const out = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: []
    }
  };

  const accumulate = (feat, _, cb) => {
    if (feat.geometry.type === 'MultiLineString') return cb(); // skip the aggregated

    const {
      time,
      ele,
      gpxtpx_TrackPointExtension
    } = feat.properties; // pull in elevation in a standard way

    out.geometry.coordinates.push(ele ? [...feat.geometry.coordinates, ele] : feat.geometry.coordinates); // every gpx should have time, but just in case treat it as if it were optional

    if (time) {
      if (!out.properties.times) out.properties.times = [];
      out.properties.times.push(time);
    }

    if (gpxtpx_TrackPointExtension) {
      // support for heart rate extension, if specified
      const match = heartRegex.exec(gpxtpx_TrackPointExtension);

      if (match) {
        if (!out.properties.heartRates) out.properties.heartRates = [];
        out.properties.heartRates.push(parseFloat(match[1]));
      }
    }

    cb();
  };

  return _pumpify.default.obj((0, _fromFile.default)({
    extension: '.gpx'
  }), _through.default.obj(accumulate, function (cb) {
    this.push(out);
    cb();
  }));
};

exports.default = _default;
module.exports = exports.default;