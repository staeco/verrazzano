import { finished } from 'stream'
import duplexify from 'duplexify'
import through2 from 'through2'
import merge from 'merge2'
import createFile from '../fs/file'
import fileParser from './parseFile'

// Outputs GeoJSON Features
export default ({ extension, parserOptions }) => {
  const inStream = through2()
  const outStream = merge()
  const out = duplexify.obj(inStream, outStream)

  // start the work
  createFile(inStream, extension)
    .then(({ file, done }) => {
      finished(out, done)
      try {
        outStream.add(fileParser(file.path, parserOptions))
      } catch (err) {
        out.destroy(err)
      }
    })
    .catch((err) => {
      inStream.emit('error', err) // triggers destroy of everything
    })
  return out
}
