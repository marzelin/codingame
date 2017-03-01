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

/** global variable `module` is checked
 *  to see in what environment the script is executed */
declare const module: any