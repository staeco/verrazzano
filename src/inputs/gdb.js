import zippedParser from '../parser/zip'

// Outputs GeoJSON Features
const fileFilter = (path) => path.match(/\.gdb$/i)
export default () =>
  zippedParser({ fileFilter })
