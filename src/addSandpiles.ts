const addSandpiles = (sandpile1: number[][], sandpile2: number[][]) => 
  sandpile1
  .map(
    (row, rowIndex) => row.map(
      (val, cellIndex) => val + sandpile2[rowIndex][cellIndex]
    )
  )

export {
  addSandpiles
}