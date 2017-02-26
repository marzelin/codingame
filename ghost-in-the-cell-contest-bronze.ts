const run = () => {
  const distances = processInitialInput()
  let availableBombs = 2
  
  while (true) {
    let state = processInput(distances, availableBombs)
    state = getOrders(state)
    print(state.orders.join('; ') || 'WAIT')
    availableBombs = state.availableBombs
  }
}

const handleFactory = (
  id: string,
  [owner, availableCyborgs, production, frozenDays]: string[],
  factories: Ifactory[]
) => {
  factories[Number(id)] = {
    id: Number(id),
    owner,
    availableCybors: Number(availableCyborgs),
    production: Number(production),
    frozenDays: Number(frozenDays),
    incomingTroops: []
  }
  return factories
}

const handleTroop = (
  [owner, , destination, troopSize, daysToArrival]: string[],
  factories: Ifactory[]
) => {
  factories[Number(destination)].incomingTroops.push({
    owner,
    daysToArrival: Number(daysToArrival),
    troopSize: Number(troopSize)
  })
  return factories
}

const assignFactories = (factories: Ifactory[]) => {
  let myFactories: Ifactory[] = []
  let otherFactories: Ifactory[] = []
  factories.forEach( (factory) => {
    if (factory.owner === '1') { myFactories.push(factory)}
    else { otherFactories.push(factory)}
  })
  return [myFactories, otherFactories]
}

const conquer = (distances: Idinstance, otherFactories: Ifactory[]) => (myFactory: Ifactory) => {
  const moves: string[] = []
  const enemyDefeated = otherFactories.every( (f) => f.owner !== '-1' || f.production === 0)
  otherFactories
    .sort(byDistance(distances, myFactory.id))
    .forEach( (factory) => {
      const distance = distances[`${myFactory.id}:${factory.id}`] 
      const enemyCountAtArrival = factory.availableCybors + distance * factory.production
      if (myFactory.availableCybors > enemyCountAtArrival
          && (factory.production > 0 || enemyDefeated) ) {
        moves.push(`MOVE ${myFactory.id} ${factory.id} ${enemyCountAtArrival + 1}`)
        myFactory.availableCybors -= enemyCountAtArrival + 1
      }
    })
  return moves
}

const byDistance =
  (distances: Idinstance, sourceId: number) =>
  (factory1: Ifactory, factory2: Ifactory) => 
  distances[`${sourceId}:${factory1.id}`] - distances[`${sourceId}:${factory2.id}`]

/** the number of factories */
let factoryCount = Number(readline())

/** the number of links between factories */
let linkCount = Number(readline())

const distances: Idinstance = Array
  .from(Array(linkCount), (_) => readline())
  .map( (s) => s.split(' '))
  .reduce( (s, [factory1, factory2, distance]) => 
    Object.assign({}, s,
    { [`${factory1}:${factory2}`]: Number(distance),
    [`${factory2}:${factory1}`]: Number(distance) }),
  {})
let availableBombs = 2
// game loop
while (true) {
    let factories: Ifactory[] = []
    let entityCount = Number(readline()) // the number of entities (e.g. factories and troops)
    let myBombTarget: undefined | number
    for (let i = 0; i < entityCount; i++) {
        let [id, type, ...args] = readline().split(' ')
        switch (type) {
          case 'FACTORY':
            factories = handleFactory(id, args, factories)
            break
          case 'TROOP':
            factories = handleTroop(args, factories)
            break
          case 'BOMB':
            if (args[0] === '1') {
              myBombTarget = Number(args[1])
            } 
            break
        }
    }
    let [myFactories, otherFactories] = assignFactories(factories)
    otherFactories.filter( (factory) => factory.id !== myBombTarget)
    const moves: string[] = [].concat(...myFactories.map(conquer(distances, otherFactories)))
    if (availableBombs && myBombTarget == null) {
      const target = otherFactories.find( (factory) => factory.owner === '-1' && factory.production > 1)
      if (target) {
        --availableBombs
        moves.push(`BOMB ${myFactories[0].id} ${target.id}`)
      }
    }
    print( moves.join(';') || 'WAIT' )
}

///////////////////////////////////////////////////////////////////////////////
/////////////////// Start program
run()

///////////////////////////////////////////////////////////////////////////////
/////////////////// INTERFACES


interface Ifactory {
  id: number
  owner: string
  production: number
  availableCybors: number
  frozenDays: number
  incomingTroops: 
    {
      owner: string
      daysToArrival: number
      troopSize: number
    }[]
  
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
