import {
  Idistance
} from './interfaces'
import {
  update
} from './updaters'
import {
  createDistanceKeyBetween
} from './utilities'

/**
 * add distances (from one factory to the other and back)
 * and return new distance object
 */
const getDistances = (initialDistances: Idistance, input: string) => {
  const [factory1Id, factory2Id, distance] = input.split(' ').map(Number)

  return [initialDistances]
    .map(addDistance(factory1Id, factory2Id, distance))
    .map(addDistance(factory2Id, factory1Id, distance))
  [0]
}


const addDistance =
  (factory1Id: number, factory2Id: number, distance: number) =>
  (distances: Idistance) => {
    const distanceKey = createDistanceKeyBetween(factory1Id, factory2Id)
    return update(distanceKey, distance, distances)
  }

export {
  addDistance,
  getDistances
}