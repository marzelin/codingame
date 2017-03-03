import {
  Ifactory,
  OwnBy
} from './interfaces'

const productiveOnly = (factory: Ifactory) => factory.production > 0

const enemyOnly = (factory: Ifactory) => factory.owner === OwnBy.enemy

const mineOnly = (factory: Ifactory) => factory.owner === OwnBy.me

const productionGte2only = (factory: Ifactory) => factory.production >= 2

const noCaptureInProgress = (factory: Ifactory) => {
  const incomingTroopsCount = Object.keys(factory.eventsAtDay)
  .map( (key) => factory.eventsAtDay[Number(key)] )
  .reduce( (sum, event) => sum + (event.incomingTroopSize || 0), 0)
  return incomingTroopsCount <= 0
}

const noBombTarget = (factory: Ifactory) => !factory.isBombTarget
const noFrozen = (factory: Ifactory) => factory.frozenDays - 1 <= 0

const everyBut = (sourceFactoryId: number) => (factory: Ifactory) => factory.id !== sourceFactoryId

// for troops

const arriveUntil = (day: number) => (event: Ifactory['eventsAtDay'][any]) =>
  event.day <= day

export {
  productiveOnly,
  enemyOnly,
  everyBut,
  mineOnly,
  productionGte2only,
  noCaptureInProgress,
  noBombTarget,
  noFrozen,
  arriveUntil
}