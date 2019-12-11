"use strict";

exports.__esModule = true;
exports.default = void 0;

var _fromZip = _interopRequireDefault(require("../reading/fromZip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Outputs GeoJSON Features
const fileFilter = path => path.match(/\.shp$/i);

var _default = () => (0, _fromZip.default)({
  fileFilter
});

exports.default = _default;
module.exports = exports.default;