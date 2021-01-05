import { pipeline } from 'stream'
import fs from 'graceful-fs'
import KML from 'kml-stream'
import fromZip from '../reading/fromZip'

// Outputs GeoJSON Features
const fileFilter = (path) => path.match(/\.kml$/i)
const parser = (path) =>
  pipeline(
    fs.createReadStream(path),
    new KML(),
    () => {} // noop
  )

export default () => fromZip({ fileFilter, parser })
