const createSandpile = (lines: string[]) =>
  lines
  .map(
    (line) => line
      .split('')
      .map(Number)
  )

export {
  createSandpile
}