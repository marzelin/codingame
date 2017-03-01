const exportsForTests = (function(){ // IIFE to make variables not to leak outside of this file
  const run = () => {
    const initialInput = processInitialInput()
    /** distances between factories */
    const distances = initialInput.reduce(getDistances, {})
    /** bombs available to use */
    let availableBombs = 2
    let myCapitalId: number | null = null
    let gameTurn = 0
    let isEarlyGame = true
    
    while (true) {
      const factories = processTurnInput()

      if (myCapitalId == null) {
        myCapitalId = findMyCapitalId(factories)
      }

      const state: Istate = [{ 
        myCapitalId,
        distances,
        availableBombs,
        factories,
        orders: [],
        isEarlyGame
      }]
        .map(maybeBomb)
        .map(planOrders)
        [0]

      const printableOrders = state.orders.join('; ') || 'WAIT'
      print(printableOrders)

      availableBombs = state.availableBombs

      gameTurn += 1
      if (gameTurn > 7) { isEarlyGame = false }
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  /////////////////// INPUT PROCESSING

  const processInitialInput = () => {
    /** read and forget useless number of factories */
    readline()

    /** the number of links between factories */
    const linkCount = Number(readline())

    const inputs = []
    for (let i = 0; i < linkCount; i++) {
      const input = readline()
      inputs.push(input)
    }

    return inputs
  }

  const getDistances = (initialDistances: Idinstance, input: string) => {
    const [factory1Id, factory2Id, distance] = input.split(' ').map(Number)

    return [initialDistances]
      .map(addDistance(factory1Id, factory2Id, distance))
      .map(addDistance(factory2Id, factory1Id, distance))
      [0]
  }


  const addDistance =
    (factory1Id: number, factory2Id: number, distance: number) =>
    (distances: Idinstance) => {
      const distanceKey = createDistanceKeyBetween(factory1Id, factory2Id)
      return update(distanceKey, distance, distances)
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
    let [owner, availableCyborgs, production, frozenDays] = args.map(Number)

    const factory = {
      id: id,
      owner,
      availableCyborgs,
      production,
      frozenDays,
      isBombTarget: false,
      incomingTroops: {}
    }

    return updateFactories(factory, factories)
  }

  const processTroop = ( args: string[], initialFactories: Ifactories): Ifactories => {
    const [owner, , destinationFactoryId, size, day] = args.map(Number)
    const initialFactory = initialFactories[destinationFactoryId]
    const initialEvent = initialFactory.eventsAtDay[day]

    const newEvent: IeventAtDay = {
      day,
      incomingTroopSize: size,
      troopOwner: owner
    }

    let finalEvent: IeventAtDay

    if (initialEvent) { // there are already events at this day
      const initialTroopSize = initialEvent.incomingTroopSize 

      if (initialTroopSize === undefined // no troops coming at that day (there must be bomb exploding)
      || initialTroopSize === 0) { // troops annihilated aech other, doesn't matter who is the owner, because factory cannot be captured with 0 cyborgs
          finalEvent = Object.assign<{}, IeventAtDay, IeventAtDay>({}, initialEvent, newEvent) // just replace previous values with new ones
      } else { // there are some troops coming at that day
        const initialTroopOwner = initialEvent.troopOwner
        if (initialTroopOwner === owner) {  // troops are allied
          const combinedTroopSize = initialTroopSize + size
          finalEvent = Object.assign<{}, IeventAtDay, Partial<IeventAtDay>>({}, newEvent, {
            incomingTroopSize: combinedTroopSize
          })
        } else { // troops are hostiled, let them fight

          const troopSizeAfterBattle = size - initialTroopSize
          if (troopSizeAfterBattle > 0) { // new troop won so change troop size and owner
            finalEvent = Object.assign<{}, IeventAtDay, Partial<IeventAtDay>>({}, newEvent, {
              incomingTroopSize: troopSizeAfterBattle
            })
          } else { // previous troop won, or troops killed each other in which case owner doesn't matter
            const remainingTroopSize = - troopSizeAfterBattle // the number of remaing troops is negative here so revert it
            finalEvent = Object.assign<{}, IeventAtDay, Partial<IeventAtDay>>({}, newEvent, {
              incomingTroopSize: remainingTroopSize   
            })
          }
        }
               
      }
    } else { // there's no event at this day, put new event as is
      finalEvent = newEvent
    }

    const finalFactoryState = updateFactoryWithEvent(finalEvent, initialFactory)
    const newFactories = updateFactories(finalFactoryState, initialFactories)

    return  newFactories
  }

  const processBomb = (args: string[], factories: Ifactories) => {
    let [bombOwner, , targetId] = args.map(Number)
    if (bombOwner === OwnBy.me) {
      let factory = factories[targetId] 
      factory = update('isBombTarget', true, factory)
      factories = updateFactories(factory, factories)
    }
    return factories
  }

  const findMyCapitalId = (factories: Ifactories)  => {
    const capitalFactory = factoriesToList(factories).find(mineOnly)
    if (capitalFactory == null) {
      throw new Error('capital cannot be found')
    }
    return capitalFactory.id
  }

  ///////////////////////////////////////////////////////////////////////////////
  /////////////////// PLAN ORDERS

  const maybeBomb = (state: Istate) => {
    if (!state.availableBombs) { // if there's no more bomb to launch, do nothing
      return state
    }

    let newState = state 

    let factories = state.factories
    let targetFactory = Object.keys(factories)
      .map( (id) => factories[Number(id)])
      .filter(enemyOnly)
      .filter(productionGte2only)
      .filter(noCaptureInProgress)
      .filter(noBombTarget)
      .filter(noFrozen)
      .sort(byProduction)[0]

    if (targetFactory) {
      /** the factory from which the bomb will be launched */
      let bombLaunchFactory = factoriesToList(state.factories)
      .filter(mineOnly)
      .sort(byDistance(state.distances, targetFactory.id))[0]

      if (bombLaunchFactory) {
        const newAvailableBombs = state.availableBombs - 1
        newState = update('availableBombs', newAvailableBombs, newState)

        const newOrder = `BOMB ${bombLaunchFactory.id} ${targetFactory.id}`
        newState = updateStateWithOrder(newOrder, newState)

        targetFactory = update('isBombTarget', true, targetFactory)
        newState = updateStateWithFactory(targetFactory, newState)
        return newState
      }
    }

    // if target not found return initial state
    return state
  }

  const planOrders = (state: Istate) => {
    const factoriesIdByAttractivenes = factoriesToList(state.factories)
    .filter(productiveOnly)
    .filter(noBombTarget)
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

  const maybeAttack = (targetId: number, state: Istate) => {
    const myFactories = factoriesToList(state.factories)
      .filter(mineOnly)
      .sort(byDistance(state.distances, targetId))
      
    let newState = state

    for (let myFactory of myFactories) {
      let distance = newState.distances[createDistanceKeyBetween(myFactory.id, targetId)]
      let target = newState.factories[targetId]
      /** target state at the time of possible attack */
      let targetInFuture = getFuture(target, distance + 1)

      if (targetInFuture.owner !== OwnBy.me) { // if not mine try to attack
        if (myFactory.availableCyborgs > targetInFuture.availableCyborgs) {
          const assaultTroopSize = targetInFuture.availableCyborgs + 1

          const newOrder = moveOrder(myFactory.id, targetId, assaultTroopSize)
          newState = updateStateWithOrder(newOrder, newState)

          const newAvailableCyborgs = myFactory.availableCyborgs  - assaultTroopSize
          const newMyFactory = update('availableCyborgs', newAvailableCyborgs, myFactory)

          newState = updateStateWithFactory(newMyFactory, newState)
        }
      }
    }
    return newState
  }

  const getFuture = (factory: Ifactory, day: number) => {
    const incomingTroops = troopsToList(factory.incomingTroops)
      .filter(arriveUntil(day))

    if (incomingTroops.length === 0) { // there's no incoming troops
      if (factory.owner === OwnBy.nobody) {
        return factory // return unchanged factory because neutral factories do not produce cyborgs
      }
      const newAvailableCyborgs = factory.availableCyborgs + factory.production * day
      const updatedFactory = update('availableCyborgs', newAvailableCyborgs, factory)
      return updatedFactory
    }

    let futureFactory = factory
    let previousArrivalDay = 0
    for (let incomingTroop of incomingTroops) {
      let futureOwner         = futureFactory.owner
      let troopSize           = incomingTroop.size
      let newOwner            = futureFactory.owner
      let production          = futureFactory.production
      let arrivalDay          = incomingTroop.daysToArrival
      let newAvailableCyborgs = futureFactory.availableCyborgs
      if (newOwner !== OwnBy.nobody) {
        newAvailableCyborgs =  production * (arrivalDay - previousArrivalDay)
      }
      switch (futureOwner) {
        case OwnBy.me:
          if (troopSize >= 0) { // my own troops coming
            newAvailableCyborgs = newAvailableCyborgs + troopSize
          } else { // enemy troops coming
            newAvailableCyborgs = newAvailableCyborgs + troopSize
            if (newAvailableCyborgs < 0) {
              newOwner = OwnBy.enemy // change owner
              newAvailableCyborgs = newAvailableCyborgs * -1 // make cyborg count a positive number
            }
          }
          break
        case OwnBy.enemy:
          if (troopSize >= 0) { // my own troops coming
            newAvailableCyborgs = newAvailableCyborgs - troopSize
            if (newAvailableCyborgs < 0) {
              newOwner = OwnBy.me // change owner
              newAvailableCyborgs = newAvailableCyborgs * -1 // make cyborg count a positive number
            }
          } else { // enemy troops coming
            newAvailableCyborgs -= troopSize // enemy troops are in negative that's why minus
          }
          break
        case OwnBy.nobody:
          if (troopSize >= 0) { // my own troops coming
            newAvailableCyborgs = newAvailableCyborgs - troopSize
            if (newAvailableCyborgs < 0) {
              newOwner = OwnBy.me
              newAvailableCyborgs = newAvailableCyborgs * -1
            }
          } else { // enemy troops coming
            newAvailableCyborgs = newAvailableCyborgs + troopSize // enemy troops are in negative that's why minus
            if (newAvailableCyborgs < 0) {
              newOwner = OwnBy.enemy
              newAvailableCyborgs = newAvailableCyborgs * -1
            }
          }
      }

      futureFactory = update('availableCyborgs', newAvailableCyborgs, futureFactory)
      futureFactory = update('owner', newOwner, futureFactory)

      previousArrivalDay = arrivalDay
    }

    if (futureFactory.owner !== OwnBy.nobody) {
      let newAvailableCyborgs = futureFactory.availableCyborgs +
        futureFactory.production * (day - previousArrivalDay)

      futureFactory = update('availableCyborgs', newAvailableCyborgs, futureFactory)
    }
    return futureFactory
  }

  const maybeDefend = (factoryId: number, state: Istate) => {
    // TODO
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

  const byDistanceFromCapitalAndProduction = 
  (distances: Idinstance, myCapitalId: number) =>
  (factory1: Ifactory, factory2: Ifactory) =>
    distances[`${factory1.id}:${myCapitalId}`] !== distances[`${factory2.id}:${myCapitalId}`]
    ? distances[`${factory1.id}:${myCapitalId}`] - distances[`${factory2.id}:${myCapitalId}`]
    : factory2.production - factory1.production

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
  const noFrozen = (factory: Ifactory) => factory.frozenDays - 1 <= 0

  // for troops

  const arriveUntil = (day: number) => (troop: Ifactory['eventsAtDay'][any]) =>
    troop.daysToArrival <= day

  ///////////////////////////////////////////////////////////////////////////////
  /////////////////// UTILITIES

  const factoriesToList = (factories: Ifactories): Ifactory[] =>
    Object.keys(factories)
      .map( (id) => factories[Number(id)])

  const troopsToList = (troops: Ifactory['eventsAtDay']) => Object.keys(troops)
    .map( (arrivalDay) => troops[Number(arrivalDay)])

  const createDistanceKeyBetween = (factory1Id: number, factory2Id: number) => `${factory1Id}:${factory2Id}`  

  const moveOrder = (sourceId: number, targetId: number, size: number) =>
    `MOVE ${sourceId} ${targetId} ${size}`

  ///////////////////////////////////////////////////////////////////////////////
  /////////////////// NON-MUTABLE OBJECT UPDATES

  const updateStateWithFactory = (factory: Ifactory, state: Istate): Istate => {
    const newFactories = Object.assign<{}, Ifactories, Ifactories>({}, state.factories, {
      [factory.id]: factory
    })
    const newState: Istate = Object.assign<{}, Istate, Partial<Istate>>({}, state, {
      factories: newFactories
    })
    return newState
  }

  const updateStateWithOrder = (order: string, state: Istate) => {
    const newOrders = state.orders.concat(order)
    return update('orders', newOrders, state)
  }

  const update = <T, P extends keyof T>(key: P, value: T[P], obj: T): T => {
    return Object.assign<{}, T, any>({}, obj, {
      [key as any]: value
    })
  }

  const updateFactoryWithEvent = (event: IeventAtDay, factory: Ifactory): Ifactory => {
    const initialEvents = factory.eventsAtDay
    const newEvents = Object.assign<{}, Ifactory['eventsAtDay'], Ifactory['eventsAtDay']>({}, initialEvents, {
      [event.day]: event
    })
    return update('eventsAtDay', newEvents, factory)
  }

  const updateFactories = (factory: Ifactory, factories: Ifactories): Ifactories =>
    Object.assign<{}, Ifactories, Ifactories>({}, factories, {
      [factory.id]: factory
    })

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
    isBombExploding?: boolean
    troopOwner?: OwnBy
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

  if(typeof module === 'undefined') {
    run() // if the runtime environment is NOT node, run the program and thus never leave this function
  }
  return {
    OwnBy,
    addDistance,
    processTroop
  }
}())

export = exportsForTests