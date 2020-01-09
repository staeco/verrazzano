import { finished } from 'stream'
import duplexify from 'duplexify'
import through2 from 'through2'
import merge from 'merge2'
import unzip from '../fs/unzip'

// Outputs GeoJSON Features
// fromZip is for formats where we read from the unzipped folder
export default ({ fileFilter, parser }) => {
  const inStream = through2()
  const outStream = merge()
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
