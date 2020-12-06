"use strict";

exports.__esModule = true;
exports.default = void 0;

var _gracefulFs = _interopRequireDefault(require("graceful-fs"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _tempfile = _interopRequireDefault(require("tempfile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = ext => {
  const path = (0, _tempfile.default)(ext);

  function _ref(resolve, reject) {
    return _gracefulFs.default.unlink(path, err => err ? reject(err) : resolve());
  }

  return {
    path,
    mkdir: () => (0, _mkdirp.default)(path),
    write: () => _gracefulFs.default.createWriteStream(path),
    read: () => _gracefulFs.default.createReadStream(path),
    destroy: () => new Promise(_ref)
  };
};

exports.default = _default;
module.exports = exports.default;