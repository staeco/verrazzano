import should from 'should'
import collect from 'get-stream'
import fs from 'graceful-fs'
import { join } from 'path'
import { from } from '../../src'

const shapeFile = join(__dirname, '../fixtures/gdb-sacramento-crime.zip')

describe('from(gdb)', () => {
  it('should not blow up on create', () => {
    should.exist(from('gdb'))
  })
  it('should translate a shapefile to geojson', async () => {
    const inp = fs.createReadStream(shapeFile)
    const stream = inp.pipe(from('gdb'))
    const res = await collect.array(stream)
    should(res.length).equal(327284)
    should(res[0]).eql({
      type: 'Feature',
      properties: {
        ActivityNumber: '',
        District: '',
        Neighborhood: 'Old Fair Oaks',
        OccurenceStartDate: '2009-03-26T17:09:00.000Z',
        OccurenceEndDate: '2009-03-26T17:18:59.000Z',
        ReportDate: '2009-03-26T17:38:00.000Z',
        OccurenceLocation: '9300 Block of Fair O',
        OccurenceCity: 'Fair Oaks',
        OccurenceZipCode: '95628',
        PrimaryViolation: 'PC 594(B)(1) Vandalism ($400 Or More)'
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -121.28634428721017,
          38.63645239990683
        ]
      }
    })
  })
})
