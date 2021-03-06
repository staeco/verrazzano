"use strict";

exports.__esModule = true;
exports.default = void 0;

var _stream = require("stream");

var _gracefulFs = _interopRequireDefault(require("graceful-fs"));

var _kmlStream = _interopRequireDefault(require("kml-stream"));

var _fromZip = _interopRequireDefault(require("../reading/fromZip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Outputs GeoJSON Features
const fileFilter = path => path.match(/\.kml$/i);

function _ref() {}

const parser = path => (0, _stream.pipeline)(_gracefulFs.default.createReadStream(path), new _kmlStream.default(), _ref // noop
);

var _default = () => (0, _fromZip.default)({
  fileFilter,
  parser
});

exports.default = _default;
module.exports = exports.default;