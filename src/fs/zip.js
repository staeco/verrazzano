import { spawn } from 'child_process'
import tmp from './tmp'

// returns a stream that zips a folder
export default async (tmpFolder, { cleanup=true }) => {
  const tmpZip = tmp('.zip')
  await new Promise((resolve, reject) => {
    const ps = spawn('zip', [ '-r9', tmpZip.path, tmpFolder.path ])
    ps.once('exit', (code) => {
      if (code >= 3) return reject(new Error(`Zip error: Exit code ${code}`))
      resolve()
    })
  })
  if (cleanup) await tmpFolder.destroy()
  return {
    file: tmpZip,
    done: () => {
      tmpZip.destroy().catch(() => null)
    }
  }
}
