/*
--- Part Two ---

As you're about to begin construction, four of the Elves offer to help. "The sun will set soon; it'll go faster if we work together." Now, you need to account for multiple people working on steps simultaneously. If multiple steps are available, workers should still begin them in alphabetical order.

Each step takes 60 seconds plus an amount corresponding to its letter: A=1, B=2, C=3, and so on. So, step A takes 60+1=61 seconds, while step Z takes 60+26=86 seconds. No time is required between steps.

To simplify things for the example, however, suppose you only have help from one Elf (a total of two workers) and that each step takes 60 fewer seconds (so that step A takes 1 second and step Z takes 26 seconds). Then, using the same instructions as above, this is how each second would be spent:

Second   Worker 1   Worker 2   Done
   0        C          .
   1        C          .
   2        C          .
   3        A          F       C
   4        B          F       CA
   5        B          F       CA
   6        D          F       CAB
   7        D          F       CAB
   8        D          F       CAB
   9        D          .       CABF
  10        E          .       CABFD
  11        E          .       CABFD
  12        E          .       CABFD
  13        E          .       CABFD
  14        E          .       CABFD
  15        .          .       CABFDE
Each row represents one second of time. The Second column identifies how many seconds have passed as of the beginning of that second. Each worker column shows the step that worker is currently doing (or . if they are idle). The Done column shows completed steps.

Note that the order of the steps has changed; this is because steps now take time to finish and multiple workers can begin multiple steps simultaneously.

In this example, it would take 15 seconds for two workers to complete these steps.

With 5 workers and the 60+ second step durations described above, how long will it take to complete all of the steps?
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

const workers = 5;
const stepDuration = 60;

interface Step {
  value: string;
  seconds: number;
  dependencies: string[];
}

function calculateStepsDuration(steps: Step[], workers: number): number {
  const workerThreads: Array<Step | undefined> = Array(workers).fill(undefined);
  let seconds = 0;
  while (steps.length > 0) {
    assignStepsToIdleWorkers(steps, workerThreads);
    const elapsedSeconds = calculateSecondsUntilWorkerReleased(workerThreads);
    const finishedSteps = progressWorkers(workerThreads, elapsedSeconds);
    markFinishedDependencies(steps, finishedSteps);
    seconds += elapsedSeconds;
  }
  return seconds;
}

function markFinishedDependencies(steps: Step[], finishedSteps: Step[]): void {
  const completedDependencies = finishedSteps.map((finishedStep) => finishedStep.value);
  for (const step of steps) {
    completedDependencies.forEach((dependency) => {
      const index = step.dependencies.indexOf(dependency);
      if (index > -1) {
        step.dependencies.splice(index, 1);
      }
    });
  }
}

function assignStepsToIdleWorkers(steps: Step[], workerThreads: Array<Step | undefined>): void {
  const stepsWithNoDependencies = steps.filter((step) => step.dependencies.length === 0);
  for (const step of stepsWithNoDependencies) {
    const nextIdleThreadIndex = workerThreads.findIndex((thread) => thread === undefined);
    if (nextIdleThreadIndex === -1) {
      break;
    }
    workerThreads[nextIdleThreadIndex] = step;
    steps.splice(steps.indexOf(step), 1);
  }
}

function calculateSecondsUntilWorkerReleased(workerThreads: Array<Step | undefined>): number {
  return workerThreads.reduce((min, thread) => {
    if (thread) {
      if (isNaN(min) || thread.seconds < min) {
        min = thread.seconds;
      }
    }
    return min;
  }, NaN);
}

function progressWorkers(workerThreads: Array<Step | undefined>, elapsedSeconds: number): Step[] {
  const finishedSteps: Step[] = [];
  workerThreads.forEach((thread, i, arr) => {
    if (thread) {
      thread.seconds -= elapsedSeconds;
      if (thread.seconds === 0) {
        finishedSteps.push(thread);
        arr[i] = undefined;
      }
    }
  });
  return finishedSteps;
}

function calculateStepDuration(step: string, base: number): number {
  return step.charCodeAt(0) - 64 + base;
}

function solve(lines: string[], workers: number, stepDuration: number): number {
  const roots = buildGraph(lines);
  const steps = resolveSteps(roots, stepDuration);
  return calculateStepsDuration(steps, workers);
}

function resolveSteps(roots: Node[], stepDuration: number): Step[] {
  const steps: Step[] = [];
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
        steps.push({
          dependencies: next.parents.map((parent) => parent.value),
          seconds: calculateStepDuration(next.value, stepDuration),
          value: next.value,
        });
        break;
      }
    }
  }
  return steps;
}

const solution = solve(instructions, workers, stepDuration);
printSolution(__filename, `Instructions will take the following amount of seconds to complete: ${solution}`);