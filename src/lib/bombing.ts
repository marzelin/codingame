import {
  enemyOnly,
  mineOnly,
  noBombTarget,
  noCaptureInProgress,
  noFrozen,
  productionGte2only
} from './filterPredicates'
import {
  IeventAtDay
} from './interfaces'
import {
  Istate
} from './interfaces'
import {
  byDistance,
  byProduction
} from './sorters'
import {
  updateFactoryWithEvent,
  updateStateWithFactory,
  updateStateWithOrder
} from './updaters'
import {
  createDistanceKeyBetween,
  factoriesToList
} from './utilities'

const maybeBomb = (state: Istate) => {
  if (!state.availableBombs) { // if there's no more bomb to launch, do nothing
    return state
  }

  let newState = state 

  let factories = state.factories
  let targetFactory = Object.keys(factories)
    .map( (id) => factories[Number(id)])
    .filter(enemyOnly)
    .filter(productionGte2only)
    .filter(noCaptureInProgress)
    .filter(noBombTarget)
    .filter(noFrozen)
    .sort(byProduction)[0]

  if (targetFactory) {
    /** the factory from which the bomb will be launched */
    let bombLaunchFactory = factoriesToList(state.factories)
    .filter(mineOnly)
    .sort(byDistance(state.distances, targetFactory.id))[0]

    if (bombLaunchFactory) {
      const newAvailableBombs = state.availableBombs - 1
      newState = ({...newState, availableBombs: newAvailableBombs})

      const newOrder = `BOMB ${bombLaunchFactory.id} ${targetFactory.id}`
      newState = updateStateWithOrder(newOrder, newState)

      const dayWhenBombExplodes = state.distances[createDistanceKeyBetween(bombLaunchFactory.id, targetFactory.id)] + 1 // the time to travel + one day for bomb launch
      const eventAtDayOfBombing = targetFactory.eventsAtDay[dayWhenBombExplodes]

      let newEventAtThatDay: IeventAtDay
      if (eventAtDayOfBombing) {
        newEventAtThatDay = ({...eventAtDayOfBombing, isBombExploding: true})
        newEventAtThatDay = ({...eventAtDayOfBombing, factoryIdWhereBombWasLaunchedFrom: bombLaunchFactory.id})
      } else {
        newEventAtThatDay = {
          day: dayWhenBombExplodes,
          isBombExploding: true,
          factoryIdWhereBombWasLaunchedFrom: bombLaunchFactory.id
        }
      }
      targetFactory = updateFactoryWithEvent(newEventAtThatDay, targetFactory)
      targetFactory = ({...targetFactory, isBombTarget: true})
      newState = updateStateWithFactory(targetFactory, newState)
      return newState
    }
  }

  // if target not found return initial state
  return state
}

export {
  maybeBomb
}