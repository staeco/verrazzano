"use strict";

exports.__esModule = true;
exports.default = void 0;

var _ogr2ogr = _interopRequireDefault(require("ogr2ogr"));

var _JSONStream = _interopRequireDefault(require("JSONStream"));

var _pumpify = _interopRequireDefault(require("pumpify"));

var _getLayers = _interopRequireDefault(require("./getLayers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (path, {
  format,
  flags = []
} = {}) => {
  const out = _pumpify.default.obj();

  const tail = _JSONStream.default.parse('features.*');

  const createHead = layer => (0, _ogr2ogr.default)(path, format).format('GeoJSON').project('crs:84').skipfailures().timeout(86400000) // 1 day in ms
  .options([...flags, '-mapFieldType', 'Date=String,Time=String']).onStderr(err => console.log(err)).stream();

  (0, _getLayers.default)(path).then(o => {
    console.log('abc', o);
    out.setPipeline(createHead(), tail);
  }).catch(err => out.destroy(err));
  return out;
};

exports.default = _default;
module.exports = exports.default;