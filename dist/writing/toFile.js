"use strict";

exports.__esModule = true;
exports.default = void 0;

var _stream = require("stream");

var _duplexify = _interopRequireDefault(require("duplexify"));

var _toLayer = _interopRequireDefault(require("./toLayer"));

var _tmp = _interopRequireDefault(require("../fs/tmp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _ref() {
  return null;
}

// create a temp file, write features to gdal
// gdal writes to disk, then pump from disk to out stream
var _default = ({
  driver,
  reader
}, layerOptions) => {
  const outStream = _duplexify.default.obj();

  const fail = err => outStream.destroy(err);

  const tempFile = (0, _tmp.default)();
  const writeToDisk = (0, _toLayer.default)(tempFile.path, driver, layerOptions);
  (0, _stream.finished)(writeToDisk, {
    readable: false
  }, async err => {
    if (err) return fail(err);
    const readStream = reader ? await reader(tempFile).catch(fail) : tempFile.read();
    outStream.setReadable(readStream);
  });
  (0, _stream.finished)(outStream, err => {
    if (err) fail(err);
    tempFile.destroy().catch(_ref);
  });
  outStream.setWritable(writeToDisk);
  return outStream;
};

exports.default = _default;
module.exports = exports.default;