import {
  maybeBomb
} from './lib/bombing'
import {
  getDistances
} from './lib/distances'
import {
  findMyCapitalId,
  processInitialInput
} from './lib/initialInputProcessing'
import {
  Istate
} from './lib/interfaces'
import {
  planOrders
} from './lib/troopManagement'
import {
  processTurnInput
} from './lib/turnInputProcessing'

const run = () => { // the program executor
  const initialInput = processInitialInput()
  /** distances between factories */
  const distances = initialInput.reduce(getDistances, {})
  /** bombs available to use */
  let availableBombs = 2
  let myCapitalId: number | null = null
  let isEarlyGame = true
  
  while (true) { // game loop
    const factories = processTurnInput()

    if (myCapitalId == null) {
      myCapitalId = findMyCapitalId(factories)
    }

    const state: Istate = [{ 
      myCapitalId,
      distances,
      availableBombs,
      factories,
      orders: [],
      isEarlyGame
    }]
      .map(maybeBomb)
      .map(planOrders)
      [0]

    const printableOrders = state.orders.join('; ') || 'WAIT'
    print(printableOrders)

    availableBombs = state.availableBombs
  }
}

///////////////////////////////////////////////////////////////////////////////
/////////////////// START PROGRAM

if(typeof isRunAtCodingame === 'boolean') {
  run() // start the program if the code is run at codingame
}

export default run