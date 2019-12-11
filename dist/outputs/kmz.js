"use strict";

exports.__esModule = true;
exports.default = void 0;

var _toZip = _interopRequireDefault(require("../writing/toZip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Outputs a KMZ file stream
var _default = opt => (0, _toZip.default)({
  driver: 'KML'
}, opt);

exports.default = _default;
module.exports = exports.default;