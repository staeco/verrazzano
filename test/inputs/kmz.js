import should from 'should'
import collect from 'get-stream'
import fs from 'graceful-fs'
import { join } from 'path'
import { from } from '../../src'

const shapeFile = join(__dirname, '../fixtures/kmz-farmers-markets.zip')
const expectedGeoFile = fs.readFileSync(join(__dirname, '../fixtures/kml-farmers-markets.geojson'), 'utf8')

describe('from(kmz)', () => {
  it('should not blow up on create', () => {
    should.exist(from('kmz'))
  })
  it('should translate a kmz file to geojson', async () => {
    const inp = fs.createReadStream(shapeFile)
    const stream = inp.pipe(from('kmz'))
    const res = await collect.array(stream)
    should(res).eql(JSON.parse(expectedGeoFile).features)
  })
})
