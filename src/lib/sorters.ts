import {
  Idistance,
  Ifactory
} from './interfaces'

const byProduction = (factory1: Ifactory, factory2: Ifactory) =>
  factory2.production - factory1.production

const byDistance =
  (distances: Idistance, sourceId: number) =>
  (factory1: Ifactory, factory2: Ifactory) => 
  distances[`${sourceId}:${factory1.id}`] - distances[`${sourceId}:${factory2.id}`]

export {
  byProduction,
  byDistance,
}