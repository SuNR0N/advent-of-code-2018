/*
--- Part Two ---
As it turns out, you got the Elves' plan backwards. They actually want to know how many recipes appear on the scoreboard to the left of the first recipes whose scores are the digits from your puzzle input.

51589 first appears after 9 recipes.
01245 first appears after 5 recipes.
92510 first appears after 18 recipes.
59414 first appears after 2018 recipes.
How many recipes appear on the scoreboard to the left of the score sequence in your puzzle input?

Your puzzle input is still 440231.
*/

import { printSolution } from '../utils';

import {
  Board,
  createRecipes,
} from './common';

const input = 440231;

function solve(input: string, board: Board): number {
  let postfix = board.recipes.slice((input.length + 1) * -1).join('');
  while (!(postfix.startsWith(input) || postfix.endsWith(input))) {
    board = createRecipes(board);
    postfix = board.recipes.slice((input.length + 1) * -1).join('');
  }
  return board.recipes.slice(0, -(postfix.length - (postfix.startsWith(input) ? 0 : 1))).length;
}

const solution = solve(`${input}`, { recipes: [3, 7], firstIndex: 0, secondIndex: 1 });
printSolution(__filename, `The number of recipes that appear to the left of the input: ${solution}`);