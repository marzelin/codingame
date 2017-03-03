import {
  maybeAttack
} from './attacking'
import {
  maybeDefend
} from './defending'
import {
  productiveOnly
} from './filterPredicates'
import {
  Istate,
  OwnBy
} from './interfaces'
import {
  byNeighborScore,
  getNeighborScores
} from './neighborScore'
import {
  factoriesToList
} from './utilities'

const planOrders = (state: Istate) => {
  const factoriesIds = factoriesToList(state.factories)
    .filter(productiveOnly)
    .map( (factory) => Number(factory.id))
  const scores = factoriesIds.reduce(getNeighborScores(state), {})
  const factoriesRanked = factoriesIds.sort(byNeighborScore(scores)) // refer to the same array as factoriesIds
  const newState = factoriesRanked.reduce(giveOrders, state)
  return newState
}

const giveOrders = (state: Istate, factoryId: number) => {
  let factoryOwner = state.factories[factoryId].owner
  switch (factoryOwner) {
    case OwnBy.enemy:
    case OwnBy.nobody:
      return maybeAttack(factoryId, state)
    case OwnBy.me:
      return maybeDefend(factoryId, state)
  }
}

export {
  planOrders
}