import {
  Idistance,
  Ifactory
} from './interfaces'

const byProduction = (factory1: Ifactory, factory2: Ifactory) =>
  factory2.production - factory1.production

const byProductionAndDistanceFromMyCapital =
(distances: Idistance, myCapitalId: number) =>
(factory1: Ifactory, factory2: Ifactory) =>
  factory2.production !== factory1.production
  ? factory2.production - factory1.production
  : distances[`${factory1.id}:${myCapitalId}`] - distances[`${factory2.id}:${myCapitalId}`]

const byDistanceFromCapitalAndProduction = 
(distances: Idistance, myCapitalId: number) =>
(factory1: Ifactory, factory2: Ifactory) =>
  distances[`${factory1.id}:${myCapitalId}`] !== distances[`${factory2.id}:${myCapitalId}`]
  ? distances[`${factory1.id}:${myCapitalId}`] - distances[`${factory2.id}:${myCapitalId}`]
  : factory2.production - factory1.production

const byDistance =
  (distances: Idistance, sourceId: number) =>
  (factory1: Ifactory, factory2: Ifactory) => 
  distances[`${sourceId}:${factory1.id}`] - distances[`${sourceId}:${factory2.id}`]

export {
  byProduction,
  byProductionAndDistanceFromMyCapital,
  byDistance,
  byDistanceFromCapitalAndProduction
}