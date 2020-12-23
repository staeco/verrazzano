import gdal from 'gdal-next'
import toFile from '../writing/toFile'

// Outputs a GPX file stream
export default (opt = {}) =>
  toFile({ driver: 'GPX' }, { geometryType: gdal.wkbLineString, ...opt })
