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
  byDistanceFromCapitalAndProduction,
  byProductionAndDistanceFromMyCapital
} from './sorters'
import {
  factoriesToList
} from './utilities'

const planOrders = (state: Istate) => {
  const factoriesIdByAttractivenes = factoriesToList(state.factories)
  .filter(productiveOnly)
  .sort((state.isEarlyGame
    ? byDistanceFromCapitalAndProduction
    : byProductionAndDistanceFromMyCapital)
    (state.distances, state.myCapitalId))
  .map( (factory) => Number(factory.id))
  const newState = factoriesIdByAttractivenes.reduce(giveOrders, state)
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