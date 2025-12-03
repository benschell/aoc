import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  const map = rawInput.split("\n").map((row) => row.split(""));
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === "S") {
        row[x] = '.';
        return {
          map,
          start: {
            x,
            y,
          },
        };
      }
    }
  }
  throw new Error("No starting position found");
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
const visitedKey = (x: number, y: number, fx: number, fy: number) =>
  `${key(x, y)}via${fx}-${fy}}`;
const printMap = (map: string[][], visited: Set<string>) => {
  iterateOnRows(map, (row, y) => {
    let visitedRow = "";
    for (let x = 0; x < row.length; x++) {
      if (visited.has(key(x, y))) {
        visitedRow += "X";
      } else {
        visitedRow += row[x];
      }
    }
    log(visitedRow);
    return { break: false };
  });
};

const part1 = (rawInput: string) => {
  const maxSteps = 64;
  const { map, start } = parseInput(rawInput);
  log(start);

  let positions = new Set<string>();
  positions.add(key(start.x, start.y));
  const visited = new Set<string>();

  let steps = 0;
  while (true) {
    let numGrown = 0;
    if (positions.size === 0) {
      break;
    }
    log("steps", steps, "positions", positions);
    const newPositions = new Set<string>();
    for (const posStr of positions) {
      const posParts = posStr.split("-");
      const pos = { x: parseInt(posParts[0]), y: parseInt(posParts[1]) };
      visited.add(key(pos.x, pos.y));
      // Consider left
      if (
        pos.x > 0 &&
        map[pos.y][pos.x - 1] === "." //&&
        // !visited.has(key(pos.x - 1, pos.y))
      ) {
        newPositions.add(key(pos.x - 1, pos.y));
      }
      // Consider right
      if (
        pos.x + 1 < map[pos.y].length &&
        map[pos.y][pos.x + 1] === "." //&&
        // !visited.has(key(pos.x + 1, pos.y))
      ) {
        newPositions.add(key(pos.x + 1, pos.y));
      }
      // Consider up
      if (
        pos.y > 0 &&
        map[pos.y - 1][pos.x] === "." // &&
        // !visited.has(key(pos.x, pos.y - 1))
      ) {
        newPositions.add(key(pos.x, pos.y - 1));
      }
      // Consider right
      if (
        pos.y + 1 < map.length &&
        map[pos.y + 1][pos.x] === "." //&&
        // !visited.has(key(pos.x, pos.y + 1))
      ) {
        newPositions.add(key(pos.x, pos.y + 1));
      }
    }
    positions = newPositions;
    steps += 1;
    if (steps >= maxSteps) break;
  }

  // printMap(map, new Set(positions.map((cell) => key(cell.x, cell.y))));

  return positions.size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`,
        expected: 16,
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
