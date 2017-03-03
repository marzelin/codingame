import {
  IeventAtDay,
  Ifactories,
  OwnBy
} from './interfaces'
import {
  update,
  updateFactories,
  updateFactoryWithEvent
} from './updaters'

const processBomb = (args: string[], factories: Ifactories) => {
  let [bombOwner, , targetId, day] = args.map(Number)
  if (bombOwner === OwnBy.me) {
    let factory = factories[targetId] 
    factory = update('isBombTarget', true, factory)

    const previousEvent = factory.eventsAtDay[day]
    let newEvent: IeventAtDay = previousEvent
      ? Object.assign<{}, IeventAtDay, Partial<IeventAtDay>>({}, previousEvent, {
          isBombExploding: true })
      : { day,
          isBombExploding: true }
          
    factory = updateFactoryWithEvent(newEvent, factory)

    factories = updateFactories(factory, factories)
  }
  return factories
}

export {
  processBomb
}