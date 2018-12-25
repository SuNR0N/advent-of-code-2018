export interface Point {
  x: number;
  y: number;
}

interface Velocity {
  vx: number;
  vy: number;
}

export interface CoordinateSystem {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface Sky extends CoordinateSystem {
  points: Point[];
  seconds: number;
}

export function createMap(lines: string[]): Map<Point, Velocity> {
  const lineRegExp = /^position=<(\s*-?\d+),(\s*-?\d+)> velocity=<(\s*-?\d+),(\s*-?\d+)>$/;
  return lines.reduce((map, line) => {
    const [
      x,
      y,
      vx,
      vy,
    ] = lineRegExp.exec(line)!
      .slice(1)
      .map(Number);
    map.set({ x, y }, { vx, vy });
    return map;
  }, new Map<Point, Velocity>());
}

export function calculateMinMax(points: Point[]): CoordinateSystem {
  const coordinateSystem: CoordinateSystem = {
    maxX: NaN,
    maxY: NaN,
    minX: NaN,
    minY: NaN,
  };
  return points.reduce((system, point) => {
    if (isNaN(coordinateSystem.maxX) || point.x > coordinateSystem.maxX) {
      coordinateSystem.maxX = point.x;
    }
    if (isNaN(coordinateSystem.maxY) || point.y > coordinateSystem.maxY) {
      coordinateSystem.maxY = point.y;
    }
    if (isNaN(coordinateSystem.minX) || point.x < coordinateSystem.minX) {
      coordinateSystem.minX = point.x;
    }
    if (isNaN(coordinateSystem.minY) || point.y < coordinateSystem.minY) {
      coordinateSystem.minY = point.y;
    }
    return system;
  }, coordinateSystem);
}

export function findSmallestSky(map: Map<Point, Velocity>): Sky {
  let area: number = NaN;
  let seconds = 0;
  let points: Point[] = [];
  let system: CoordinateSystem;
  while (true) {
    const nextPoints: Point[] = Array.from(map.entries())
      .reduce((pts, point) => {
        const { x, y } = point[0];
        const { vx, vy } = point[1];
        const pt: Point = {
          x: x + vx * seconds,
          y: y + vy * seconds,
        };
        pts.push(pt);
        return pts;
      }, [] as Point[]);
    const nextSystem = calculateMinMax(nextPoints);
    const nextArea = (nextSystem.maxX - nextSystem.minX) * (nextSystem.maxY - nextSystem.minY);
    if (isNaN(area) || area > nextArea) {
      area = nextArea;
      points = nextPoints;
      system = nextSystem;
    } else {
      return {
        ...system!,
        points,
        seconds: seconds - 1,
      };
    }
    seconds++;
  }
}