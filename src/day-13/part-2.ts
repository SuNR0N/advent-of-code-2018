/*
--- Part Two ---
There isn't much you can do to prevent crashes in this ridiculous system. However, by predicting the crashes, the Elves know where to be in advance and instantly remove the two crashing carts the moment any crash occurs.

They can proceed like this for a while, but eventually, they're going to run out of carts. It could be useful to figure out where the last cart that hasn't crashed will end up.

For example:

/>-<\  
|   |  
| /<+-\
| | | v
\>+</ |
  |   ^
  \<->/

/---\  
|   |  
| v-+-\
| | | |
\-+-/ |
  |   |
  ^---^

/---\  
|   |  
| /-+-\
| v | |
\-+-/ |
  ^   ^
  \---/

/---\  
|   |  
| /-+-\
| | | |
\-+-/ ^
  |   |
  \---/
After four very expensive crashes, a tick ends with only one cart remaining; its final location is 6,4.

What is the location of the last cart at the end of the first tick where it is the only cart left?
*/

import {
  printSolution,
  readLines,
} from '../utils';

const track = readLines(`${__dirname}/../../data/day-13.txt`)
  .map((line) => line.split(''));

import {
  Cart,
  getInitialCartPositions,
  getNextTile,
  moveCart,
  updateCartOrder,
} from './common';

function solve(track: string[][]): string {
  const carts = getInitialCartPositions(track);
  while (carts.length > 1) {
    tick(carts, track);
    updateCartOrder(carts);
  }
  return `${carts[0].y},${carts[0].x}`;
}

function tick(carts: Cart[], track: string[][]): void {
  for (const cart of carts) {
    const nextTile = getNextTile(cart, track);
    moveCart(cart, nextTile, track);
    if (cart.cartSymbol === 'X') {
      markOtherCrashedCart(cart, carts);
    }
  }
  removeCrashedCarts(carts, track);
}

function markOtherCrashedCart(cart: Cart, carts: Cart[]) {
  carts.forEach((c) => {
    if (c.x === cart.x && c.y === cart.y) {
      c.cartSymbol = 'X';
      cart.trackSymbol = c.trackSymbol;
    }
  });
}

function removeCrashedCarts(carts: Cart[], track: string[][]): void {
  const crashedIndices = carts.reduce((indices, cart, index) => {
    if (cart.cartSymbol === 'X') {
      indices.push(index);
    }
    return indices;
  }, [] as number[])
    .sort((a, b) => b - a);
  crashedIndices.forEach((index) => {
    const { x, y, trackSymbol } = carts[index];
    track[x][y] = trackSymbol;
    carts.splice(index, 1);
  });
}

const solution = solve(track);
printSolution(__filename, `The location of the last cart: ${solution}`);