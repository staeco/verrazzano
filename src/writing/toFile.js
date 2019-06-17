import gdal from 'gdal'
import through2 from 'through2'
import { finished } from 'stream'
import duplexify from 'duplexify'
import wkx from 'wkx'
import isDate from 'is-iso-date'
import tmp from '../fs/tmp'

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

// create a temp file, write features to gdal
// gdal writes to disk, then pump from disk to out stream
export default ({ driver, reader }, { layer='Export', geometryType=gdal.wkbUnknown }={}) => {
  const outStream = duplexify.obj()
  const fail = (err) => outStream.destroy(err)
  const tempFile = tmp()
  const outFile = gdal.open(tempFile.path, 'w', driver)
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
  const setFields =(newFeat, feat) => {
    if (!feat.properties) return
    Object.entries(feat.properties).map(async ([ k, v ]) => {
      try {
        setField(newFeat, k, v)
      } catch (err) {
        // ignore
      }
    })
  }
  const writeToDisk = through2.obj((feat, _, cb) => {
    const newFeat = new gdal.Feature(currentLayer)
    setFields(newFeat, feat)
    newFeat.setGeometry(getGeometry(feat))
    currentLayer.features.add(newFeat)
    cb()
  }, (cb) => {
    outFile.flush()
    cb()
  })

  finished(writeToDisk, { readable: false }, async (err) => {
    if (err) return fail(err)
    const readStream = reader ? await reader(tempFile).catch(fail) : tempFile.read()
    outStream.setReadable(readStream)
  })
  finished(outStream, (err) => {
    if (err) fail(err)
    tempFile.destroy().catch(() => null)
  })
  outStream.setWritable(writeToDisk)
  return outStream
}
