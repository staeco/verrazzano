import { pipeline } from 'readable-stream'
import findit from 'findit2'
import { spawn } from 'child_process'
import { promisify } from 'util'
import tmp from './tmp'

const asyncPipeline = promisify(pipeline)

// returns a stream that extracts specific files to a temp folder
export default async (inStream, { fileFilter, cleanup=true }) => {
  const tmpZip = tmp('.zip')
  const tmpFolder = tmp()

  await asyncPipeline(inStream, tmpZip.write())
  await tmpFolder.mkdir()
  await new Promise((resolve, reject) => {
    const ps = spawn('unzip', [ '-d', tmpFolder.path, tmpZip.path ])
    ps.once('exit', (code) => {
      if (code >= 3) return reject(new Error(`Unzip error: Exit code ${code}`))
      resolve()
    })
  })
  if (cleanup) await tmpZip.destroy()
  const files = await new Promise((resolve, reject) => {
    const matches = []
    const finder = findit(tmpFolder.path)
    const match = (f) => {
      if (f.match(/__MACOSX/)) return // mac meta files
      if (fileFilter(f)) matches.push(f)
    }
    finder.on('directory', match)
    finder.on('file', match)
    finder.once('error', reject)
    finder.once('end', () => {
      resolve(matches)
    })
  })
  return {
    folder: tmpFolder.path,
    files,
    done: () => {
      tmpFolder.destroy().catch(() => null)
    }
  }
}
