import ogr from 'ogr2ogr'
import JSONStream from 'JSONStream'
import pumpify from 'pumpify'
import through2 from 'through2'
import merge from 'merge2'
import getLayers from './getLayers'

const createHead = (path, layer, { format, flags=[] }={}) => {
  const options = [
    ...flags,
    '-mapFieldType', 'Date=String,Time=String'
  ]
  if (layer) options.push(layer)
  const context = { path, layer }
  try {
    const head = ogr(path, format)
      .format('GeoJSON')
      .project('crs:84')
      .skipfailures()
      .timeout(86400000) // 1 day in ms
      .options(options)
      //.env({ RFC7946: 'YES' })
      .stream()
    const tail = JSONStream.parse('features.*')
    const outStream = pumpify.obj(head, tail)
    outStream.context = context
    return outStream
  } catch (err) {
    // ogr2ogr blew up before constructing stream
    const errStream = through2.obj()
    errStream.context = context
    process.nextTick(() => errStream.destroy(err))
    return errStream
  }
}

export default (path, opt) => {
  if (!opt.layers) return createHead(path, null, opt)
  const out = pumpify.obj()
  out.context = { path }
  const tail = through2.obj()
  getLayers(path)
    .then((layers) => {
      if (layers.length === 0) {
        out.destroy(new Error('Invalid file!'))
        return
      }
      const head = layers.length === 1
        ? createHead(path, null, opt)
        : merge(layers.map((layer) =>
          createHead(path, layer, opt)
        ))
      out.setPipeline(head, tail)
    })
    .catch(() => {
      out.destroy(new Error('Invalid file!'))
    })

  return out
}
