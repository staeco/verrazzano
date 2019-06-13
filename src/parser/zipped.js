import { finished } from 'stream'
import duplexify from 'duplexify'
import through2 from 'through2'
import merge from 'merge2'
import unzip from '../unzip'
import gdalParser from './file'

const before = '{"type":"FeatureCollection","features":['
const after = ']}'


// Outputs GeoJSON Features
export default (fileFilter) => {
  const inStream = through2()
  const outStream = merge()
  const out = duplexify.obj(inStream, outStream)

  // start the work
  outStream.write(before)
  outStream.once('queueDrain', () => {
    outStream.write(after)
  })
  unzip(inStream, fileFilter)
    .catch((err) => {
      inStream.emit('error', err) // triggers destroy of everything
    })
    .then(({ files, done }) => {
      finished(out, done)
      files.forEach((f) => {
        try {
          outStream.add(gdalParser(f))
        } catch (err) {
          out.destroy(err)
        }
      })
    })
  return out
}
