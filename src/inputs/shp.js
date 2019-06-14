import fromZip from '../reading/fromZip'

// Outputs GeoJSON Features
const fileFilter = (path) => path.match(/\.shp$/i)
export default () => fromZip({ fileFilter })
