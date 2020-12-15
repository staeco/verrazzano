import should from 'should'
import collect from 'get-stream'
import fs from 'graceful-fs'
import { join } from 'path'
import { from } from '../../src'

const shapeFile = join(__dirname, '../fixtures/shp-stations.zip')
const expectedGeoFile = fs.readFileSync(join(__dirname, '../fixtures/shp-stations.geojson'), 'utf8')

const shapeFile2 = join(__dirname, '../fixtures/shp-hsa-boundaries.zip')
const expectedGeoFile2 = fs.readFileSync(join(__dirname, '../fixtures/shp-hsa-boundaries.geojson'), 'utf8')

const shapeFile3 = join(__dirname, '../fixtures/raid-shapefile.shp.zip')
const shapeFile4 = join(__dirname, '../fixtures/raid-shapefile-2.shp.zip')

describe('from(shp)', () => {
  it('should not blow up on create', () => {
    should.exist(from('shp'))
  })
  it('should translate a shapefile to geojson', async () => {
    const inp = fs.createReadStream(shapeFile)
    const stream = inp.pipe(from('shp'))
    const res = await collect.array(stream)
    should(res).eql(JSON.parse(expectedGeoFile).features)
  })
  it('should translate a shapefile to geojson 2', async () => {
    const inp = fs.createReadStream(shapeFile2)
    const stream = inp.pipe(from('shp'))
    const res = await collect.array(stream)
    should(res).eql(JSON.parse(expectedGeoFile2).features)
  })
  it('should translate a shapefile to geojson 3', async () => {
    const inp = fs.createReadStream(shapeFile3)
    const stream = inp.pipe(from('shp'))
    const res = await collect.array(stream)
    should(res.length).eql(58745)
  })
  it('should translate a shapefile to geojson 4', async () => {
    const inp = fs.createReadStream(shapeFile4)
    const stream = inp.pipe(from('shp'))
    const res = await collect.array(stream)
    should(res.length).eql(57718)
  })
})
