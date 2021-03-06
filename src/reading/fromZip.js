import { finished, PassThrough } from 'stream'
import duplexify from 'duplexify'
import merge from 'merge2'
import unzip from '../fs/unzip'
import gdalParser from './parseFile'

// Outputs GeoJSON Features
// fromZip is for formats where gdal reads from the unzipped folder
export default ({ fileFilter, parser = gdalParser }) => {
  const inStream = new PassThrough()
  const outStream = merge({ objectMode: true })
  const out = duplexify.obj(inStream, outStream)

  // start the work
  unzip(inStream, { fileFilter })
    .then(({ files, done }) => {
      if (files.length === 0) {
        out.destroy(new Error('Invalid file, nothing found!'))
        return
      }
      finished(out, done)
      files.forEach((f) => {
        try {
          outStream.add(parser(f))
        } catch (err) {
          out.destroy(err)
        }
      })
    })
    .catch((err) => {
      inStream.emit('error', err) // triggers destroy of everything
    })
  return out
}
