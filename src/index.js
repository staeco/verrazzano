import gdbInput from './inputs/gdb'
import kmlInput from './inputs/kml'
import kmzInput from './inputs/kmz'
import shpInput from './inputs/shp'
import geojsonInput from './inputs/geojson'
import kmlOutput from './outputs/kml'
import kmzOutput from './outputs/kmz'
import shpOutput from './outputs/shp'
import geojsonOutput from './outputs/geojson'

const inputs = {
  gdb: gdbInput,
  kml: kmlInput,
  kmz: kmzInput,
  shp: shpInput,
  geojson: geojsonInput
}

const outputs = {
  kml: kmlOutput,
  kmz: kmzOutput,
  shp: shpOutput,
  geojson: geojsonOutput
}


export const from = (type, opt) => {
  if (!inputs[type]) throw new Error('Invalid from() type!')
  return inputs[type](opt)
}

export const to = (type, opt) => {
  if (!outputs[type]) throw new Error('Invalid to() type!')
  return outputs[type](opt)
}
