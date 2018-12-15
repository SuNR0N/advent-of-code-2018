/*
--- Day 6: Chronal Coordinates ---

The device on your wrist beeps several times, and once again you feel like you're falling.

"Situation critical," the device announces. "Destination indeterminate. Chronal interference detected. Please specify new target coordinates."

The device then produces a list of coordinates (your puzzle input). Are they places it thinks are safe or dangerous? It recommends you check manual page 729. The Elves did not give you a manual.

If they're dangerous, maybe you can minimize the danger by finding the coordinate that gives the largest distance from the other points.

Using only the Manhattan distance, determine the area around each coordinate by counting the number of integer X,Y locations that are closest to that coordinate (and aren't tied in distance to any other coordinate).

Your goal is to find the size of the largest area that isn't infinite. For example, consider the following list of coordinates:

1, 1
1, 6
8, 3
3, 4
5, 5
8, 9
If we name these coordinates A through F, we can draw them on a grid, putting 0,0 at the top left:

..........
.A........
..........
........C.
...D......
.....E....
.B........
..........
..........
........F.
This view is partial - the actual grid extends infinitely in all directions. Using the Manhattan distance, each location's closest coordinate can be determined, shown here in lowercase:

aaaaa.cccc
aAaaa.cccc
aaaddecccc
aadddeccCc
..dDdeeccc
bb.deEeecc
bBb.eeee..
bbb.eeefff
bbb.eeffff
bbb.ffffFf
Locations shown as . are equally far from two or more coordinates, and so they don't count as being closest to any.

In this example, the areas of coordinates A, B, C, and F are infinite - while not shown here, their areas extend forever outside the visible grid. However, the areas of coordinates D and E are finite: D is closest to 9 locations, and E is closest to 17 (both including the coordinate's location itself). Therefore, in this example, the size of the largest area is 17.

What is the size of the largest area that isn't infinite?
*/

import {
  printSolution,
  readLines,
} from '../utils';
import { Point } from './common';

const coordinates: Point[] = readLines(`${__dirname}/../../data/day-6.txt`)
  .map((line) => {
    const [
      x,
      y,
    ] = line.split(',')
      .map((v) => v.trim())
      .map(Number);
    return { x, y };
  });

function calculateManhattanDistance(p1: Point, p2: Point): number {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function getBottomRightPoint(points: Point[]): Point {
  const x = Math.max(...points.map((p) => p.x));
  const y = Math.max(...points.map((p) => p.y));
  return { x, y };
}

function getFinitePoints(points: Point[]): Point[] {
  return points.filter((point, i, arr) => {
    const rest = [
      ...arr.slice(0, i),
      ...arr.slice(i + 1),
    ];
    return rest.some((pt) => pt.x < point.x && pt.y < point.y) &&
      rest.some((pt) => pt.x > point.x && pt.y < point.y) &&
      rest.some((pt) => pt.x < point.x && pt.y > point.y) &&
      rest.some((pt) => pt.x > point.x && pt.y > point.y);
  });
}

function getDistanceMap(points: Point[], calculateDistance: (p1: Point, p2: Point) => number): Map<string, string> {
  const bottomRightPoint = getBottomRightPoint(points);
  const map: Map<string, string> = new Map();
  for (let x = 0; x < bottomRightPoint.x; x++) {
    for (let y = 0; y < bottomRightPoint.y; y++) {
      const distanceMap = points.reduce((m, point) => {
        const distance = calculateDistance(point, { x, y });
        m.set(`${point.x},${point.y}`, distance);
        return m;
      }, new Map<string, number>());
      const minDistances = Array.from(distanceMap.entries())
        .sort(([idA, dA], [idB, dB]) => dA - dB)
        .slice(0, 2);
      const value = minDistances[0][1] === minDistances[1][1] ? '.' : minDistances[0][0];
      map.set(`${x},${y}`, value);
    }
  }
  return map;
}

function calculateLargestFiniteArea(distanceMap: Map<string, string>, finitePoints: Point[]): number {
  const finiteDistanceMap = Array.from(distanceMap.values())
    .filter((point) => finitePoints.some((finitePoint) => point === `${finitePoint.x},${finitePoint.y}`))
    .reduce((map, pointStr) => {
      const count = map.get(pointStr) || 0;
      map.set(pointStr, count + 1);
      return map;
    }, new Map<string, number>());
  return Array.from(finiteDistanceMap.values())
    .sort((a, b) => b - a)[0];
}

function solve(points: Point[]): number {
  const distanceMap = getDistanceMap(points, calculateManhattanDistance);
  const finitePoints = getFinitePoints(points);
  return calculateLargestFiniteArea(distanceMap, finitePoints);
}

const solution = solve(coordinates);
printSolution(__filename, `The size of the largest finite area: ${solution}`);