/*
--- Day 8: Memory Maneuver ---

The sleigh is much easier to pull than you'd expect for something its weight. Unfortunately, neither you nor the Elves know which way the North Pole is from here.

You check your wrist device for anything that might help. It seems to have some kind of navigation system! Activating the navigation system produces more bad news: "Failed to start navigation system. Could not read software license file."

The navigation system's license file consists of a list of numbers (your puzzle input). The numbers define a data structure which, when processed, produces some kind of tree that can be used to calculate the license number.

The tree is made up of nodes; a single, outermost node forms the tree's root, and it contains all other nodes in the tree (or contains nodes that contain nodes, and so on).

Specifically, a node consists of:

A header, which is always exactly two numbers:
The quantity of child nodes.
The quantity of metadata entries.
Zero or more child nodes (as specified in the header).
One or more metadata entries (as specified in the header).
Each child node is itself a node that has its own header, child nodes, and metadata. For example:

2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2
A----------------------------------
    B----------- C-----------
                     D-----
In this example, each node of the tree is also marked with an underline starting with a letter for easier identification. In it, there are four nodes:

A, which has 2 child nodes (B, C) and 3 metadata entries (1, 1, 2).
B, which has 0 child nodes and 3 metadata entries (10, 11, 12).
C, which has 1 child node (D) and 1 metadata entry (2).
D, which has 0 child nodes and 1 metadata entry (99).
The first check done on the license file is to simply add up all of the metadata entries. In this example, that sum is 1+1+2+10+11+12+2+99=138.

What is the sum of all metadata entries?
*/

import {
  printSolution,
  readLines,
} from '../utils';

// const numbers = readLines(`${__dirname}/../../data/day-8.txt`)[0]
//   .split(' ')
//   .map(Number);
// 44
// const numbers = [2, 3, 0, 3, 10, 11, 12, 1, 1, 0, 1, 99, 2, 1, 1, 2]; // 138
//                                 M  M  M   M   M                           M  M  M         M    M  M  M  M  M
const numbers = [2, 3, 1, 3, 0, 2, 3, 7, 10, 11, 12, 1, 1, 2, 1, 1, 1, 0, 2, 3, 4, 10, 0, 1, 17, 99, 2, 1, 1, 2]; // 182
// const numbers = [2, 3, 1, 3, 0, 2, 5, 7, 10, 11, 12, 1, 1, 0, 1, 99, 2, 1, 1, 2]; // 150
// const numbers = [2, 3, 0, 3, 10, 11, 12, 1, 4, 0, 1, 99, 2, 2, 2, 2, 1, 1, 2]; // 144

function solve(input: number[], sum: number = 0): number {
  const [
    _childrenCount,
    metaCount,
    ...rest
  ] = input;
  const metaEntries = rest.slice(-metaCount);
  const restExcludingMetaEntries = rest.slice(0, -metaCount);
  sum += sumEntries(metaEntries);
  return processChildData(restExcludingMetaEntries, sum);
}

function sumEntries(entries: number[]): number {
  return entries.reduce((sum, n) => {
    sum += n;
    return sum;
  }, 0);
}

function processChildData(input: number[], sum: number, parentMetaCount: number[] = []): number {
  let [
    childrenCount,
    metaCount,
    ...rest
  ] = input;
  console.log(childrenCount, metaCount, rest);
  if (childrenCount === 0) {
    const leafMetaEntries = rest.slice(0, metaCount);
    rest = rest.slice(metaCount);
    sum += sumEntries(leafMetaEntries);
    let nextParentMetaCount = parentMetaCount.pop();
    while (nextParentMetaCount !== undefined) {
      const parentMetaEntries = rest.slice(0, nextParentMetaCount);
      rest = rest.slice(nextParentMetaCount);
      sum += sumEntries(parentMetaEntries);
      nextParentMetaCount = parentMetaCount.pop();
    }
    // if (parentMetaCount !== undefined) {
    //   const parentMetaEntries = rest.slice(0, parentMetaCount);
    //   rest = rest.slice(parentMetaCount);
    //   sum += sumEntries(parentMetaEntries);
    // }
    if (rest.length === 0) {
      return sum;
    }
  }
  return processChildData(rest, sum, [...parentMetaCount, metaCount]);
}

const solution = solve(numbers);
printSolution(__filename, `Sum of all metadata entries: ${solution}`);