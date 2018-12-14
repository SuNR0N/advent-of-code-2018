/*
--- Part Two ---
Strategy 2: Of all guards, which guard is most frequently asleep on the same minute?

In the example above, Guard #99 spent minute 45 asleep more than any other guard or minute - three times in total. (In all other cases, any guard spent any minute asleep at most twice.)

What is the ID of the guard you chose multiplied by the minute you chose? (In the above example, the answer would be 99 * 45 = 4455.)
*/

import {
  printSolution,
  readLines,
} from '../utils';
import {
  findMostFrequentMinute,
  mapGuards,
} from './common';

const lines = readLines(`${__dirname}/../../data/day-4.txt`);

function findGuardWithCommonestMinute(map: Map<number, number[]>): [number, number] {
  return Array.from(map.entries())
    .map(([id, minutes]) => ({
      id,
      ...(findMostFrequentMinute(minutes)),
    }))
    .sort(({ occurrence: occurrenceA }, { occurrence: occurrenceB }) => occurrenceB - occurrenceA)
    .map((o) => [o.id, o.minute])
  [0] as [number, number];
}

function calculateMagicNumber(input: string[]): number {
  const guardMap = mapGuards(input);
  const [
    guardId,
    minute,
  ] = findGuardWithCommonestMinute(guardMap);
  return guardId * minute;
}

const solution = calculateMagicNumber(lines);
printSolution(__filename, `The magic number based on Strategy 2: ${solution}`);