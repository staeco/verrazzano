"use strict";

exports.__esModule = true;
exports.default = void 0;

var _stream = require("stream");

var _duplexify = _interopRequireDefault(require("duplexify"));

var _through = _interopRequireDefault(require("through2"));

var _merge = _interopRequireDefault(require("merge2"));

var _file = _interopRequireDefault(require("../fs/file"));

var _parseFile = _interopRequireDefault(require("./parseFile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Outputs GeoJSON Features
// fromZip is for formats where gdal reads from a single file
var _default = ({
  extension,
  parser = _parseFile.default
}) => {
  const inStream = (0, _through.default)();
  const outStream = (0, _merge.default)({
    objectMode: true
  });

  const out = _duplexify.default.obj(inStream, outStream); // start the work


  (0, _file.default)(inStream, extension).then(({
    file,
    done
  }) => {
    (0, _stream.finished)(out, done);

    try {
      outStream.add(parser(file.path));
    } catch (err) {
      out.destroy(err);
    }
  }).catch(err => {
    inStream.emit('error', err); // triggers destroy of everything
  });
  return out;
};

exports.default = _default;
module.exports = exports.default;