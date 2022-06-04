"use strict";

exports.__esModule = true;
exports.default = void 0;

var _gdalAsync = _interopRequireDefault(require("gdal-async"));

var _through = _interopRequireDefault(require("through2"));

var _isIsoDate = _interopRequireDefault(require("is-iso-date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const wgs84 = _gdalAsync.default.SpatialReference.fromProj4('+init=epsg:4326');

const getGeometry = v => _gdalAsync.default.Geometry.fromGeoJson(v.geometry || v);

const isInt = n => n % 1 === 0;

const getFieldType = v => {
  if (Array.isArray(v)) {
    if (v.length === 0) return;
    const subType = getFieldType(v[0]);
    if (subType === _gdalAsync.default.OFTInteger) return _gdalAsync.default.OFTIntegerList;
    if (subType === _gdalAsync.default.OFTReal) return _gdalAsync.default.OFTRealList;
    if (subType === _gdalAsync.default.OFTString) return _gdalAsync.default.OFTStringList;
    return;
  }

  if (Buffer.isBuffer(v)) return _gdalAsync.default.OFTBinary;

  if (typeof v === 'number') {
    if (isInt(v)) return _gdalAsync.default.OFTInteger;
    return _gdalAsync.default.OFTReal;
  }

  if (typeof v === 'boolean') return _gdalAsync.default.OFTInteger;
  if ((0, _isIsoDate.default)(v)) return _gdalAsync.default.OFTDateTime;
  if (typeof v === 'string') return _gdalAsync.default.OFTString;
};

var _default = (path, driver, {
  layer = 'Export',
  geometryType = _gdalAsync.default.wkbUnknown
} = {}) => {
  const outFile = _gdalAsync.default.open(path, 'w', driver);

  const currentLayer = outFile.layers.create(layer, wgs84, geometryType);
  const layerFields = {};

  const setField = (newFeat, k, v) => {
    const fieldType = getFieldType(v);
    if (!fieldType) return; // cant represent this in gdal, skip

    if (!layerFields[k]) {
      layerFields[k] = fieldType;
      currentLayer.fields.add(new _gdalAsync.default.FieldDefn(k, fieldType));
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
    const newFeat = new _gdalAsync.default.Feature(currentLayer);
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