/*eslint no-console: 0*/
import should from 'should'
import * as index from '../src'

describe('from()', () => {
  it('should exist', (done) => {
    should.exist(index.from)
    done()
  })
})

describe('to()', () => {
  it('should exist', (done) => {
    should.exist(index.to)
    done()
  })
})
