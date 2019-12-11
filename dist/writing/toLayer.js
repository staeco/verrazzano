"use strict";

exports.__esModule = true;
exports.default = void 0;

var _gdal = _interopRequireDefault(require("gdal"));

var _through = _interopRequireDefault(require("through2"));

var _wkx = _interopRequireDefault(require("wkx"));

var _isIsoDate = _interopRequireDefault(require("is-iso-date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const wgs84 = _gdal.default.SpatialReference.fromEPSG(4326);

const getGeometry = v => _gdal.default.Geometry.fromWKB(_wkx.default.Geometry.parseGeoJSON(v.geometry || v).toWkb());

const isInt = n => n % 1 === 0;

const getFieldType = v => {
  if (Array.isArray(v)) {
    if (v.length === 0) return;
    const subType = getFieldType(v[0]);
    if (subType === _gdal.default.OFTInteger) return _gdal.default.OFTIntegerList;
    if (subType === _gdal.default.OFTReal) return _gdal.default.OFTRealList;
    if (subType === _gdal.default.OFTString) return _gdal.default.OFTStringList;
    return;
  }

  if (Buffer.isBuffer(v)) return _gdal.default.OFTBinary;

  if (typeof v === 'number') {
    if (isInt(v)) return _gdal.default.OFTInteger;
    return _gdal.default.OFTReal;
  }

  if (typeof v === 'boolean') return _gdal.default.OFTInteger;
  if ((0, _isIsoDate.default)(v)) return _gdal.default.OFTDateTime;
  if (typeof v === 'string') return _gdal.default.OFTString;
};

var _default = (path, driver, {
  layer = 'Export',
  geometryType = _gdal.default.wkbUnknown
} = {}) => {
  const outFile = _gdal.default.open(path, 'w', driver);

  const currentLayer = outFile.layers.create(layer, wgs84, geometryType);
  const layerFields = {};

  const setField = (newFeat, k, v) => {
    // TODO: fix gdal malloc errors
    const fieldType = getFieldType(v);
    if (!fieldType) return; // cant represent this in gdal, skip

    if (!layerFields[k]) {
      layerFields[k] = fieldType;
      currentLayer.fields.add(new _gdal.default.FieldDefn(k, fieldType));
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
    const newFeat = new _gdal.default.Feature(currentLayer);
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