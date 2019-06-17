import should from 'should'
import collect from 'get-stream'
import streamify from 'into-stream'
import pumpify from 'pumpify'
import fs from 'graceful-fs'
import { join } from 'path'
import { to, from } from '../../src'

const shapeFile = join(__dirname, '../fixtures/shp-stations.geojson')
const data = fs.readFileSync(shapeFile, 'utf8')
const parsedData = JSON.parse(data)

describe.skip('to(shp)', () => {
  it('should not blow up on create', () => {
    should.exist(to('shp'))
  })
  it('should translate objects to a shp file', async () => {
    const stream = pumpify.obj(
      streamify.object(parsedData.features),
      to('shp'),
      from('shp')
    )
    const res = await collect.array(stream)
    should(res).eql(parsedData.features)
  })
})
