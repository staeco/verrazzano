import zippedParser from '../parser/zipped'

// Outputs GeoJSON Features
const fileFilter = (path) => path.match(/\.kml$/i)
export default () => zippedParser(fileFilter)
