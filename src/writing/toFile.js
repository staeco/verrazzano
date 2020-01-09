import ogr from 'ogr2ogr'
import duplexify from 'duplexify'
import through2 from 'through2'
import toGeoJSON from '../outputs/geojson'

export default ({ format, flags=[] }={}) => {
  try {
    const head = toGeoJSON()
    const tail = ogr(head, 'GeoJSON')
      .format(format)
      .project('crs:84')
      .skipfailures()
      .timeout(86400000) // 1 day in ms
      .options(flags)
      .env({ RFC7946: 'YES' })
      .stream()
    return duplexify.obj(head, tail)
  } catch (err) {
    // ogr2ogr blew up before constructing stream
    const errStream = through2.obj()
    process.nextTick(() => errStream.destroy(err))
    return errStream
  }
}
