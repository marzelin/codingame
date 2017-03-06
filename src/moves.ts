import {
  isOddNumber
} from './utilities'

const NUMBEROFSTACKS = 3

const moveSmallestDisk = (stacks: number[][]) => {
  const stackIndexWhereSmallestDiskIs = getIndexStackWhereSmallestDiskIs(stacks)
  const directionOfMove = findDirection(stacks)
  const stackIndexToMoveSmallest = getToMoveIndex(stackIndexWhereSmallestDiskIs, directionOfMove)
  return moveDisk(stackIndexWhereSmallestDiskIs, stackIndexToMoveSmallest, stacks)
}

const getIndexStackWhereSmallestDiskIs = (stacks: number[][]) => {
  for (let i = 0; i < 3; i++) {
    if (stacks[i][0] === 1) {
      return i
    }
  }
  throw new Error('stack where the smallest disk is was not found')
}

const findDirection = (stacks: number[][]) => {
  const numberOfDisks = ([] as number[]).concat(...stacks).length
  const direction = isOddNumber(numberOfDisks)
    ? Direction.left
    : Direction.right 
  return direction
}

const getToMoveIndex = (stackIndexWhereSmallestIs: number, direction: Direction) =>
  (NUMBEROFSTACKS + stackIndexWhereSmallestIs + direction) % NUMBEROFSTACKS

enum Direction {
  left = -1,
  right = 1
}

const moveOtherDisk = (stacks: number[][]) => {
  let [stackIndexOfSecondSmallestTopDisk, stackIndexOfLargestTopDisk] = getOtherStacksIndexes(stacks)
  return moveDisk(stackIndexOfSecondSmallestTopDisk, stackIndexOfLargestTopDisk, stacks)
}

const getOtherStacksIndexes = (stacks: number[][]) => {
  return stacks
    .map( (stack, index) => ({topDisk: stack[0] || Infinity, index}))
    .filter( ({topDisk}) => topDisk !== 1)
    .sort( (stack1, stack2) => stack1.topDisk - stack2.topDisk )
    .map( ({index}) => index)
}

const moveDisk = (fromIndex: number, toIndex: number, stacks: number[][]) => {
  const newStacks = [...stacks]
  newStacks[fromIndex] = stacks[fromIndex].slice(1)
  newStacks[toIndex] = [stacks[fromIndex][0]].concat(stacks[toIndex])
  return newStacks
}

export {
  moveSmallestDisk,
  moveOtherDisk,

  // internals 
  getToMoveIndex,
  getOtherStacksIndexes,
  findDirection,
  getIndexStackWhereSmallestDiskIs,
  moveDisk
}