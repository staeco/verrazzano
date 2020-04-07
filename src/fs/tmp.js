import fs from 'graceful-fs'
import mkdirp from 'mkdirp'
import tempfile from 'tempfile'

export default (ext) => {
  const path = tempfile(ext)
  return {
    path,
    mkdir: () => mkdirp(path),
    write: () => fs.createWriteStream(path),
    read: () => fs.createReadStream(path),
    destroy: () => new Promise((resolve, reject) =>
      fs.unlink(path, (err) => err ? reject(err) : resolve())
    )
  }
}
