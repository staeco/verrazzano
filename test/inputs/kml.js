import should from 'should'
import collect from 'get-stream'
import fs from 'graceful-fs'
import { join } from 'path'
import { from } from '../../src'

const shapeFile = join(__dirname, '../fixtures/kml-farmers-markets.kml')
const expectedGeoFile = fs.readFileSync(join(__dirname, '../fixtures/kml-farmers-markets.geojson'), 'utf8')

describe('from(kml)', () => {
  it('should not blow up on create', () => {
    should.exist(from('kml'))
  })
  it('should translate a kml file to geojson', async () => {
    const inp = fs.createReadStream(shapeFile)
    const stream = inp.pipe(from('kml'))
    const res = await collect.array(stream)
    should(res).eql(JSON.parse(expectedGeoFile).features)
  })
})
