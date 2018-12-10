/*
--- Part Two ---
Amidst the chaos, you notice that exactly one claim doesn't overlap by even a single square inch of fabric with any other claim. If you can somehow draw attention to it, maybe the Elves will be able to make Santa's suit after all!

For example, in the claims above, only claim 3 is intact after all claims are made.

What is the ID of the only claim that doesn't overlap?
*/

import {
  printSolution,
  readLines,
} from '../utils';

const claims = readLines(`${__dirname}/../../data/day-3.txt`);

function checkClaim(claim: string, coverage: Map<string, Set<number>>, unique: Set<number>): void {
  const claimRegExp = /^#(\d*)\s@\s(\d*),(\d*):\s(\d*)x(\d*)$/;
  const claimRegExpExec = claimRegExp.exec(claim);
  const id = parseInt(claimRegExpExec![1], 10);
  const x = parseInt(claimRegExpExec![2], 10);
  const y = parseInt(claimRegExpExec![3], 10);
  const width = parseInt(claimRegExpExec![4], 10);
  const height = parseInt(claimRegExpExec![5], 10);
  const endX = x + width;
  const endY = y + height;
  let overlap = false;
  for (let r = x; r < endX; r++) {
    for (let c = y; c < endY; c++) {
      const coordinate = `${r},${c}`;
      const ids = coverage.get(coordinate) || new Set<number>();
      if (ids.size > 0) {
        overlap = true;
        ids.forEach((existingId) => unique.delete(existingId));
      }
      ids.add(id);
      coverage.set(coordinate, ids);
    }
  }
  if (!overlap) {
    unique.add(id);
  }
}

function getClaimId(claims: string[]): number {
  const unique: Set<number> = new Set();
  const coverage: Map<string, Set<number>> = new Map();
  claims.forEach((claim) => checkClaim(claim, coverage, unique));
  return Array.from(unique.values())[0];
}

const solution = getClaimId(claims);
printSolution(__filename, `ID of claim that does not overlap: ${solution}`);