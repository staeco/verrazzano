import should from 'should'
import collect from 'get-stream'
import fs from 'graceful-fs'
import { join } from 'path'
import { from } from '../../src'

const shapeFile = join(__dirname, '../fixtures/gpx-run.gpx')
const expectedGeoFile = fs.readFileSync(join(__dirname, '../fixtures/gpx-run.geojson'), 'utf8')

describe.skip('from(gpx)', () => {
  it('should not blow up on create', () => {
    should.exist(from('gpx'))
  })
  it('should translate a gpx file to geojson', async () => {
    const inp = fs.createReadStream(shapeFile)
    const stream = inp.pipe(from('gpx'))
    const res = await collect.array(stream)
    should(res).eql(JSON.parse(expectedGeoFile).features)
  })
})
