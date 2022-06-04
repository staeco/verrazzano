import from from 'from2'
import gdal from 'gdal-async'
import mapValues from 'lodash.mapvalues'

const wgs84 = gdal.SpatialReference.fromProj4('+init=epsg:4326')

const isGDALDate = (v) =>
  v && typeof v === 'object' && v.year != null && v.month != null && v.day != null


// https://github.com/OSGeo/gdal/blob/e3a2bc5c3c474ca31c13950ac6d2555a2d9389c5/gdal/ogr/ogrsf_frmts/gtm/gtmwaypointlayer.cpp#L158
// These date objects are really strange and non-standard
const parseGDALDate = (time) => {
  const utcTime = Date.UTC(
    time.year || 0,
    time.month - 1 || 0,
    time.day || 0,
    time.hour || 0,
    time.minute || 0,
    time.second || 0
  )
  if (!time.timezone || time.timezone === 1) return new Date(utcTime).toISOString()
  const offset = (time.timezone - 100) * 15
  return new Date(utcTime - offset).toISOString()
}

const fixDates = (v) =>
  isGDALDate(v) ? parseGDALDate(v) : v

// GDAL File -> GeoJSON Features
// Inspired by shp2json
export default (path) => {
  const file = gdal.open(path)
  const layerCount = file.layers.count()
  let nextLayer = 0
  let currentLayer, currentTransformation

  const getNextLayer = () => {
    currentLayer = file.layers.get(nextLayer++)
    currentTransformation = new gdal.CoordinateTransformation(
      currentLayer.srs || wgs84,
      wgs84
    )
  }

  getNextLayer()

  return from.obj(function (size, next) {
    let pushed = 0
    const writeFeature = () => {
      const isLastLayer = nextLayer === layerCount

      // grab the feature we're working with
      let feature = currentLayer.features.next()
      if (!feature) {
        if (isLastLayer) {
          // we hit the end of the final layer, finish
          this.push(null)
          return
        }
        // we hit the end of the layer, go to the next layer and continue
        getNextLayer()
        feature = currentLayer.features.next()
      }

      // get the geometry and project the coordinates
      let geometry
      try {
        geometry = feature.getGeometry()
        if (geometry) geometry.transform(currentTransformation)
      } catch (e) {
        return process.nextTick(writeFeature) // go to next feature in layer
      }

      const featureObject = {
        type: 'Feature',
        properties: mapValues(feature.fields.toObject(), fixDates),
        geometry: geometry ? geometry.toObject() : undefined
      }
      ++pushed
      this.push(featureObject)
      if (pushed >= size) return next(null) // no more space available to write, write what we have and wait
      process.nextTick(writeFeature) // more space available to write, go to next feature in layer
    }
    writeFeature()
  })
}
