/**
 * reads a line from an input
 * 
 * @returns {string} 
 */
declare function readline(): string

/**
 * prints given arg to the output
 * 
 * @param {(string | number)} output 
 */
declare function print(output: string | number): void

/**
 * prints debugging messages
 * 
 * @param {*} output 
 */
declare function printErr(output: any): void

/** when compililing by webpack
 *  this variable is set to true to allow execution on codingame
 *  but not to run when testing */
declare const isRunAtCodingame: boolean