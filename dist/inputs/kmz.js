"use strict";

exports.__esModule = true;
exports.default = void 0;

var _readableStream = require("readable-stream");

var _gracefulFs = _interopRequireDefault(require("graceful-fs"));

var _kmlStream = _interopRequireDefault(require("kml-stream"));

var _fromZip = _interopRequireDefault(require("../reading/fromZip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Outputs GeoJSON Features
const fileFilter = path => path.match(/\.kml$/i);

function _ref() {}

const parser = path => (0, _readableStream.pipeline)(_gracefulFs.default.createReadStream(path), (0, _kmlStream.default)(), _ref // noop
);

var _default = () => (0, _fromZip.default)({
  fileFilter,
  parser
});

exports.default = _default;
module.exports = exports.default;