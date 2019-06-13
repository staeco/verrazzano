import should from 'should'
import collect from 'get-stream'
import intoStream from 'into-stream'
import fs from 'graceful-fs'
import { join } from 'path'
import { to } from '../../src'

const shapeFile = join(__dirname, '../fixtures/shp-stations.geojson')
const data = fs.readFileSync(shapeFile, 'utf8')

describe('to(geojson)', () => {
  it('should not blow up on create', () => {
    should.exist(to('geojson'))
  })
  it('should translate objects to a geojson file', async () => {
    const inp = intoStream.object(JSON.parse(data).features)
    const stream = inp.pipe(to('geojson'))
    const res = await collect(stream)
    should(JSON.parse(res)).eql(JSON.parse(data))
  })
})
