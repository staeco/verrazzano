"use strict";

exports.__esModule = true;
exports.default = void 0;

var _util = require("util");

var _child_process = require("child_process");

const execAsync = (0, _util.promisify)(_child_process.exec);

var _default = async path => {
  const {
    stdout,
    stderr
  } = await execAsync(`ogrinfo "${path}" -ro -so -q`);
  return {
    stdout,
    stderr
  };
};

exports.default = _default;
module.exports = exports.default;