import toZip from '../writing/toZip'

// Outputs a KMZ file stream
export default (opt) =>
  toZip({ driver: 'KML' }, opt)
