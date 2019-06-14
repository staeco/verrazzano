import { pipeline } from 'stream'
import fs from 'graceful-fs'
import kml from 'kml-stream'
import fromZip from '../reading/fromZip'

// Outputs GeoJSON Features
const fileFilter = (path) => path.match(/\.kml$/i)
const parser = (path) =>
  pipeline(
    fs.createReadStream(path),
    kml()
  )

export default () => fromZip({ fileFilter, parser })
