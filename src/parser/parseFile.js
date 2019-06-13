import from from 'from2'
import gdal from 'gdal'
import mapValues from 'lodash.mapvalues'

const wgs84 = gdal.SpatialReference.fromEPSG(4326)

const isGDALDate = (v) =>
  v && typeof v === 'object' && v.year != null && v.month != null && v.day != null

const parseGDALDate = (time) => {
  const utcTime = Date.UTC(
    time.year || 0,
    time.month - 1 || 0,
    time.day || 0,
    time.hour || 0,
    time.minute - 1 || 0,
    time.second || 0
  )
  if (!time.timezone) return new Date(utcTime).toISOString()
  const offset = 60000 * (time.timezone / 100)
  return new Date(utcTime + offset).toISOString()
}

const fixDates = (v) => {
  if (!isGDALDate(v)) return v
  return parseGDALDate(v)
}

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
        geometry.transform(currentTransformation)
      } catch (e) {
        return writeFeature() // go to next feature in layer
      }

      const featureObject = {
        type: 'Feature',
        properties: mapValues(feature.fields.toObject(), fixDates),
        geometry: geometry.toObject()
      }
      ++pushed
      this.push(featureObject)
      if (pushed >= size) return next(null) // no more space available to write, write what we have and wait
      writeFeature() // more space available to write, go to next feature in layer
    }
    writeFeature()
  })
}
