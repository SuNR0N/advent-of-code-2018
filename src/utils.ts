import { readFileSync } from 'fs';

export function readLines(path: string): string[] {
  return readFileSync(path, 'utf8')
    .split('\n');
}

export function printSolution(path: string, solution: string): void {
  const pathRegExp = /(?<day>[\w-]*)\/(?<part>[\w-]*)\.ts$/;
  const pathRegExpExec = pathRegExp.exec(path);
  const dayParts = pathRegExpExec!.groups!.day
    .split('-')
    .map(segmentMapper);
  const partParts = pathRegExpExec!.groups!.part
    .split('-')
    .map(segmentMapper);
  console.log(dayParts.join(' '), '>', partParts.join(' '), '-', solution);
}

function capitalize(word: string): string {
  return word[0]
    .toUpperCase()
    .concat(word.substring(1).toLowerCase());
}

function segmentMapper(segment: string): string {
  const num = parseInt(segment);
  return isNaN(num) ? capitalize(segment) : `#${num}`;
}