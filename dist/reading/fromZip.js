"use strict";

exports.__esModule = true;
exports.default = void 0;

var _readableStream = require("readable-stream");

var _duplexify = _interopRequireDefault(require("duplexify"));

var _through = _interopRequireDefault(require("through2"));

var _merge = _interopRequireDefault(require("merge2"));

var _unzip = _interopRequireDefault(require("../fs/unzip"));

var _parseFile = _interopRequireDefault(require("./parseFile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Outputs GeoJSON Features
// fromZip is for formats where gdal reads from the unzipped folder
var _default = ({
  fileFilter,
  parser = _parseFile.default
}) => {
  const inStream = (0, _through.default)();
  const outStream = (0, _merge.default)({
    objectMode: true
  });

  const out = _duplexify.default.obj(inStream, outStream); // start the work


  (0, _unzip.default)(inStream, {
    fileFilter
  }).then(({
    files,
    done
  }) => {
    if (files.length === 0) {
      out.destroy(new Error('Invalid file, nothing found!'));
      return;
    }

    (0, _readableStream.finished)(out, done);
    files.forEach(f => {
      try {
        outStream.add(parser(f));
      } catch (err) {
        out.destroy(err);
      }
    });
  }).catch(err => {
    inStream.emit('error', err); // triggers destroy of everything
  });
  return out;
};

exports.default = _default;
module.exports = exports.default;