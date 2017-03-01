import sync = require('./sync')

describe('addDistance', function () {
  const addDistance = sync.addDistance
  it('should be a function', function () {
    addDistance.should.be.a('function')
  })
  it('should add distance to the array', function () {
    addDistance(5, 6, 1)({}).should.deep.equal({
      '5:6': 1,
    })
  })
})