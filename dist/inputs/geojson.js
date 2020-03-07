"use strict";

exports.__esModule = true;
exports.default = void 0;

var _jsonstreamNext = _interopRequireDefault(require("jsonstream-next"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = () => _jsonstreamNext.default.parse('features.*');

exports.default = _default;
module.exports = exports.default;