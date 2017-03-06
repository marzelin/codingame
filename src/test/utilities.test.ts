import {
  isOddNumber
} from '../utilities'

describe('isOddNumber', function () {
  it('should return false if input number is even', function () {
    isOddNumber(4).should.be.false
  })
  it('should return true if input number is odd', function () {
    isOddNumber(3).should.be.true
  })
})