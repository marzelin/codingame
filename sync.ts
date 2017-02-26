const run = () => {
  /** distances between factories */
  const distances = processInitialInput()
  printErr(`distances ` + Object.keys(distances))
  /** bombs available to detonate */
  let availableBombs = 2
  
  while (true) {
    let factories = processTurnInput()

    let state: Istate = { 
      distances,
      availableBombs,
      factories,
      orders: []
    }

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


///////////////////////////////////////////////////////////////////////////////
/////////////////// PLAN ORDERS

const planOrders = (state: Istate) => {
  let factories = state.factories
  return Object.keys(factories)
  .map( (id) => factories[Number(id)])
  .sort(byProduction)
  .map( (factory) => Number(factory.id))
  .reduce(handle, state)
}

const handle = (state: Istate, targetId: number) => {
  let factories = state.factories
  const targetFactory = factories[targetId]
  if (targetFactory.owner !== OwnBy.me) {
    const myFactories = Object.keys(factories)
    .map( (id) => factories[Number(id)] )
    .filter( ({owner}) => owner === OwnBy.me)
    .sort(byDistance(state.distances, targetId))
    for (let myFactory of myFactories) {
      printErr('myFactory ' + myFactory.id)
      printErr('targetFactory ' + targetId)
      printErr(`${myFactory.id}:${targetId}`)
      const distance = state.distances[`${myFactory.id}:${targetId}`]
      printErr('distance keys ' + Object.keys(state.distances))
      const myCyborgs = myFactory.availableCybors 
      const enemyCyborgs = targetFactory.availableCybors + targetFactory.production * distance 
      printErr('targetFactory.availableCybors ' + targetFactory.availableCybors)
      printErr('targetFactory.production ' + targetFactory.production)
      printErr('distance ' + distance)
      printErr('myCyborgs ' + myCyborgs)
      printErr('enemyCyborgs ' + enemyCyborgs)
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

const byDistance =
  (distances: Idinstance, sourceId: number) =>
  (factory1: Ifactory, factory2: Ifactory) => 
  distances[`${sourceId}:${factory1.id}`] - distances[`${sourceId}:${factory2.id}`]

///////////////////////////////////////////////////////////////////////////////
/////////////////// INTERFACES

enum OwnBy {
  me = 1,
  nobody = 0,
  enemy = -1
}

interface Istate {
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
