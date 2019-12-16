"use strict";

exports.__esModule = true;
exports.default = void 0;

var _fromFile = _interopRequireDefault(require("../ogr2ogr/fromFile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Outputs GeoJSON Features
var _default = () => (0, _fromFile.default)({
  extension: '.shp.zip',
  parserOptions: {
    format: 'ESRI Shapefile'
  }
});

exports.default = _default;
module.exports = exports.default;