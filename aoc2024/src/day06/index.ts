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
type Start = {
  x: number;
  y: number;
  dir: Directions;
};

const parseInput: (rawInput: string) => { map: string[][], start: Start } = (rawInput) => {
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

const doTry = (map: string[][], start: Start) => {

  const visited = new Set<string>();
  const visitedFrom = new Set<string>();

  log("start:", start);
  log("map:");
  printMap(map, visited);

  let curr = {...start};
  let count = 0;
  let foundALoop = false;
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
          log('ending due to y overflow');
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
          log('FOUND A LOOP', cellKey);
          shouldEnd = true;
          foundALoop = true;
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
          log('ending due to x overflow');
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
          log('FOUND A LOOP', cellKey);
          shouldEnd = true;
          foundALoop = true;
          break;
        }

        visited.add(cellKey);
        visitedFrom.add(fromKey);
        curr.x = x;
        break;
      }
    }

    // log("\n");
    // printMap(map, visited);

    if (shouldEnd) {
      log('ending!');
      break;
    }

    if (++count > (onlyTests ? 60 : 6000)) {
      log('breaking early');
      break;
    }
  }

  log('visited?');
  log(JSON.stringify([...visited].map((cell) => cell.split('-').map((num) => parseInt(num)))));
  return {
    visited,
    visitedFrom,
    foundALoop,
    score: map.reduce((score, row, y) => {
      return score + row.reduce((score, cell, x) => {
        return score + (visited.has(key(x, y)) ? 1 : 0);
      }, 0);
    }, 0),
  };
}

const part1 = (rawInput: string) => {
  const { map, start } = parseInput(rawInput);

  const { score } = doTry(map, start);

  return score;
};

const part2 = (rawInput: string) => {
  const { map, start } = parseInput(rawInput);

  const { visited, score: origScore } = doTry(map, start);

  // Iterate over every visited to determine if placing an obstruction there yields a loop
  let idx = 0;
  let totalScore = 0;
  visited.forEach((key) => {
    // if (idx++ > 30) {
    //   return;
    // }
    const [x, y] = key.split('-').map((num) => parseInt(num));
    const modMap = map.map((row) => [...row]);
    modMap[y][x] = '#';

    const { score, visited, foundALoop } = doTry(modMap, start);

    log('\nattempted map due to:', x, y);
    // log('visited:', visited);
    printMap(modMap, visited);
    if (foundALoop) {
      totalScore += 1;
      log('that map yielded:', foundALoop, score);
    }

  });

  return totalScore;
};

run({
  part1: {
    tests: [
//       {
//         input: `....#.....
// .........#
// ..........
// ..#.......
// .......#..
// ..........
// .#..^.....
// ........#.
// #.........
// ......#...`,
//         expected: 41,
//       },
    ],
    solution: part1,
  },
  part2: {
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
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
