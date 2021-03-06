import { finished, PassThrough } from 'stream'
import duplexify from 'duplexify'
import merge from 'merge2'
import createFile from '../fs/file'
import gdalParser from './parseFile'

// Outputs GeoJSON Features
// fromZip is for formats where gdal reads from a single file
export default ({ extension, parser = gdalParser }) => {
  const inStream = new PassThrough()
  const outStream = merge({ objectMode: true })
  const out = duplexify.obj(inStream, outStream)

  // start the work
  createFile(inStream, extension)
    .then(({ file, done }) => {
      finished(out, done)
      try {
        outStream.add(parser(file.path))
      } catch (err) {
        out.destroy(err)
      }
    })
    .catch((err) => {
      inStream.emit('error', err) // triggers destroy of everything
    })
  return out
}
