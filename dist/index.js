"use strict";

exports.__esModule = true;
exports.to = exports.from = void 0;

var _gdb = _interopRequireDefault(require("./inputs/gdb"));

var _gpx = _interopRequireDefault(require("./inputs/gpx"));

var _kml = _interopRequireDefault(require("./inputs/kml"));

var _kmz = _interopRequireDefault(require("./inputs/kmz"));

var _shp = _interopRequireDefault(require("./inputs/shp"));

var _geojson = _interopRequireDefault(require("./inputs/geojson"));

var _gpx2 = _interopRequireDefault(require("./outputs/gpx"));

var _kml2 = _interopRequireDefault(require("./outputs/kml"));

var _kmz2 = _interopRequireDefault(require("./outputs/kmz"));

var _shp2 = _interopRequireDefault(require("./outputs/shp"));

var _geojson2 = _interopRequireDefault(require("./outputs/geojson"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const inputs = {
  gdb: _gdb.default,
  gpx: _gpx.default,
  kml: _kml.default,
  kmz: _kmz.default,
  shp: _shp.default,
  geojson: _geojson.default
};
const outputs = {
  gpx: _gpx2.default,
  kml: _kml2.default,
  kmz: _kmz2.default,
  shp: _shp2.default,
  geojson: _geojson2.default
};

const from = (type, opt) => {
  if (!inputs[type]) throw new Error('Invalid from() type!');
  return inputs[type](opt);
};

exports.from = from;

const to = (type, opt) => {
  if (!outputs[type]) throw new Error('Invalid to() type!');
  return outputs[type](opt);
};

exports.to = to;