import {
  mineOnly
} from './filterPredicates'
import {
  Ifactories
} from './interfaces'
import {
  factoriesToList
} from './utilities'

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

const findMyCapitalId = (factories: Ifactories)  => {
  const capitalFactory = factoriesToList(factories).find(mineOnly)
  if (capitalFactory == null) {
    throw new Error('capital cannot be found')
  }
  return capitalFactory.id
}

export {
  processInitialInput,
  findMyCapitalId
}