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

describe.skip('to(kml)', () => {
  it('should not blow up on create', () => {
    should.exist(to('kml'))
  })
  it.skip('should translate objects to a kml file', async () => {
    const stream = pumpify.obj(
      streamify.object(parsedData.features),
      to('kml'),
      from('kml')
    )
    const res = await collect.array(stream)
    should(res).eql(parsedData.features)
  })
  it('should translate objects to proper kml text', async () => {
    const stream = pumpify.obj(
      streamify.object(parsedData.features),
      to('kml')
    )
    const res = await collect(stream)
    console.log('TODO', res)
  })
})
