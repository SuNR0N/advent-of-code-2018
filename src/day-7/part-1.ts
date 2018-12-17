/*
--- Day 7: The Sum of Its Parts ---

You find yourself standing on a snow-covered coastline; apparently, you landed a little off course. The region is too hilly to see the North Pole from here, but you do spot some Elves that seem to be trying to unpack something that washed ashore. It's quite cold out, so you decide to risk creating a paradox by asking them for directions.

"Oh, are you the search party?" Somehow, you can understand whatever Elves from the year 1018 speak; you assume it's Ancient Nordic Elvish. Could the device on your wrist also be a translator? "Those clothes don't look very warm; take this." They hand you a heavy coat.

"We do need to find our way back to the North Pole, but we have higher priorities at the moment. You see, believe it or not, this box contains something that will solve all of Santa's transportation problems - at least, that's what it looks like from the pictures in the instructions." It doesn't seem like they can read whatever language it's in, but you can: "Sleigh kit. Some assembly required."

"'Sleigh'? What a wonderful name! You must help us assemble this 'sleigh' at once!" They start excitedly pulling more parts out of the box.

The instructions specify a series of steps and requirements about which steps must be finished before others can begin (your puzzle input). Each step is designated by a single letter. For example, suppose you have the following instructions:

Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.
Visually, these requirements look like this:


  -->A--->B--
 /    \      \
C      -->D----->E
 \           /
  ---->F-----
Your first goal is to determine the order in which the steps should be completed. If more than one step is ready, choose the step which is first alphabetically. In this example, the steps would be completed as follows:

Only C is available, and so it is done first.
Next, both A and F are available. A is first alphabetically, so it is done next.
Then, even though F was available earlier, steps B and D are now also available, and B is the first alphabetically of the three.
After that, only D and F are available. E is not available because only some of its prerequisites are complete. Therefore, D is completed next.
F is the only choice, so it is done next.
Finally, E is completed.
So, in this example, the correct order is CABDFE.

In what order should the steps in your instructions be completed?
*/

import {
  printSolution,
  readLines,
} from '../utils';
import {
  buildGraph,
  Node,
  parentCompleted,
  sortByValue,
  uniqueChild,
} from './common';

const instructions = readLines(`${__dirname}/../../data/day-7.txt`);

function resolveSteps(roots: Node[]): string {
  let str = '';
  const availables: Node[] = roots.sort(sortByValue);
  while (availables.length > 0) {
    const len = availables.length;
    for (let i = 0; i < len; i++) {
      if (availables[i].parents.every(parentCompleted(str))) {
        const next = availables.splice(i, 1)[0];
        const uniqueChildren = next.children.filter(uniqueChild(availables));
        availables.push(...uniqueChildren);
        availables.sort(sortByValue);
        str += next.value;
        break;
      }
    }
  }
  return str;
}

function solve(lines: string[]): string {
  const roots = buildGraph(lines);
  return resolveSteps(roots);
}

const solution = solve(instructions);
printSolution(__filename, `Instructions should be completed in the following order: ${solution}`);