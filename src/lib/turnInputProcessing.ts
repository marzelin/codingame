import {
  Ifactories
} from './interfaces'
import {
  processBomb
} from './processBomb'
import {
  processTroop
} from './processTroop'
import {
  updateFactories
} from './updaters'

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
    eventsAtDay: {}
  }

  return updateFactories(factory, factories)
}

export {
  processTurnInput
}