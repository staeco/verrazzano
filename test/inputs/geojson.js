import should from 'should'
import collect from 'get-stream'
import fs from 'graceful-fs'
import { join } from 'path'
import { from } from '../../src'

const shapeFile = join(__dirname, '../fixtures/shp-stations.geojson')
const data = fs.readFileSync(shapeFile, 'utf8')

describe('from(geojson)', () => {
  it('should not blow up on create', () => {
    should.exist(from('geojson'))
  })
  it('should translate a geojson file to objects', async () => {
    const inp = fs.createReadStream(shapeFile)
    const stream = inp.pipe(from('geojson'))
    const res = await collect.array(stream)
    should(res).eql(JSON.parse(data).features)
  })
})
