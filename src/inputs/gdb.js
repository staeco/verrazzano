import fromFile from '../ogr2ogr/fromFile'

// Outputs GeoJSON Features
export default () =>
  fromFile({
    extension: '.gdb.zip',
    parserOptions: {
      format: 'ESRI Shapefile'
    }
  })
