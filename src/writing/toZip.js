import { finished } from 'stream'
import toFile from './toFile'
import zip from '../fs/zip'

// gdal writes to a folder
// we zip the folder then pipe out the zip file contents
const reader = async (tmpFolder) => {
  const zipFile = await zip(tmpFolder, { cleanup: false })
  const outStream = zipFile.file.read()
  finished(outStream, () => zipFile.done())
  return outStream
}
export default ({ driver }, opt) =>
  toFile({ driver, reader }, opt)
