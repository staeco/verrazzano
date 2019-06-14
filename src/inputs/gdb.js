import fromZip from '../reading/fromZip'

// Outputs GeoJSON Features
const fileFilter = (path) => path.match(/\.gdb$/i)
export default () =>
  fromZip({ fileFilter })
