"use strict";

exports.__esModule = true;
exports.default = void 0;

var _gdalNext = _interopRequireDefault(require("gdal-next"));

var _through = _interopRequireDefault(require("through2"));

var _wkx = _interopRequireDefault(require("wkx"));

var _isIsoDate = _interopRequireDefault(require("is-iso-date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const wgs84 = _gdalNext.default.SpatialReference.fromEPSG(4326);

const getGeometry = v => _gdalNext.default.Geometry.fromWKB(_wkx.default.Geometry.parseGeoJSON(v.geometry || v).toWkb());

const isInt = n => n % 1 === 0;

const getFieldType = v => {
  if (Array.isArray(v)) {
    if (v.length === 0) return;
    const subType = getFieldType(v[0]);
    if (subType === _gdalNext.default.OFTInteger) return _gdalNext.default.OFTIntegerList;
    if (subType === _gdalNext.default.OFTReal) return _gdalNext.default.OFTRealList;
    if (subType === _gdalNext.default.OFTString) return _gdalNext.default.OFTStringList;
    return;
  }

  if (Buffer.isBuffer(v)) return _gdalNext.default.OFTBinary;

  if (typeof v === 'number') {
    if (isInt(v)) return _gdalNext.default.OFTInteger;
    return _gdalNext.default.OFTReal;
  }

  if (typeof v === 'boolean') return _gdalNext.default.OFTInteger;
  if ((0, _isIsoDate.default)(v)) return _gdalNext.default.OFTDateTime;
  if (typeof v === 'string') return _gdalNext.default.OFTString;
};

var _default = (path, driver, {
  layer = 'Export',
  geometryType = _gdalNext.default.wkbUnknown
} = {}) => {
  const outFile = _gdalNext.default.open(path, 'w', driver);

  const currentLayer = outFile.layers.create(layer, wgs84, geometryType);
  const layerFields = {};

  const setField = (newFeat, k, v) => {
    // TODO: fix gdal malloc errors
    const fieldType = getFieldType(v);
    if (!fieldType) return; // cant represent this in gdal, skip

    if (!layerFields[k]) {
      layerFields[k] = fieldType;
      currentLayer.fields.add(new _gdalNext.default.FieldDefn(k, fieldType));
    }

    if (layerFields[k] === fieldType) newFeat.fields.set(k, v);
  };

  const setFields = (newFeat, feat) => {
    if (!feat.properties) return;
    Object.entries(feat.properties).map(async ([k, v]) => {
      try {
        setField(newFeat, k, v);
      } catch (err) {// ignore
      }
    });
  };

  return _through.default.obj((feat, _, cb) => {
    const newFeat = new _gdalNext.default.Feature(currentLayer);
    setFields(newFeat, feat);
    newFeat.setGeometry(getGeometry(feat));
    currentLayer.features.add(newFeat);
    cb();
  }, cb => {
    outFile.flush();
    cb();
  });
};

exports.default = _default;
module.exports = exports.default;