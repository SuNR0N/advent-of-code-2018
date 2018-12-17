export interface Node {
  value: string;
  children: Node[];
  parents: Node[];
}

export function buildGraph(lines: string[]): Node[] {
  const lineRegExp = /^Step ([A-Z]) must be finished before step ([A-Z]) can begin.$/;
  const map = lines.reduce((m, line) => {
    const lineRegExpExec = lineRegExp.exec(line)!;
    const [
      _line,
      value,
      child,
    ] = lineRegExpExec;
    const node = m.get(value) || { value, children: [], parents: [] };
    const childNode = m.get(child) || { value: child, children: [], parents: [] };
    node.children.push(childNode);
    childNode.parents.push(node);
    m.set(child, childNode);
    m.set(value, node);

    return m;
  }, new Map<string, Node>());
  return Array.from(map.entries())
    .reduce((roots, [_key, node]) => {
      if (node.parents.length === 0) {
        roots.push(node);
      }
      return roots;
    }, [] as Node[]);
}

export function parentCompleted(existingSteps: string) {
  return (node: Node) => existingSteps.includes(node.value);
}

export function uniqueChild(nodes: Node[]) {
  return (node: Node) => !nodes.includes(node);
}

export function sortByValue(a: Node, b: Node): number {
  if (a.value < b.value) {
    return -1;
  } else if (a.value > b.value) {
    return 1;
  } else {
    return 0;
  }
}