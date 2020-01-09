import should from 'should'
import collect from 'get-stream'
import fs from 'graceful-fs'
import { join } from 'path'
import { from } from '../../src'

const shapeFile = join(__dirname, '../fixtures/gdb-sacramento-crime.gdb.zip')
const adverseShapeFile = join(__dirname, '../fixtures/gdb-adverse.gdb.zip')
const emptyShapeFile = join(__dirname, '../fixtures/gdb-empty.gdb.zip')

describe('from(gdb)', () => {
  it('should not blow up on create', () => {
    should.exist(from('gdb'))
  })
  it('should translate a gdb file to geojson', async () => {
    const inp = fs.createReadStream(shapeFile)
    const stream = inp.pipe(from('gdb'))
    const res = await collect.array(stream)
    should.exist(res)
    res.length.should.eql(327668)
    should(res[0]).eql({
      type: 'Feature',
      properties: {
        ActivityNumber: '',
        District: '',
        Neighborhood: 'Old Fair Oaks',
        OccurenceStartDate: '2009/03/26 17:10:00',
        OccurenceEndDate: '2009/03/26 17:19:59',
        ReportDate: '2009/03/26 17:39:00',
        OccurenceLocation: '9300 Block of Fair O',
        OccurenceCity: 'Fair Oaks',
        OccurenceZipCode: '95628',
        PrimaryViolation: 'PC 594(B)(1) Vandalism ($400 Or More)'
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -121.28634428721014,
          38.63645239898644
        ]
      }
    })
  })
  it('should properly parse a file with bad geometries', async () => {
    const inp = fs.createReadStream(adverseShapeFile)
    const stream = inp.pipe(from('gdb'))
    const res = await collect.array(stream)
    should(res.length).equal(197)
    should(res[0]).eql({
      type: 'Feature',
      properties: {
        STATEFP: '06',
        COUNTYFP: '075',
        TRACTCE: '017102',
        GEOID: '06075017102',
        NAME: '171.02',
        NAMELSAD: 'Census Tract 171.02',
        MTFCC: 'G5020',
        FUNCSTAT: 'S',
        ALAND: 294894,
        AWATER: 0,
        INTPTLAT: '+37.7654353',
        INTPTLON: '-122.4504754',
        GEOID_Data: '14000US06075017102',
        Shape_Length: 0.023991573996729014,
        Shape_Area: 0.000030153788334013392
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [ -122.45320600015673, 37.76824899907766 ],
              [ -122.45167599974756, 37.768445999169195 ],
              [ -122.45052199959059, 37.768592998753526 ],
              [ -122.44945399980219, 37.768728998729934 ],
              [ -122.44839000019834, 37.76886499870634 ],
              [ -122.44801299990002, 37.76700699935917 ],
              [ -122.44782400017743, 37.7660719994089 ],
              [ -122.44763499955553, 37.76513899865154 ],
              [ -122.4484409998522, 37.765035999297595 ],
              [ -122.44827400024491, 37.764195999231625 ],
              [ -122.44810899983042, 37.763366998773634 ],
              [ -122.44943299973312, 37.76319999916634 ],
              [ -122.44929599971054, 37.76251899923808 ],
              [ -122.4491199996882, 37.761647998641905 ],
              [ -122.45057999956731, 37.761560999126495 ],
              [ -122.45195800016154, 37.761477998896204 ],
              [ -122.45209700027628, 37.76216699919334 ],
              [ -122.4522330002527, 37.76284299889099 ],
              [ -122.45239999986006, 37.763668999210616 ],
              [ -122.45256899955967, 37.76450899927654 ],
              [ -122.45275800018152, 37.76544299918072 ],
              [ -122.45294699990409, 37.76637399894655 ],
              [ -122.45299600036508, 37.76647599915372 ],
              [ -122.45305000015736, 37.76674199882983 ],
              [ -122.45316500006463, 37.76730699880458 ],
              [ -122.45335199969499, 37.76824599893931 ],
              [ -122.45320600015673, 37.76824899907766 ]
            ]
          ]
        ]
      }
    })
  })
  it.skip('should handle an empty file correctly', async () => {
    const inp = fs.createReadStream(emptyShapeFile)
    try {
      const stream = inp.pipe(from('gdb'))
      await collect.array(stream)
    } catch (err) {
      err.message.should.equal('Invalid file!')
      return
    }
    throw new Error('Did not throw!')
  })
})
