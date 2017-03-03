import {
  IeventAtDay,
  Ifactories,
  OwnBy
} from './interfaces'
import {
  updateFactoryWithEvent
} from './updaters'

const processBomb = (args: string[], factories: Ifactories) => {
  let [bombOwner, , targetId, day] = args.map(Number)
  if (bombOwner === OwnBy.me) {
    let factory = factories[targetId] 
    factory = ({...factory, isBombTarget: true})

    const previousEvent = factory.eventsAtDay[day]
    let newEvent: IeventAtDay = previousEvent
      ? Object.assign<{}, IeventAtDay, Partial<IeventAtDay>>({}, previousEvent, {
          isBombExploding: true })
      : { day,
          isBombExploding: true }
          
    factory = updateFactoryWithEvent(newEvent, factory)

    factories = {...factories, [factory.id]: factory}
  }
  return factories
}

export {
  processBomb
}