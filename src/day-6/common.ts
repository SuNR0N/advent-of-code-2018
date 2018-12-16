export interface Point {
  x: number;
  y: number;
}

export function calculateManhattanDistance(p1: Point, p2: Point): number {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

export function getBottomRightPoint(points: Point[]): Point {
  const x = Math.max(...points.map((p) => p.x));
  const y = Math.max(...points.map((p) => p.y));
  return { x, y };
}

export function mapLineToPoint(line: string): Point {
  const [
    x,
    y,
  ] = line.split(',')
    .map((v) => v.trim())
    .map(Number);
  return { x, y };
}