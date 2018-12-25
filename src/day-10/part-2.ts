/*
--- Part Two ---
Good thing you didn't have to wait, because that would have taken a long time - much longer than the 3 seconds in the example above.

Impressed by your sub-hour communication capabilities, the Elves are curious: exactly how many seconds would they have needed to wait for that message to appear?
*/

import {
  printSolution,
  readLines,
} from '../utils';
import {
  createMap,
  findSmallestSky,
} from './common';

const lines = readLines(`${__dirname}/../../data/day-10.txt`);

function solve(lines: string[]): number {
  const map = createMap(lines);
  const { seconds } = findSmallestSky(map);
  return seconds;
}

const solution = solve(lines);
printSolution(__filename, `The message will appear after the following seconds: ${solution}`);