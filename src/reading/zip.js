import { finished } from 'stream'
import duplexify from 'duplexify'
import through2 from 'through2'
import merge from 'merge2'
import unzip from '../files/unzip'
import gdalParser from './parseFile'

// Outputs GeoJSON Features
export default ({ fileFilter, parser=gdalParser }) => {
  const inStream = through2()
  const outStream = merge({ objectMode: true })
  const out = duplexify.obj(inStream, outStream)

  // start the work
  unzip(inStream, { fileFilter })
    .catch((err) => {
      inStream.emit('error', err) // triggers destroy of everything
    })
    .then(({ files, done }) => {
      finished(out, done)
      files.forEach((f) => {
        try {
          outStream.add(parser(f))
        } catch (err) {
          out.destroy(err)
        }
      })
    })
  return out
}
