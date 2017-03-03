import {
  addDistance
} from './distances'

describe('addDistance', function () {
  it('should be a function', function () {
    addDistance.should.be.a('function')
  })
  it('should add distance to the array', function () {
    addDistance(5, 6, 1)({}).should.deep.equal({
      '5:6': 1,
    })
  })
})

