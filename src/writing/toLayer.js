import gdal from 'gdal'
import through2 from 'through2'
import wkx from 'wkx'
import isDate from 'is-iso-date'

const wgs84 = gdal.SpatialReference.fromEPSG(4326)
const getGeometry = (v) =>
  gdal.Geometry.fromWKB(wkx.Geometry.parseGeoJSON(v.geometry || v).toWkb())
const isInt = (n) => n % 1 === 0
const getFieldType = (v) => {
  if (Array.isArray(v)) {
    if (v.length === 0) return
    const subType = getFieldType(v[0])
    if (subType === gdal.OFTInteger) return gdal.OFTIntegerList
    if (subType === gdal.OFTReal) return gdal.OFTRealList
    if (subType === gdal.OFTString) return gdal.OFTStringList
    return
  }
  if (Buffer.isBuffer(v)) return gdal.OFTBinary
  if (typeof v === 'number') {
    if (isInt(v)) return gdal.OFTInteger
    return gdal.OFTReal
  }
  if (typeof v === 'boolean') return gdal.OFTInteger
  if (isDate(v)) return gdal.OFTDateTime
  if (typeof v === 'string') return gdal.OFTString
}

export default (path, driver, { layer='Export', geometryType=gdal.wkbUnknown }={}) => {
  const outFile = gdal.open(path, 'w', driver)
  const currentLayer = outFile.layers.create(layer, wgs84, geometryType)
  const layerFields = {}
  const setField = (newFeat, k, v) => {
    // TODO: fix gdal malloc errors
    const fieldType = getFieldType(v)
    if (!fieldType) return // cant represent this in gdal, skip
    if (!layerFields[k]) {
      layerFields[k] = fieldType
      currentLayer.fields.add(new gdal.FieldDefn(k, fieldType))
    }
    if (layerFields[k] === fieldType) newFeat.fields.set(k, v)
  }
  const setFields = (newFeat, feat) => {
    if (!feat.properties) return
    Object.entries(feat.properties).map(async ([ k, v ]) => {
      try {
        setField(newFeat, k, v)
      } catch (err) {
        // ignore
      }
    })
  }
  return through2.obj((feat, _, cb) => {
    const newFeat = new gdal.Feature(currentLayer)
    setFields(newFeat, feat)
    newFeat.setGeometry(getGeometry(feat))
    currentLayer.features.add(newFeat)
    cb()
  }, (cb) => {
    outFile.flush()
    cb()
  })
}
