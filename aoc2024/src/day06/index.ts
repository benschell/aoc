import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

enum Directions {
  UP = "^",
  RIGHT = ">",
  DOWN = "v",
  LEFT = "<",
}

const parseInput = (rawInput: string) => {
  const map = rawInput.split("\n").map((row) => row.split(''));
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === "^") {
        row[x] = '.';
        return {
          map,
          start: {
            x,
            y,
            dir: Directions.UP,
          },
        };
      }
    }
  }
  throw new Error("Could not find valid start position");
};

const iterateOnRows = (
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

const iterateOnMap = (
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

const key = (x: number, y: number) => `${x}-${y}`;
const visitedKey = (x: number, y: number, fx: number, fy: number) => `${key(x,y)}via${fx}-${fy}}`;
const printMap = (map: string[][], visited: Set<string>) => {
  iterateOnRows(map, (row, y) => {
    let visitedRow = '';
    for (let x = 0; x < row.length; x++) {
      if (visited.has(key(x, y))) {
        visitedRow += 'X';
      } else {
        visitedRow += row[x];
      }
    }
    log(visitedRow);
    return { break: false };
  });
};

const part1 = (rawInput: string) => {
  const { map, start } = parseInput(rawInput);
  const visited = new Set<string>();
  const visitedFrom = new Set<string>();

  log("start:", start);
  log("map:");
  printMap(map, visited);

  let curr = start;
  let count = 0;
  while (true) {
    let shouldEnd = false;
    // Head in the current direction until we hit an obstacle
    if (curr.dir === Directions.UP || curr.dir === Directions.DOWN) {
      let y = curr.y;
      const x = curr.x;
      while(true) {
        if (curr.dir === Directions.UP) {
          y -= 1;
        } else {
          // Down
          y += 1;
        }
        if (y < 0 || y >= map.length) {
          shouldEnd = true;
          break;
        }
        if (map[y][x] !== '.') {
          // obstacle here! Stay at current position but change direction
          curr.dir = curr.dir === Directions.UP ? Directions.RIGHT : Directions.LEFT;
          break;
        }

        const cellKey = key(x, y);
        const fromKey = visitedKey(x, y, curr.x, curr.y);
        if (visitedFrom.has(fromKey)) {
          // We've visited this before from this direction
          shouldEnd = true;
          break;
        }

        visited.add(cellKey);
        visitedFrom.add(fromKey);
        curr.y = y;
        break;
      }
    } else if (curr.dir === Directions.RIGHT || curr.dir === Directions.LEFT) {
      const y = curr.y;
      let x = curr.x;
      while(true) {
        if (curr.dir === Directions.LEFT) {
          x -= 1;
        } else {
          // Right
          x += 1;
        }
        if (x < 0 || x >= map[y].length) {
          shouldEnd = true;
          break;
        }
        if (map[y][x] !== '.') {
          // obstacle here! Stay at current position but change direction
          curr.dir = curr.dir === Directions.LEFT ? Directions.UP : Directions.DOWN;
          break;
        }

        const cellKey = key(x, y);
        const fromKey = visitedKey(x, y, curr.x, curr.y);
        if (visitedFrom.has(fromKey)) {
          // We've visited this before from this direction
          shouldEnd = true;
          break;
        }

        visited.add(cellKey);
        visitedFrom.add(fromKey);
        curr.x = x;
        break;
      }
    }

    log("\n");
    printMap(map, visited);

    if (shouldEnd) {
      log('ending!');
      break;
    }

    if (++count > (onlyTests ? 60 : 6000)) {
      log('breaking early');
      break;
    }
  }

  return map.reduce((score, row, y) => {
    return score + row.reduce((score, cell, x) => {
      return score + (visited.has(key(x, y)) ? 1 : 0);
    }, 0);
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 41,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: ,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
