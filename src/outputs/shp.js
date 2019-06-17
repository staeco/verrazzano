import toZip from '../writing/toZip'

// Outputs a SHP file stream
export default (opt) =>
  toZip({ driver: 'ESRI Shapefile' }, opt)
