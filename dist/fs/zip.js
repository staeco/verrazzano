"use strict";

exports.__esModule = true;
exports.default = void 0;

var _child_process = require("child_process");

var _tmp = _interopRequireDefault(require("./tmp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// returns a stream that zips a folder
var _default = async (tmpFolder, {
  cleanup = true
}) => {
  const tmpZip = (0, _tmp.default)('.zip');
  await new Promise((resolve, reject) => {
    const ps = (0, _child_process.spawn)('zip', ['-r9', tmpZip.path, tmpFolder.path]);
    ps.once('exit', code => {
      if (code >= 3) return reject(new Error(`Zip error: Exit code ${code}`));
      resolve();
    });
  });
  if (cleanup) await tmpFolder.destroy();
  return {
    file: tmpZip,
    done: () => {
      tmpZip.destroy().catch(() => null);
    }
  };
};

exports.default = _default;
module.exports = exports.default;