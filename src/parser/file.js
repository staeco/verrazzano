import from from 'from2'
import gdal from 'gdal'

const wgs84 = gdal.SpatialReference.fromEPSG(4326)

// GDAL File -> GeoJSON Features
// Inspired by shp2json
export default (f) => {
  const file = gdal.open(f)
  const layerCount = file.layers.count()
  let nextLayer = 0
  let isFirstFeature = true
  let currentLayer, currentTransformation

  const getNextLayer = () => {
    currentLayer = file.layers.get(nextLayer++)
    currentTransformation = new gdal.CoordinateTransformation(
      currentLayer.srs || wgs84,
      wgs84
    )
  }

  getNextLayer()

  return from(function (size, next) {
    let out = ''
    const writeFeature = () => {
      const isLastLayer = nextLayer === layerCount

      // grab the feature we're working with
      let feature = currentLayer.features.next()
      if (!feature) {
        if (isLastLayer) {
          // we hit the end of the final layer, push remaining output and finish
          this.push(out)
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
        properties: feature.fields.toObject(),
        geometry: geometry.toObject()
      }
      if (!isFirstFeature) out += ','
      out += JSON.stringify(featureObject)
      isFirstFeature = false

      if (out.length >= size) return next(null, out) // no more space available to write, write what we have and wait
      writeFeature() // more space available to write, go to next feature in layer
    }
    writeFeature()
  })
}
