import gdal from 'gdal'
import through2 from 'through2'
import { finished } from 'stream'
import duplexify from 'duplexify'
import tmp from '../fs/tmp'

//const wgs84 = gdal.SpatialReference.fromEPSG(4326)

// create a temp file, write features to gdal
// gdal writes to disk, then pump from disk to out stream
export default (driver) => {
  const outStream = duplexify()
  const tempFile = tmp()
  const outFile = gdal.open(tempFile.path, 'w', driver)
  //const layer = outFile.layers.create('Export', wgs84)

  const writeToDisk = through2.obj((feat, _, cb) => {
    // TODO
    cb()
  }, (cb) => {
    outFile.flush()
    cb()
  })

  finished(writeToDisk, (err) => {
    if (err) return outStream.emit('error', err)
    outStream.setReadable(tempFile.read())
  })
  outStream.setWritable(writeToDisk)
  finished(outStream, (err) => {
    if (err) outStream.emit('error', err)
    tempFile.destroy().catch(() => null)
  })
  return outStream
}
