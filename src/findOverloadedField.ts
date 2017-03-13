const findOverloadedField = (sandpile: number[][]) => {
  for (let rowIndex = 0, len = sandpile.length; rowIndex < len; rowIndex++) {
    for (let cellIndex = 0; cellIndex < len; cellIndex++) {
      if (sandpile[rowIndex][cellIndex] > 3) {
        return [rowIndex, cellIndex]
      }
    }
  }
  return null
}

export {
  findOverloadedField
}