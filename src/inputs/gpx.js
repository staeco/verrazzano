import through2 from 'through2'
import pumpify from 'pumpify'
import fileParser from '../parser/file'

const heartRegex = /<gpxtpx:hr>(\d*)<\/gpxtpx:hr>/

// Outputs GeoJSON Features
export default () => {
  const out = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: []
    }
  }
  const accumulate = (feat, _, cb) => {
    if (feat.geometry.type === 'MultiLineString') return cb() // skip the aggregated
    const { time, ele, gpxtpx_TrackPointExtension } = feat.properties

    // pull in elevation in a standard way
    out.geometry.coordinates.push(ele ? [
      ...feat.geometry.coordinates,
      ele
    ] : feat.geometry.coordinates)

    // every gpx should have time, but just in case treat it as if it were optional
    if (time) {
      if (!out.properties.times) out.properties.times = []
      const utcTime = Date.UTC(
        time.year || 0,
        time.month - 1 || 0,
        time.day || 0,
        time.hour || 0,
        time.minute - 1 || 0,
        time.second || 0
      )
      const offset = 60000 * (time.timezone / 100)
      out.properties.times.push(new Date(utcTime + offset).toISOString())
    }

    if (gpxtpx_TrackPointExtension) {
      // support for heart rate extension, if specified
      const match = heartRegex.exec(gpxtpx_TrackPointExtension)
      if (match) {
        if (!out.properties.heartRates) out.properties.heartRates = []
        out.properties.heartRates.push(parseFloat(match[1]))
      }
    }
    cb()
  }

  return pumpify.obj(
    fileParser('gpx'),
    through2.obj(accumulate, function (cb) {
      this.push(out)
      cb()
    })
  )
}
