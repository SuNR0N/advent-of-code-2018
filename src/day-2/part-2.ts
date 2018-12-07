/*
--- Part Two ---
Confident that your list of box IDs is complete, you're ready to find the boxes full of prototype fabric.

The boxes will have IDs which differ by exactly one character at the same position in both strings. For example, given the following box IDs:

abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz
The IDs abcde and axcye are close, but they differ by two characters (the second and fourth). However, the IDs fghij and fguij differ by exactly one character, the third (h and u). Those must be the correct boxes.

What letters are common between the two correct box IDs? (In the example above, this is found by removing the differing character from either ID, producing fgij.)
*/

import {
  printSolution,
  readLines,
} from '../utils';

const ids = readLines(`${__dirname}/input.txt`)

function findCommonLettersForId(id: string, ids: string[]): string | undefined {
  const index = ids.indexOf(id);
  if (index === -1) {
    return undefined;
  }
  const otherIds = ids.slice(0, index)
    .concat(ids.slice(index + 1));
  for (const otherId of otherIds) {
    const length = otherId.length;
    let diffIndex = -1;
    for (let i = 0; i < length; i++) {
      if (id[i] !== otherId[i]) {
        if (diffIndex !== -1) {
          diffIndex = -1;
          break;
        }
        diffIndex = i;
      }
    }
    if (diffIndex !== -1) {
      return id.substring(0, diffIndex)
        .concat(id.substring(diffIndex + 1));
    }
  }
}

function findCommonLetters(ids: string[]): string | undefined {
  let commonLetters: string | undefined;
  for (const id of ids) {
    commonLetters = findCommonLettersForId(id, ids);
    if (commonLetters) {
      break;
    }
  }
  return commonLetters;
}

const solution = findCommonLetters(ids);
printSolution(__filename, `Common letters between the 2 correct box IDs: ${solution}`);