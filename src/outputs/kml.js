import toFile from '../writing/toFile'

// Outputs a KML file stream
export default () =>
  toFile({ format: 'KML' })
