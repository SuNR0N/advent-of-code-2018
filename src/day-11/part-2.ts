/*
--- Part Two ---
You discover a dial on the side of the device; it seems to let you select a square of any size, not just 3x3. Sizes from 1x1 to 300x300 are supported.

Realizing this, you now must find the square of any size with the largest total power. Identify this square by including its size as a third parameter after the top-left coordinate: a 9x9 square with a top-left corner of 3,5 is identified as 3,5,9.

For example:

For grid serial number 18, the largest total square (with a total power of 113) is 16x16 and has a top-left corner of 90,269, so its identifier is 90,269,16.
For grid serial number 42, the largest total square (with a total power of 119) is 12x12 and has a top-left corner of 232,251, so its identifier is 232,251,12.
What is the X,Y,size identifier of the square with the largest total power?

Your puzzle input is still 7403.
*/

import { printSolution } from '../utils';
import { calculatePowerLevel } from './common';

const gridSize = 300;
const serialNumber = 7403;

function calculateTotalPower(x: number, y: number, sn: number, maxX: number, maxY: number): number {
  let power = 0;
  for (let i = x; i < maxX; i++) {
    for (let j = y; j < maxY; j++) {
      power += calculatePowerLevel(i, j, sn);
    }
  }
  return power;
}

function calculateCellWithLargestTotalPower(size: number, sn: number): string {
  let square = '';
  let maxTotalPower = NaN;
  const powerMap: Map<string, number> = new Map();
  for (let d = 1; d <= 300; d++) {
    const dimension = size - d + 1;
    for (let x = 1; x <= dimension; x++) {
      for (let y = 1; y <= dimension; y++) {
        const previousDimPower = powerMap.get(`${x},${y},${d - 1}`);
        let totalPower: number;
        if (previousDimPower === undefined) {
          totalPower = calculateTotalPower(x, y, sn, x + d, y + d);
        } else {
          totalPower = previousDimPower +
            calculateTotalPower(x + d - 1, y, sn, x + d, y + d - 1) +
            calculateTotalPower(x, y + d - 1, sn, x + d, y + d);
        }
        powerMap.set(`${x},${y},${d}`, totalPower);
        if (isNaN(maxTotalPower) || maxTotalPower < totalPower) {
          maxTotalPower = totalPower;
          square = `${x},${y},${d}`;
        }
      }
    }
  }
  return square;
}

const solution = calculateCellWithLargestTotalPower(gridSize, serialNumber);
printSolution(__filename, `The coordinate and size of the top-left cell of the grid with the largest total power: ${solution}`);