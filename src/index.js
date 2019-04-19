import gdbInput from './inputs/gdb'
import gpxInput from './inputs/gpx'
import kmlInput from './inputs/kml'
import shpInput from './inputs/shp'
import gpxOutput from './outputs/gpx'
import kmlOutput from './outputs/kml'
import shpOutput from './outputs/shp'

const inputs = {
  gdb: gdbInput,
  gpx: gpxInput,
  kml: kmlInput,
  shp: shpInput
}

const outputs = {
  gpx: gpxOutput,
  kml: kmlOutput,
  shp: shpOutput
}


export const from = (type, opt) => {
  if (!inputs[type]) throw new Error('Invalid from() type!')
  return inputs[type](opt)
}

export const to = (type, opt) => {
  if (!outputs[type]) throw new Error('Invalid to() type!')
  return outputs[type](opt)
}
