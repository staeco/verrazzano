import fromFile from '../reading/fromFile'

// Outputs GeoJSON Features
export default () =>
  fromFile({
    extension: '.gdb.zip',
    parserOptions: {
      format: 'ESRI Shapefile'
    }
  })
