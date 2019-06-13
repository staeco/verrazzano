import { finished } from 'stream'
import duplexify from 'duplexify'
import through2 from 'through2'
import merge from 'merge2'
import createFile from '../files/file'
import gdalParser from './parseFile'

// Outputs GeoJSON Features
export default ({ extension, parser=gdalParser }) => {
  const inStream = through2()
  const outStream = merge({ objectMode: true })
  const out = duplexify.obj(inStream, outStream)

  // start the work
  createFile(inStream, extension)
    .catch((err) => {
      inStream.emit('error', err) // triggers destroy of everything
    })
    .then(({ file, done }) => {
      finished(out, done)
      try {
        outStream.add(parser(file))
      } catch (err) {
        out.destroy(err)
      }
    })
  return out
}
