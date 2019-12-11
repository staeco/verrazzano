"use strict";

exports.__esModule = true;
exports.default = void 0;

var _toFile = _interopRequireDefault(require("../writing/toFile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Outputs a KML file stream
var _default = opt => (0, _toFile.default)({
  driver: 'KML'
}, opt);

exports.default = _default;
module.exports = exports.default;