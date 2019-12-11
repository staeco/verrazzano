"use strict";

exports.__esModule = true;
exports.default = void 0;

var _stream = require("stream");

var _findit = _interopRequireDefault(require("findit2"));

var _child_process = require("child_process");

var _util = require("util");

var _tmp = _interopRequireDefault(require("./tmp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const asyncPipeline = (0, _util.promisify)(_stream.pipeline); // returns a stream that extracts specific files to a temp folder

var _default = async (inStream, {
  fileFilter,
  cleanup = true
}) => {
  const tmpZip = (0, _tmp.default)('.zip');
  const tmpFolder = (0, _tmp.default)();
  await asyncPipeline(inStream, tmpZip.write());
  await tmpFolder.mkdir();
  await new Promise((resolve, reject) => {
    const ps = (0, _child_process.spawn)('unzip', ['-d', tmpFolder.path, tmpZip.path]);
    ps.once('exit', code => {
      if (code >= 3) return reject(new Error(`Unzip error: Exit code ${code}`));
      resolve();
    });
  });
  if (cleanup) await tmpZip.destroy();
  const files = await new Promise((resolve, reject) => {
    const matches = [];
    const finder = (0, _findit.default)(tmpFolder.path);

    const match = f => {
      if (f.match(/__MACOSX/)) return; // mac meta files

      if (fileFilter(f)) matches.push(f);
    };

    finder.on('directory', match);
    finder.on('file', match);
    finder.once('error', reject);
    finder.once('end', () => {
      resolve(matches);
    });
  });
  return {
    folder: tmpFolder.path,
    files,
    done: () => {
      tmpFolder.destroy().catch(() => null);
    }
  };
};

exports.default = _default;
module.exports = exports.default;