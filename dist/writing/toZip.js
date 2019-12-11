"use strict";

exports.__esModule = true;
exports.default = void 0;

var _stream = require("stream");

var _toFile = _interopRequireDefault(require("./toFile"));

var _zip = _interopRequireDefault(require("../fs/zip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// gdal writes to a folder
// we zip the folder then pipe out the zip file contents
const reader = async tmpFolder => {
  const zipFile = await (0, _zip.default)(tmpFolder, {
    cleanup: false
  });
  const outStream = zipFile.file.read();
  (0, _stream.finished)(outStream, () => zipFile.done());
  return outStream;
};

var _default = ({
  driver
}, opt) => (0, _toFile.default)({
  driver,
  reader
}, opt);

exports.default = _default;
module.exports = exports.default;