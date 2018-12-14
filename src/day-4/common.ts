export function mapGuards(lines: string[]): Map<number, number[]> {
  const lineRegExp = /^\[(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2})\]\s(wakes up|falls asleep|Guard #(\d{1,}) begins shift)$/;
  const initialObject = {
    currentGuard: NaN,
    map: new Map<number, number[]>(),
  };
  return lines
    .sort((a, b) => {
      const execA = lineRegExp.exec(a)!;
      const execB = lineRegExp.exec(b)!;
      const timestampA = Date.parse(execA[1]);
      const timestampB = Date.parse(execB[1]);
      return timestampA - timestampB;
    })
    .reduce((o, line, i, arr) => {
      const lineRegExpExec = lineRegExp.exec(line)!;
      const [
        _line,
        _time,
        action,
        guardId,
      ] = lineRegExpExec;
      if (guardId) {
        o.currentGuard = parseInt(guardId);
      }
      if (action === 'falls asleep') {
        const startTS = Date.parse(lineRegExpExec[1]);
        const nextLineRegExpExec = lineRegExp.exec(arr[i + 1])!;
        const endTS = Date.parse(nextLineRegExpExec[1]);
        const minutes: number[] = [];
        for (let i = startTS; i < endTS; i += 60000) {
          const mins = new Date(i).getMinutes();
          minutes.push(mins);
        }
        const currentGuardMinutes = o.map.get(o.currentGuard) || [];
        o.map.set(o.currentGuard, [
          ...currentGuardMinutes,
          ...minutes,
        ]);
      }
      return o;
    }, initialObject)
    .map;
}

export function findMostFrequentMinute(numbers: number[]): { minute: number, occurrence: number } {
  const occurrences = new Map<number, number>();
  const initialObject = {
    minute: NaN,
    occurrence: 0,
  };
  return numbers.reduce((o, n) => {
    if (isNaN(o.minute)) {
      occurrences.set(n, 1);
      o.minute = n;
      o.occurrence = 1;
    } else {
      const previousOccurrence = occurrences.get(n) || 0;
      const currentOccurrence = previousOccurrence + 1;
      occurrences.set(n, currentOccurrence);
      if (currentOccurrence > o.occurrence) {
        o.minute = n;
        o.occurrence = currentOccurrence;
      }
    }
    return o;
  }, initialObject);
}