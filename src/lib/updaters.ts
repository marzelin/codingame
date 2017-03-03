import {
  IeventAtDay,
  Ifactories,
  Ifactory,
  Istate
} from './interfaces'

const updateFactories = (factory: Ifactory, factories: Ifactories): Ifactories =>
  ({...factories, [factory.id]: factory})

const updateFactoryWithEvent = (event: IeventAtDay, factory: Ifactory): Ifactory =>
  ({...factory, eventsAtDay: {...factory.eventsAtDay, [event.day]: event}})

const updateStateWithOrder = (order: string, state: Istate) =>
  ({...state, orders: state.orders.concat(order) })

const updateStateWithFactory = (factory: Ifactory, state: Istate): Istate =>
  ({...state, factories: {...state.factories, [factory.id]: factory}})

export {
  updateFactories,
  updateFactoryWithEvent,
  updateStateWithFactory,
  updateStateWithOrder
}