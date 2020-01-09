import toFile from '../writing/toFile'

// Outputs a KMZ file stream
export default () =>
  toFile({ format: 'KMZ' })
