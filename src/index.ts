import {
  addSandpiles
} from './addSandpiles'
import {
  createSandpile
} from './createSandpile'
import {
  distributeSand
} from './distributeSand'
import {
  findOverloadedField
} from './findOverloadedField'
import {
  printable
} from './printable'

const run = () => { // the program executor
  const size = Number(readline())
  const lines = Array.from(Array(size * 2), () => readline() )

  const inputSandpile1 = createSandpile( lines.slice(0, size) )
  const inputSandpile2 = createSandpile( lines.slice(size) )

  let sandpile = addSandpiles(inputSandpile1, inputSandpile2)

  let overloadedFieldPosition: null | number[]
  while (overloadedFieldPosition = findOverloadedField(sandpile) ) {
    sandpile = distributeSand(overloadedFieldPosition, sandpile)
  }

  print(
    printable(sandpile)
  )
}

///////////////////////////////////////////////////////////////////////////////
/////////////////// START PROGRAM

if(typeof isRunAtCodingame === 'boolean') {
  run() // start the program if the code is run at codingame
}

export default run