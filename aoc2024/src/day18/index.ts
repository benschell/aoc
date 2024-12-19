import run from "aocrunner";
import { key, printMap } from "../utils/map.js";

const onlyTests = false;
const bytes = onlyTests ? 12 : 1024;
const xLimit = onlyTests ? 7 : 71;
const yLimit = onlyTests ? 7 : 71;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((row) => row.split(",").map((num) => parseInt(num)));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  console.log('input?', input);
  const map: string[][] = [];
  for (let y = 0; y < yLimit; y++) {
    map[y] = [];
    for (let x = 0; x < xLimit; x++) {
      map[y][x] = '.';
    }
  }

  for (let byte = 0; byte < bytes; byte++) {
    // Add the given item to the map
    const [x, y] = input[byte];
    map[y][x] = '#';
  }
  printMap(map, log);

  // Find the lowest cost path from 0,0 to xLimit-1,yLimit-1
  // BellmanFord
  const distances = new Map<string, number>();
  const predecessor = new Map<string, string>();

  distances.set(key(0, 0), 0);

  for (let i=0; i < (xLimit - 1) * (yLimit - 1); i++) {
    log('iteration:', i);
    for (let y = 0; y < yLimit; y++) {
      for (let x = 0; x < xLimit; x++) {
        // Consider edges of x,y
        const curr = key(x, y);
        const currDistance = distances.get(curr);
        if (currDistance !== undefined) {
          log('curr:', curr, currDistance);
          if (x > 0 && map[y][x-1] !== '#') {
            const next = key(x-1, y);
            const nextDistance = distances.has(next) ? distances.get(next)! : Number.MAX_SAFE_INTEGER;
            log('considering', next, currDistance, nextDistance);
            if (currDistance + 1 < nextDistance) {
              log('setting (x-1):', next, currDistance + 1);
              distances.set(next, currDistance + 1);
              predecessor.set(next, curr);
            }
          }
          if (x < xLimit - 1 && map[y][x+1] !== '#') {
            const next = key(x+1, y);
            const nextDistance = distances.has(next) ? distances.get(next)! : Number.MAX_SAFE_INTEGER;
            log('considering', next, currDistance, nextDistance);
            if (currDistance + 1 < nextDistance) {
              log('setting (x+1):', next, currDistance + 1);
              distances.set(next, currDistance + 1);
              predecessor.set(next, curr);
            }
          }
          if (y > 0 && map[y-1][x] !== '#') {
            const next = key(x, y-1);
            const nextDistance = distances.has(next) ? distances.get(next)! : Number.MAX_SAFE_INTEGER;
            log('considering', next, currDistance, nextDistance);
            if (currDistance + 1 < nextDistance) {
              log('setting (y-1):', next, currDistance + 1);
              distances.set(next, currDistance + 1);
              predecessor.set(next, curr);
            }
          }
          if (y < yLimit - 1 && map[y+1][x] !== '#') {
            const next = key(x, y+1);
            const nextDistance = distances.has(next) ? distances.get(next)! : Number.MAX_SAFE_INTEGER;
            log('considering', next, currDistance, nextDistance);
            if (currDistance + 1 < nextDistance) {
              log('setting (y+1):', next, currDistance + 1);
              distances.set(next, currDistance + 1);
              predecessor.set(next, curr);
            }
          }
        }
      }
    }
    // if (i == 1) {
    //   break;
    // }
  }

  const path = new Set<string>();
  let k = key(xLimit-1, yLimit-1);
  while(k !== '0-0') {
    path.add(k);
    if (!predecessor.has(k)) {
      throw new Error('unknown predecessor for ' + k);
    }
    k = predecessor.get(k)!;
  }
  return path.size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
//     tests: [
//       {
//         input: `5,4
// 4,2
// 4,5
// 3,0
// 2,1
// 6,3
// 2,4
// 1,5
// 0,6
// 3,3
// 2,6
// 5,1
// 1,2
// 5,5
// 2,5
// 6,5
// 1,4
// 0,4
// 6,4
// 1,1
// 6,1
// 1,0
// 0,5
// 1,6
// 2,0`,
//         expected: 22,
//       },
//     ],
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
