import fs from 'graceful-fs'
import mkdirp from 'mkdirp'
import tempfile from 'tempfile'

export default (ext) => {
  const path = tempfile(ext)
  return {
    path,
    mkdir: () => new Promise((resolve, reject) => {
      mkdirp(path, (err) => err ? reject(err) : resolve())
    }),
    write: () => fs.createWriteStream(path),
    read: () => fs.createReadStream(path),
    destroy: () => new Promise((resolve, reject) =>
      fs.unlink(path, (err) => err ? reject(err) : resolve())
    )
  }
}
