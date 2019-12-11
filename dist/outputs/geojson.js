"use strict";

exports.__esModule = true;
exports.default = void 0;

var _JSONStream = _interopRequireDefault(require("JSONStream"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = () => _JSONStream.default.stringify('{"type":"FeatureCollection","features":[', ',', ']}');

exports.default = _default;
module.exports = exports.default;