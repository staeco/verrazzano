import should from 'should'
import collect from 'get-stream'
import fs from 'graceful-fs'
import { join } from 'path'
import { from } from '../../src'

const shapeFile = join(__dirname, '../fixtures/gdb-sacramento-crime.zip')
const adverseShapeFile = join(__dirname, '../fixtures/gdb-adverse.zip')
const emptyShapeFile = join(__dirname, '../fixtures/gdb-empty.zip')

describe('from(gdb)', () => {
  it('should not blow up on create', () => {
    should.exist(from('gdb'))
  })
  it('should translate a gdb file to geojson', async () => {
    const inp = fs.createReadStream(shapeFile)
    const stream = inp.pipe(from('gdb'))
    const res = await collect.array(stream)
    should(res.length).equal(327668)
    should(res[0]).eql({
      type: 'Feature',
      properties: {
        ActivityNumber: '',
        District: '',
        Neighborhood: 'Old Fair Oaks',
        OccurenceStartDate: '2009-03-26T17:10:00.000Z',
        OccurenceEndDate: '2009-03-26T17:19:59.000Z',
        ReportDate: '2009-03-26T17:39:00.000Z',
        OccurenceLocation: '9300 Block of Fair O',
        OccurenceCity: 'Fair Oaks',
        OccurenceZipCode: '95628',
        PrimaryViolation: 'PC 594(B)(1) Vandalism ($400 Or More)'
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -121.28634428721016,
          38.636452399906894
        ]
      }
    })
  })
  it('should properly parse a file with bad geometries', async () => {
    const inp = fs.createReadStream(adverseShapeFile)
    const stream = inp.pipe(from('gdb'))
    const res = await collect.array(stream)
    should(res.length).equal(41957)
    should(res[0]).deepEqual({
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
              [ -122.45320600015674,37.768248999991386 ],
              [ -122.45167599974758,37.76844600008292 ],
              [ -122.45052199959059,37.76859299966725 ],
              [ -122.44945399980219,37.768728999643656 ],
              [ -122.44839000019834,37.768864999620064 ],
              [ -122.44801299990002,37.76700700027288 ],
              [ -122.44782400017743,37.766072000322595 ],
              [ -122.44763499955553,37.76513899956524 ],
              [ -122.44844099985221,37.765036000211296 ],
              [ -122.44827400024491,37.76419600014532 ],
              [ -122.44810899983042,37.76336699968732 ],
              [ -122.44943299973312,37.76320000008002 ],
              [ -122.44929599971056,37.76251900015177 ],
              [ -122.44911999968821,37.76164799955558 ],
              [ -122.45057999956731,37.76156100004016 ],
              [ -122.45195800016154,37.76147799980987 ],
              [ -122.4520970002763,37.76216700010701 ],
              [ -122.4522330002527,37.76284299980466 ],
              [ -122.45239999986006,37.76366900012431 ],
              [ -122.45256899955967,37.76450900019023 ],
              [ -122.45275800018152,37.76544300009442 ],
              [ -122.4529469999041,37.766373999860264 ],
              [ -122.45299600036509,37.76647600006743 ],
              [ -122.45305000015736,37.766741999743545 ],
              [ -122.45316500006464,37.7673069997183 ],
              [ -122.45335199969497,37.768245999853036 ],
              [ -122.45320600015674,37.768248999991386 ]
            ]
          ]
        ]
      }
    })
  })
  it('should handle an empty file correctly', (done) => {
    const inp = fs.createReadStream(emptyShapeFile)
    const stream = inp.pipe(from('gdb'))
    collect.array(stream).catch((err) => {
      err.message.should.equal('Invalid file, nothing found!')
      done()
    })
  })
})
