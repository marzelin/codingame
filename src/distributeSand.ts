

const pureDistributeSand = (neighborsRelativePositions: number[][]) => (fromPosition: number[], sandpile: number[][]) => (
  // remove 4 grains
  sandpile[fromPosition[0]][fromPosition[1]] -= 4,
  // pass grains to neighbors
  neighborsRelativePositions
  .map(add(fromPosition))
  .reduce(
    (sandpile, neighborPosition) => {
      if (isWithinBoard(neighborPosition, sandpile.length)) {
        sandpile[neighborPosition[0]][neighborPosition[1]] += 1 
      }
      return sandpile
    }
    , sandpile)
)

const neighborsRelativePositions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1]
]

const add = (originalPosition: number[]) => (relativePosition: number[]) =>  [
  originalPosition[0] + relativePosition[0],
  originalPosition[1] + relativePosition[1]
]

const isWithinBoard = (position: number[], size: number) =>
  position.every(
    (dimension) => dimension >= 0 && dimension < size
  )

const distributeSand = pureDistributeSand(neighborsRelativePositions)

export {
  distributeSand
}