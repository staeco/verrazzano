import { pipeline } from 'stream'
import fs from 'graceful-fs'
import kml from 'kml-stream'
import zippedParser from '../parser/zip'

// Outputs GeoJSON Features
const fileFilter = (path) => path.match(/\.kml$/i)
const parser = (path) =>
  pipeline(
    fs.createReadStream(path),
    kml()
  )

export default () => zippedParser(fileFilter, parser)
