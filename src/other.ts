const initialStacksState = (numberOfDisks: number) => [
  allDisks(numberOfDisks),
  [],
  []
]

const allDisks = (numberOfDisks: number) => {
  const stack = []
  for (let i = 1; i <= numberOfDisks; i++) {
    stack.push(i)
  }
  return stack
}

const gameIsNotFinished = (stacks: number[][]) => stacks[0].length !== 0 || stacks[1].length !== 0

export {
  initialStacksState,
  allDisks,
  gameIsNotFinished
}