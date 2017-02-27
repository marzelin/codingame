const run = () => {
  /** distances between factories */
  const distances = processInitialInput()
  /** bombs available to detonate */
  let availableBombs = 2
  let myCapitalId: number
  
  while (true) {
    let factories = processTurnInput()
    myCapitalId = myCapitalId != null
    ? myCapitalId
    : findMyCapitalId(factories)

    let state: Istate = { 
      myCapitalId,
      distances,
      availableBombs,
      factories,
      orders: []
    }

    state = maybeBomb(state)
    state = planOrders(state)
    print(state.orders.join('; ') || 'WAIT')
    availableBombs = state.availableBombs
  }
}

///////////////////////////////////////////////////////////////////////////////
/////////////////// INPUT PROCESSING

const processInitialInput = () => {
  /** read and forget useless number of factories */
  readline()
  /** the number of links between factories */
  let linkCount = Number(readline())

  return Array
    .from(Array(linkCount), (_) => readline())
    .map( (s) => s.split(' '))
    .reduce( (s, [factory1, factory2, distance]) => 
      Object.assign({}, s,
      { [`${factory1}:${factory2}`]: Number(distance),
      [`${factory2}:${factory1}`]: Number(distance) }),
    {} as Idinstance)
}

const processTurnInput = () => {
  let factories: Ifactories = {}
  let entityCount = Number(readline()) // the number of entities (e.g. factories and troops)
  for (let i = 0; i < entityCount; i++) {
      let [idString, type, ...args] = readline().split(' ')
      let id = Number(idString)
      switch (type) {
        case 'FACTORY':
          factories = processFactory(id, args, factories)
          break
        case 'TROOP':
          factories = processTroop(args, factories)
          break
        case 'BOMB':
          if (args[0] === '1') {
            factories = processBomb(args, factories)
          } 
          break
      }
  }
  return factories
}

const processFactory = ( id: number, args: string[], factories: Ifactories) => {
  let [owner, availableCybors, production, frozenDays] = args.map(Number)
  // count in negative numbers for factories not owned by me
  // not so useful by maybe...
  // if (owner !== OwnBy.me) { availableCybors = availableCybors * - 1 }
  factories[id] = {
    id: id,
    owner,
    availableCybors,
    production,
    frozenDays,
    isBombTarget: false,
    incomingTroops: {}
  }
  return factories
}

const processTroop = ( args: string[], factories: Ifactories) => {
  let [owner, , destinationId, size, daysToArrival] = args.map(Number)

  if (owner !== OwnBy.me) { size = size * -1 }

  let factory = factories[destinationId]
  let incomingTroops = factory.incomingTroops
  let previousTroops = incomingTroops[daysToArrival]

  let troops: Ifactory['incomingTroops'][any] =  previousTroops
    ? Object.assign({}, previousTroops, { size: previousTroops.size + size }) 
    : { daysToArrival, size }

  incomingTroops = Object.assign({}, incomingTroops, {[daysToArrival]: troops})
  factory = Object.assign({}, factory, { incomingTroops })
  
  return Object.assign({}, factories, { [destinationId]: factory})
}

const processBomb = (args: string[], factories: Ifactories) => {
  let [bombOwner, , targetId] = args.map(Number)
  if (bombOwner === OwnBy.me) {
    let factory = factories[targetId] 
    factory = Object.assign({}, factory, { isBombTarget: true })
    factories = Object.assign({}, factories, { [targetId]: factory})
  }
  return factories
}

const findMyCapitalId = (factories: Ifactories)  =>
  factoriesToList(factories)
  .find(mineOnly).id

///////////////////////////////////////////////////////////////////////////////
/////////////////// PLAN ORDERS

const maybeBomb = (state: Istate) => {
  if (!state.availableBombs) { return state }

  let factories = state.factories
  let target = Object.keys(factories)
  .map( (id) => factories[Number(id)])
  .filter(enemyOnly)
  .filter(productionGte2only)
  .filter(noCaptureInProgress)
  .filter(noBombTarget)
  .sort(byProduction)[0]
  if (target) {
    /** the factory from which the bomb will be launched */
    let bombLaunchFactory = factoriesToList(state.factories)
    .filter(mineOnly)
    .sort(byDistance(state.distances, target.id))[0]
    if (bombLaunchFactory) {
      const newAvailableBombs = state.availableBombs - 1
      const newOrder = `BOMB ${bombLaunchFactory.id} ${target.id}`
      const newOrders = state.orders.slice().concat(newOrder)
      target = Object.assign({}, target, {
        isBombTarget: true
      })
      const newFactories = Object.assign({}, factories, {
        [target.id]: target
      })
      const newState: Istate = Object.assign({}, state, {
        factories: newFactories,
        orders: newOrders,
        availableBombs: newAvailableBombs 
      })
      return newState
    }
  }
  return state
}

const planOrders = (state: Istate) => {
  const factoriesIdByAttractivenes = factoriesToList(state.factories)
  .filter(productiveOnly)
  .filter(noBombTarget)
  .sort(byProductionAndDistanceFromMyCapital(state.distances, state.myCapitalId))
  .map( (factory) => Number(factory.id))
  const newState = factoriesIdByAttractivenes.reduce(handle, state)
  return newState
}

const handle = (state: Istate, targetId: number) => {
  let factories = state.factories
  const targetFactory = factories[targetId]
  const attacker = Object.keys(targetFactory.incomingTroops)
  .map(Number) .sort()
  .map( (daysToArrival) => targetFactory.incomingTroops[daysToArrival])[0]
  if (targetFactory.owner !== OwnBy.me
      // if there is no incoming troops
      // or they are not mine
      && !(attacker && attacker.size > 0)) {
    const myFactories = Object.keys(factories)
    .map( (id) => factories[Number(id)] )
    .filter( ({owner}) => owner === OwnBy.me)
    .sort(byDistance(state.distances, targetId))
    for (let myFactory of myFactories) {
      const distance = state.distances[`${myFactory.id}:${targetId}`]
      const myCyborgs = myFactory.availableCybors 
      let enemyCyborgs = targetFactory.availableCybors
      if (targetFactory.owner === OwnBy.enemy) { enemyCyborgs += targetFactory.production * (distance + 1) }
      if (myCyborgs > enemyCyborgs) {
        myFactory = Object.assign({}, myFactory, {
          availableCybors: myFactory.availableCybors - enemyCyborgs - 1
        })
        factories = Object.assign({}, factories, {
          [myFactory.id]: myFactory
        })

        const order = `MOVE ${myFactory.id} ${targetId} ${enemyCyborgs + 1}`
        const orders = state.orders.slice().concat(order)

        const newState: Istate = Object.assign({}, state, {
          factories,
          orders
        })

        return newState
      }
    }
  }
  return state
}

///////////////////////////////////////////////////////////////////////////////
/////////////////// SORT ORDER

const byProduction = (factory1: Ifactory, factory2: Ifactory) =>
  factory2.production - factory1.production

const byProductionAndDistanceFromMyCapital =
(distances: Idinstance, myCapitalId: number) =>
(factory1: Ifactory, factory2: Ifactory) =>
  factory2.production !== factory1.production
  ? factory2.production - factory1.production
  : distances[`${factory1.id}:${myCapitalId}`] - distances[`${factory2.id}:${myCapitalId}`]

const byDistance =
  (distances: Idinstance, sourceId: number) =>
  (factory1: Ifactory, factory2: Ifactory) => 
  distances[`${sourceId}:${factory1.id}`] - distances[`${sourceId}:${factory2.id}`]

///////////////////////////////////////////////////////////////////////////////
/////////////////// PREDICATES

/** 
 * predicate for filter that saves
 * only factories with production
 * greater than 0
 */
const productiveOnly = (factory: Ifactory) => factory.production > 0

const enemyOnly = (factory: Ifactory) => factory.owner === OwnBy.enemy

const mineOnly = (factory: Ifactory) => factory.owner === OwnBy.me

const productionGte2only = (factory: Ifactory) => factory.production >= 2

const noCaptureInProgress = (factory: Ifactory) => {
  const incomingTroopsCount = Object.keys(factory.incomingTroops)
  .map( (key) => factory.incomingTroops[Number(key)] )
  .reduce( (sum, troop) => sum + troop.size, 0)
  return incomingTroopsCount <= 0
}

const noBombTarget = (factory: Ifactory) => !factory.isBombTarget
const noFrozen = (factory: Ifactory) => !factory.frozenDays

///////////////////////////////////////////////////////////////////////////////
/////////////////// UTILITIES

const factoriesToList = (factories: Ifactories) => Object.keys(factories)
  .map( (id) => factories[Number(id)])

const troopsToList = (factory: Ifactory) => Object.keys(factory.incomingTroops)
  .map( (arrivalDay) => factory.incomingTroops[Number(arrivalDay)])

///////////////////////////////////////////////////////////////////////////////
/////////////////// INTERFACES

enum OwnBy {
  me = 1,
  nobody = 0,
  enemy = -1
}

interface Istate {
    myCapitalId: number
    distances: Idinstance
    availableBombs: number
    factories: Ifactories
    orders: string[]
}

interface Ifactories {
  [id: number]: Ifactory
}

interface Ifactory {
  id: number
  owner: OwnBy
  production: number
  availableCybors: number
  frozenDays: number
  isBombTarget: boolean
  incomingTroops: {
    [daysToArrival: number]: {
      daysToArrival: number
      size: number
    }
  }
  
}

/**
 * dinsance between two factories
 * in form [factory1id:factory2id]: distance between them
 * 
 * @interface Idinstance
 */
interface Idinstance {
  [ids: string]: number
}

///////////////////////////////////////////////////////////////////////////////
/////////////////// START PROGRAM

run()
