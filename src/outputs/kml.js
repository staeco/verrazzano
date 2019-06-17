import toFile from '../writing/toFile'

// Outputs a KML file stream
export default (opt) =>
  toFile({ driver: 'KML' }, opt)
