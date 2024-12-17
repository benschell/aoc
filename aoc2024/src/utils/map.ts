export type LogFunc = (...args: any[]) => void;

export type Point = {
  x: number;
  y: number;
};
export const createPoint: () => Point = () => ({ x: -1, y: -1 });
export enum Direction {
  N = "N",
  E = "E",
  S = "S",
  W = "W",
}
export type Robot = Point & {
  facing: Direction;
};
export const createRobot: (direction: Direction) => Robot = (facing) => ({
  x: -1,
  y: -1,
  facing,
});

export const iterateOnRows = (
  map: string[][],
  rowFunc: (row: string[], idx: number) => { break: boolean; result?: unknown },
) => {
  for (let y = 0; y < map.length; y++) {
    const res = rowFunc(map[y], y);
    if (res.break) {
      return res.result;
    }
  }
};

export const iterateOnMap = (
  map: string[][],
  func: (cell: string) => { break: boolean; result?: unknown },
) => {
  iterateOnRows(map, (row) => {
    for (let x = 0; x < row.length; x++) {
      const res = func(row[x]);
      if (res.break) {
        return res;
      }
    }
    return { break: false };
  });
};

export const key = (x: number, y: number) => `${x}-${y}`;
export const coordFromKey = (key: string) =>
  key
    .split("-")
    .map((num) => parseInt(num))
    .reduce<{ x: number; y: number }>(
      (out, num, idx) => {
        out[idx === 0 ? "x" : "y"] = num;
        return out;
      },
      { x: -1, y: -1 },
    );
export const fromKey = (x: number, y: number, fx: number, fy: number) =>
  `${key(x, y)}via${fx}-${fy}}`;
export const printMap = (
  map: string[][],
  log: LogFunc,
  visited?: Set<string>,
) => {
  iterateOnRows(map, (row, y) => {
    let visitedRow = "";
    for (let x = 0; x < row.length; x++) {
      if (visited && visited.has(key(x, y))) {
        visitedRow += "+";
      } else {
        visitedRow += row[x];
      }
    }
    log(visitedRow);
    return { break: false };
  });
};
