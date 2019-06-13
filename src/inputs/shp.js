import zippedParser from '../parser/zip'

// Outputs GeoJSON Features
const fileFilter = (path) => path.match(/\.shp$/i)
export default () => zippedParser(fileFilter)
