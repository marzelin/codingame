import {
  everyBut
} from './filterPredicates'
import {
  Iscores,
  Istate,
  OwnBy
} from './interfaces'
import {
  createDistanceKeyBetween,
  factoriesToList
} from './utilities'

const scoreModifierForMyFactories = (owner: OwnBy) => {
  switch (owner) {
    case OwnBy.me: return 1
    case OwnBy.enemy: return -1
    case OwnBy.nobody: return 1/2
  }
}

const calculateNeighborScore = (sourceFactoryId: number, neighborFactoryId: number, state: Istate) => {
  const distanceBetweenFactories = state.distances[createDistanceKeyBetween(sourceFactoryId, neighborFactoryId)]
  const { owner: neighborOwner, production: neighborProduction} = state.factories[neighborFactoryId]
  return neighborProduction / distanceBetweenFactories * scoreModifierForMyFactories(neighborOwner)
}

const getNeighborScores = (state: Istate) => (scores: Iscores, sourceFactoryId: number) => ({
  ...scores,
  [sourceFactoryId]: factoriesToList(state.factories)
    .filter(everyBut(sourceFactoryId))
    .reduce( (score, neighborFactory) => score + calculateNeighborScore(sourceFactoryId, neighborFactory.id, state), 0)
})

const byNeighborScore = (scores: Iscores) => (factory1Id: number, factory2Id: number) => scores[factory2Id] - scores[factory1Id]

export {
  calculateNeighborScore,
  getNeighborScores,
  byNeighborScore
}