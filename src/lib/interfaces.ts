enum OwnBy {
  me = 1,
  nobody = 0,
  enemy = -1
}

interface Istate {
    myCapitalId: number
    distances: Idistance
    availableBombs: number
    factories: Ifactories
    orders: string[]
    isEarlyGame: boolean
}

interface Ifactories {
  [id: number]: Ifactory
}

interface Ifactory {
  id: number
  owner: OwnBy
  production: number
  availableCyborgs: number
  frozenDays: number
  isBombTarget: boolean
  eventsAtDay: {
    [day: number]: IeventAtDay
  }
}

interface IeventAtDay {
  day: number
  incomingTroopSize?: number
  troopOwner?: OwnBy
  isBombExploding?: boolean
  factoryIdWhereBombWasLaunchedFrom?: number
}

/**
 * dinsance between two factories
 * in form [factory1id:factory2id]: distance between them
 * 
 * @interface Idinstance
 */
interface Idistance {
  [ids: string]: number
}

export {
  OwnBy,
  Istate,
  Ifactories,
  Ifactory,
  IeventAtDay,
  Idistance
}