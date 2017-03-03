import {
  Ifactories,
  Ifactory
} from './interfaces'

const eventsToList = (events: Ifactory['eventsAtDay']) => Object.keys(events)
  .map( (arrivalDay) => events[Number(arrivalDay)])

const createDistanceKeyBetween = (factory1Id: number, factory2Id: number) => `${factory1Id}:${factory2Id}`  

const moveOrder = (sourceId: number, targetId: number, size: number) =>
  `MOVE ${sourceId} ${targetId} ${size}`

const factoriesToList = (factories: Ifactories): Ifactory[] =>
  Object.keys(factories)
    .map( (id) => factories[Number(id)])


export {
  createDistanceKeyBetween,
  eventsToList,
  factoriesToList,
  moveOrder,
}