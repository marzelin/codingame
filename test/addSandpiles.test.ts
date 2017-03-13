import {
  addSandpiles
} from '../src/addSandpiles'

describe('addSandpiles', function () {
  it('should add two sandpiles', function () {
    const sandpile1 = [
      [1, 2],
      [0, 3]
    ]
    const sandpile2 = [
      [2, 0],
      [1, 2]
    ]
    const expected = [
      [3, 2],
      [1, 5]
    ]
    addSandpiles(sandpile1, sandpile2).should.deep.equal(expected)
  })
})