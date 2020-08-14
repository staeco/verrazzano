import { finished } from 'readable-stream'
import duplexify from 'duplexify'
import toLayer from './toLayer'
import tmp from '../fs/tmp'

// create a temp file, write features to gdal
// gdal writes to disk, then pump from disk to out stream
export default ({ driver, reader }, layerOptions) => {
  const outStream = duplexify.obj()
  const fail = (err) => outStream.destroy(err)
  const tempFile = tmp()
  const writeToDisk = toLayer(tempFile.path, driver, layerOptions)

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
