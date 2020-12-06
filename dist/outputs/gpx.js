"use strict";

exports.__esModule = true;
exports.default = void 0;

var _gdalNext = _interopRequireDefault(require("gdal-next"));

var _toFile = _interopRequireDefault(require("../writing/toFile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Outputs a GPX file stream
var _default = (opt = {}) => (0, _toFile.default)({
  driver: 'GPX'
}, {
  geometryType: _gdalNext.default.wkbLineString,
  ...opt
});

exports.default = _default;
module.exports = exports.default;