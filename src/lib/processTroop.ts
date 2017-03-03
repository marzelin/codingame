import {
  IeventAtDay,
  Ifactories
} from './interfaces'
import {
  updateFactoryWithEvent
} from './updaters'

const processTroop = ( args: string[], initialFactories: Ifactories): Ifactories => {
  const [owner, , destinationFactoryId, size, day] = args.map(Number)
  const initialFactory = initialFactories[destinationFactoryId]
  const initialEvent = initialFactory.eventsAtDay[day]


  let finalEvent: IeventAtDay

  if (initialEvent) { // there are already events at this day
    const initialTroopSize = initialEvent.incomingTroopSize 

    if (initialTroopSize === undefined // no troops coming at that day (there must be bomb exploding)
    || initialTroopSize === 0) { // troops annihilated aech other, doesn't matter who is the owner, because factory cannot be captured with 0 cyborgs
        finalEvent = Object.assign<{}, IeventAtDay, Partial<IeventAtDay>>({}, initialEvent, {
          incomingTroopSize: size,
          troopOwner: owner
        })

    } else { // there are some troops coming at that day
      const initialTroopOwner = initialEvent.troopOwner
      if (initialTroopOwner === owner) {  // troops are allied
        const combinedTroopSize = initialTroopSize + size
        finalEvent = Object.assign<{}, IeventAtDay, Partial<IeventAtDay>>({}, initialEvent, {
          incomingTroopSize: combinedTroopSize
        })

      } else { // troops are hostile, let them fight
        const troopSizeAfterBattle = size - initialTroopSize

        if (troopSizeAfterBattle > 0) { // new troop won so change troop size and owner
          finalEvent = Object.assign<{}, IeventAtDay, Partial<IeventAtDay>>({}, initialEvent, {
            incomingTroopSize: troopSizeAfterBattle,
            troopOwner: owner
          })

        } else { // previous troop won, or troops killed each other in which case owner doesn't matter
          const remainingTroopSize = - troopSizeAfterBattle // the number of remaing troops is negative here so revert it
          finalEvent = Object.assign<{}, IeventAtDay, Partial<IeventAtDay>>({}, initialEvent, {
            incomingTroopSize: remainingTroopSize   
          })
        }
      }
             
    }
  } else { // there's no event at this day, put new event
    finalEvent = {
      day,
      incomingTroopSize: size,
      troopOwner: owner
    }
  }

  const finalFactoryState = updateFactoryWithEvent(finalEvent, initialFactory)
  const newFactories = {...initialFactories, [finalFactoryState.id]: finalFactoryState}

  return  newFactories
}

export {
  processTroop
}