import fromFile from '../ogr2ogr/fromFile'

// Outputs GeoJSON Features
export default () =>
  fromFile({
    layers: false,
    extension: '.shp.zip',
    parserOptions: {
      format: 'ESRI Shapefile'
    }
  })
