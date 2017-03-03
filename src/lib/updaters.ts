import {
  IeventAtDay,
  Ifactories,
  Ifactory,
  Istate
} from './interfaces'

const update = <T, P extends keyof T>(key: P, value: T[P], obj: T): T => {
  return Object.assign<{}, T, any>({}, obj, {
    [key as any]: value
  })
}

const updateFactories = (factory: Ifactory, factories: Ifactories): Ifactories =>
  Object.assign<{}, Ifactories, Ifactories>({}, factories, {
    [factory.id]: factory
  })

const updateFactoryWithEvent = (event: IeventAtDay, factory: Ifactory): Ifactory => {
  const initialEvents = factory.eventsAtDay
  const newEvents = Object.assign<{}, Ifactory['eventsAtDay'], Ifactory['eventsAtDay']>({}, initialEvents, {
    [event.day]: event
  })
  return update('eventsAtDay', newEvents, factory)
}

const updateStateWithOrder = (order: string, state: Istate) => {
  const newOrders = state.orders.concat(order)
  return update('orders', newOrders, state)
}

const updateStateWithFactory = (factory: Ifactory, state: Istate): Istate => {
  const newFactories = Object.assign<{}, Ifactories, Ifactories>({}, state.factories, {
    [factory.id]: factory
  })
  const newState: Istate = Object.assign<{}, Istate, Partial<Istate>>({}, state, {
    factories: newFactories
  })
  return newState
}

export {
  update,
  updateFactories,
  updateFactoryWithEvent,
  updateStateWithFactory,
  updateStateWithOrder
}