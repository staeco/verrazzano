"use strict";

exports.__esModule = true;
exports.default = void 0;

var _readableStream = require("readable-stream");

var _gracefulFs = _interopRequireDefault(require("graceful-fs"));

var _util = require("util");

var _tmp = _interopRequireDefault(require("../fs/tmp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const asyncPipeline = (0, _util.promisify)(_readableStream.pipeline);

function _ref() {
  return null;
}

var _default = async (inStream, ext) => {
  const tmpFile = (0, _tmp.default)(ext);
  await asyncPipeline(inStream, _gracefulFs.default.createWriteStream(tmpFile.path));
  return {
    file: tmpFile,
    done: () => {
      tmpFile.destroy().catch(_ref);
    }
  };
};

exports.default = _default;
module.exports = exports.default;