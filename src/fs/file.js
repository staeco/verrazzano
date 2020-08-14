import { pipeline } from 'readable-stream'
import fs from 'graceful-fs'
import { promisify } from 'util'
import tmp from '../fs/tmp'

const asyncPipeline = promisify(pipeline)

export default async (inStream, ext) => {
  const tmpFile = tmp(ext)
  await asyncPipeline(inStream, fs.createWriteStream(tmpFile.path))
  return {
    file: tmpFile,
    done: () => {
      tmpFile.destroy().catch(() => null)
    }
  }
}
