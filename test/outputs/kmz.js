import should from 'should'
import collect from 'get-stream'
import streamify from 'into-stream'
import pumpify from 'pumpify'
import fs from 'graceful-fs'
import { join } from 'path'
import { to, from } from '../../src'

const shapeFile = join(__dirname, '../fixtures/kml-farmers-markets.geojson')
const data = fs.readFileSync(shapeFile, 'utf8')
const parsedData = JSON.parse(data)

describe.skip('to(kmz)', () => {
  it('should not blow up on create', () => {
    should.exist(to('kmz'))
  })
  it('should translate objects to a kmz file', async () => {
    const stream = pumpify.obj(
      streamify.object(parsedData.features),
      to('kmz'),
      from('kmz')
    )
    const res = await collect.array(stream)
    should(res).eql(parsedData.features)
  })
})
