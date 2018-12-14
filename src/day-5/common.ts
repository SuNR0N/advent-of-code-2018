export function getCharMap(): Map<string, string> {
  return [
    ...Array(26).fill(65).map((v, i) => v + i),
    ...Array(26).fill(97).map((v, i) => v + i).reverse()
  ].reduce((m, n, i, arr) => {
    m.set(String.fromCharCode(n), String.fromCharCode(arr[arr.length - i - 1]));
    return m;
  }, new Map<string, string>())
}

export function reducePolymer(input: string, charMap: Map<string, string>): string {
  const length = input.length;
  for (let i = 1; i < length - 1; i++) {
    const currentOpposite = charMap.get(input[i]);
    if (input[i - 1] === currentOpposite) {
      return reducePolymer(input.replace(new RegExp(`${currentOpposite}${input[i]}`, 'g'), ''), charMap);
    } else if (input[i + 1] === currentOpposite) {
      return reducePolymer(input.replace(new RegExp(`${input[i]}${currentOpposite}`, 'g'), ''), charMap);
    }
  }
  return input;
}