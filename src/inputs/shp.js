import zippedParser from '../parser/zipped'

// Outputs GeoJSON Features
const fileFilter = (path) => path.match(/\.shp$/i)
export default () => zippedParser(fileFilter)
