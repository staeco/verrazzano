import should from 'should'
import collect from 'get-stream'
import streamify from 'into-stream'
import fs from 'graceful-fs'
import pumpify from 'pumpify'
import { join } from 'path'
import { to, from } from '../../src'

const shapeFile = join(__dirname, '../fixtures/gpx-run.geojson')
const data = fs.readFileSync(shapeFile, 'utf8')
const parsedData = JSON.parse(data)

describe.skip('to(gpx)', () => {
  it('should not blow up on create', () => {
    should.exist(to('gpx'))
  })
  it('should translate objects to a shp file', async () => {
    const stream = pumpify.obj(
      streamify.object(parsedData.features),
      to('gpx'),
      from('gpx')
    )
    const res = await collect.array(stream)
    should(res).eql(parsedData.features)
  })
})
