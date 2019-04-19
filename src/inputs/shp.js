import { finished } from 'stream'
import duplexify from 'duplexify'
import through2 from 'through2'
import from from 'from2'
import merge from 'merge2'
import gdal from 'gdal'
import unzip from '../unzip'

const wgs84 = gdal.SpatialReference.fromEPSG(4326)
const before = '{"type":"FeatureCollection","features":['
const after = ']}'

// SHP File -> GeoJSON Features
const handleFile = (f) => {
  const outStream = duplexify()
  const shp = gdal.open(f)
  const layerCount = shp.layers.count()
  let nextLayer = 0
  let currentLayer, currentTransformation, currentFeature

  const getNextLayer = () => {
    currentLayer = shp.layers.get(nextLayer++)
    currentTransformation = new gdal.CoordinateTransformation(
      currentLayer.srs || wgs84,
      wgs84
    )
  }

  getNextLayer()

  // TODO
  return outStream
}

// Outputs GeoJSON Features
const fileFilter = (path) => path.match(/\.shp$/i)
export default () => {
  const inStream = through2()
  const outStream = merge()
  const out = duplexify.obj(inStream, outStream)

  // start the work
  outStream.write(before)
  unzip(inStream, fileFilter)
    .catch((err) => {
      inStream.emit('error', err) // triggers destroy of everything
    })
    .then(({ files, done }) => {
      finished(out, done)
      files.forEach((f) => {
        try {
          outStream.add(handleFile(f))
        } catch (err) {
          out.destroy(err)
        }
      })
    })
  outStream.end(after)
  return out
}
