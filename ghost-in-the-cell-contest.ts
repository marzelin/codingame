interface Ifactory {
  id: number
  owner: string
  production: number
  cyborgCount: number
  incomingTroops: 
    {
      daysToArrival: number
      troopSize: number
    }[]
  
}

const handleFactory = (
  id: string,
  [owner, cyborgCount, production]: string[],
  factories: Ifactory[]
) => {
  factories[Number(id)] = {
    id: Number(id),
    owner,
    cyborgCount: Number(cyborgCount),
    production: Number(production),
    incomingTroops: []
  }
  return factories
}

const handleTroop = (
  [,, destination, troopSize, daysToArrival]: string[],
  factories: Ifactory[]
) => {
  factories[Number(destination)].incomingTroops.push({
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

interface Imove {
  move: string
  production: number
  distance: number
}

const conquer = (distances: Idinstance, otherFactories: Ifactory[]) => (myFactory: Ifactory) => {
  const moves: Imove[] = []
  const enemyDefeated = otherFactories.every( (f) => f.owner !== '-1' || f.production === 0)
  otherFactories
    .sort(byDistance(distances, myFactory.id))
    .forEach( (factory) => {
      const distance = distances[`${myFactory.id}:${factory.id}`] 
      const enemyCountAtArrival = factory.cyborgCount + distance * factory.production
      if (myFactory.cyborgCount > enemyCountAtArrival
          && (factory.production > 0 || enemyDefeated) ) {
        moves.push({
          move: `MOVE ${myFactory.id} ${factory.id} ${enemyCountAtArrival + 1}`,
          production: factory.production,
          distance
        })
        myFactory.cyborgCount -= enemyCountAtArrival + 1
      }
    })
  return moves
}

interface Idinstance { [ids: string]: number}

const byDistance =
  (distances: Idinstance, sourceId: number) =>
  (factory1: Ifactory, factory2: Ifactory) => 
  distances[`${sourceId}:${factory1.id}`] - distances[`${sourceId}:${factory2.id}`]

const byProduciton = (move1: Imove, move2: Imove) => {
  if (move1.production === move2.production) {
    return move2.distance - move1.distance
  }
  return move2.production - move1.production
}

let factoryCount = Number(readline()) // the number of factories
let linkCount = Number(readline()) // the number of links between factories
const distances: Idinstance = Array
  .from(Array(linkCount), (_) => readline())
  .map( (s) => s.split(' '))
  .reduce( (s, [factory1, factory2, distance]) => 
    Object.assign({}, s,
    { [`${factory1}:${factory2}`]: Number(distance),
    [`${factory2}:${factory1}`]: Number(distance) }),
  {})
// game loop
while (true) {
    let factories: Ifactory[] = []
    let entityCount = Number(readline()) // the number of entities (e.g. factories and troops)
    for (let i = 0; i < entityCount; i++) {
        let [id, type, ...args] = readline().split(' ')
        switch (type) {
          case 'FACTORY':
            factories = handleFactory(id, args, factories)
            break
          case 'TROOP':
            factories = handleTroop(args, factories)
        }
    }
    let [myFactories, otherFactories] = assignFactories(factories)
    const moves: Imove[] = [].concat(...myFactories.map(conquer(distances, otherFactories)))
    print((moves.sort(byProduciton)[0] || {move: 'WAIT'}).move)
}