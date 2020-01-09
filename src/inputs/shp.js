import fromFile from '../reading/fromFile'

// Outputs GeoJSON Features
export default () =>
  fromFile({
    extension: '.shp.zip',
    parserOptions: {
      format: 'ESRI Shapefile',
      layers: false
    }
  })
