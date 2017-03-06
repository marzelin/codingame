import {
  graphicalRepresentation
} from './graphicalRepresentation'
import {
  moveOtherDisk,
  moveSmallestDisk
} from './moves'
import {
  gameIsNotFinished,
  initialStacksState
} from './other'
import {
  isOddNumber
} from './utilities'

const run = () => { // the program executor
  const numberOfDisks = Number(readline())
  const turnForWhichToDisplayState = Number(readline())
  const { stacksAtGivenTurn, turnsToCompleteGame } = hanoiTower(numberOfDisks, turnForWhichToDisplayState)
  graphicalRepresentation(stacksAtGivenTurn)
    .forEach( (line) => print(line))
  print(turnsToCompleteGame)
}

const hanoiTower = (numberOfDisks: number, turnForWhichToDisplayState: number) => {
  let stacks: number[][] = initialStacksState(numberOfDisks)
  let currentTurn: number = 0
  let stacksAtGivenTurn: number[][] = stacks

  while(gameIsNotFinished(stacks)) {
    currentTurn = currentTurn + 1
    stacks = isOddNumber(currentTurn)
      ? moveSmallestDisk(stacks)
      : moveOtherDisk(stacks)
    if (turnForWhichToDisplayState === currentTurn) {
      stacksAtGivenTurn = stacks
    }
  }

  return {
    stacksAtGivenTurn,
    turnsToCompleteGame: currentTurn
  }
}

///////////////////////////////////////////////////////////////////////////////
/////////////////// START PROGRAM

if(typeof isRunAtCodingame === 'boolean') {
  run() // start the program if the code is run at codingame
}

export default run
export {
  hanoiTower
}