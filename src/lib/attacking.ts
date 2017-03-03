// tslint:disable-next-line:ordered-imports
import {
  mineOnly
} from './filterPredicates'
import {
  getFuture
} from './futurePrediction'
import {
  Ifactory,
  Istate,
  OwnBy
} from './interfaces'
import {
  byDistance
} from './sorters'
import {
  update,
  updateStateWithFactory,
  updateStateWithOrder
} from './updaters'
import {
  createDistanceKeyBetween,
  eventsToList,
  factoriesToList,
  moveOrder
} from './utilities'

const maybeAttack = (targetId: number, state: Istate) => {
  const myFactories = factoriesToList(state.factories)
    .filter(mineOnly)
    .sort(byDistance(state.distances, targetId))
    
  let newState = state

  for (let myFactory of myFactories) {
    let possibleDayOfAttack = newState.distances[createDistanceKeyBetween(myFactory.id, targetId)] + 1

    let target = newState.factories[targetId]

    /** 
     * don't attack if there's bombing prepared after possible day of attack
     * or the bomb will be sent from this factory (game rules forbid sending troops and bomb from the same factory at the same day)
    */
    if (isThereBombingAfter(possibleDayOfAttack, target)
       || (target.eventsAtDay[possibleDayOfAttack] && target.eventsAtDay[possibleDayOfAttack].factoryIdWhereBombWasLaunchedFrom === myFactory.id) ) { continue }

    /** target state at the time of possible attack */
    let targetInFuture = getFuture(target, possibleDayOfAttack)

    if (targetInFuture.owner !== OwnBy.me) { // if not mine try to attack
      if (myFactory.availableCyborgs > targetInFuture.availableCyborgs) {
        const assaultTroopSize = targetInFuture.availableCyborgs + 1

        const newOrder = moveOrder(myFactory.id, targetId, assaultTroopSize)
        newState = updateStateWithOrder(newOrder, newState)

        const newAvailableCyborgs = myFactory.availableCyborgs  - assaultTroopSize
        const newMyFactory = update('availableCyborgs', newAvailableCyborgs, myFactory)

        newState = updateStateWithFactory(newMyFactory, newState)
      }
    }
  }
  return newState
}

const isThereBombingAfter = (bombingDay: number, targetFactory: Ifactory): boolean =>
 eventsToList(targetFactory.eventsAtDay)
  .filter( (event) => event.day > bombingDay)
  .some( (event) => Boolean(event.isBombExploding)) // conversion because event.isBombExploding can be undefined and returning types should match

export {
  maybeAttack
}