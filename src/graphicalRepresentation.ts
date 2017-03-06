const graphicalRepresentation = (stacks: number[][]) => {
  const numberOfDisks = ([] as number[]).concat(...stacks).length
  return stacks
    .map(prependWithZerosIfLengthLessThan(numberOfDisks))
    .map((stack) =>
      stack
        .map(toHashes)
        .map(padRight(numberOfDisks + 1))
        .map(mirrorItToCreateLeftSideOfADisk)
    ).reduce(joinStackLevels)
    .map(trimRight)
}

const prependWithZerosIfLengthLessThan = (desiredNumberOfElements: number) => (array: number[]) => {
  while (array.length < desiredNumberOfElements) {
    array = [0].concat(array)
  }
  return array
}

const toHashes = (numberOfHashes: number) => {
  if (numberOfHashes === 0) {
    return '|'
  }
  return '#'.repeat(numberOfHashes + 1)
}

const padRight = (desiredLength: number) => (text: string) => text + ' '.repeat(desiredLength - text.length)

const mirrorItToCreateLeftSideOfADisk = (text: string) => text.slice(1).split('').reverse().join('') + text

const joinStackLevels = (levels: string[], parts: string[]) => levels.map( (level, i) => level + ' ' + parts[i] )

const trimRight = (text: string) => text.replace(/\s*$/, '')

export {
  graphicalRepresentation,
  joinStackLevels,
  mirrorItToCreateLeftSideOfADisk,
  padRight,
  prependWithZerosIfLengthLessThan,
  toHashes,
  trimRight
}