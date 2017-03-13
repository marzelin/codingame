const printable = (sandpile: number[][]) =>
  sandpile
  .map( (row) => row.join(''))
  .join('\n')

export {
  printable
}