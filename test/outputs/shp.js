import should from 'should'
import collect from 'get-stream'
import intoStream from 'into-stream'
import fs from 'graceful-fs'
import { join } from 'path'
import { to, from } from '../../src'

const shapeFile = join(__dirname, '../fixtures/shp-stations.geojson')
const data = fs.readFileSync(shapeFile, 'utf8')
const parsedData = JSON.parse(data)

describe.only('to(shp)', () => {
  it('should not blow up on create', () => {
    should.exist(to('shp'))
  })
  it('should translate objects to a shp file', async () => {
    const inp = intoStream.object(parsedData.features)
    const stream = inp.pipe(to('shp')).pipe(from('shp'))
    const res = await collect.array(stream)
    should(res).eql(parsedData.features)
  })
})
