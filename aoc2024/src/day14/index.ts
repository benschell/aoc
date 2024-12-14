import run from "aocrunner";
import { key, LogFunc } from "../utils/map.js";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

type Point = {
  x: number;
  y: number;
};
type Robot = {
  idx: number;
  curr: Point;
  velocity: Point;
};
const parseInput: (rawInput: string) => Robot[] = (rawInput) =>
  rawInput.split("\n").map((row, idx) => {
    const parts = row.split(" ");
    const startParts = parts[0]
      .split("=")[1]
      .split(",")
      .map((num) => parseInt(num));
    const curr = { x: startParts[0], y: startParts[1] };
    const velParts = parts[1]
      .split("=")[1]
      .split(",")
      .map((num) => parseInt(num));
    const velocity = { x: velParts[0], y: velParts[1] };
    return {
      idx,
      curr,
      velocity,
    };
  });

export const iterateOnRows = (
  map: Map<number, Robot>[][],
  rowFunc: (
    row: Map<number, Robot>[],
    idx: number,
  ) => { break: boolean; result?: unknown },
) => {
  for (let y = 0; y < map.length; y++) {
    const res = rowFunc(map[y], y);
    if (res.break) {
      return res.result;
    }
  }
};
export const printMap = (
  map: Map<number, Robot>[][],
  log: LogFunc,
  visited?: Set<string>,
) => {
  iterateOnRows(map, (row, y) => {
    let visitedRow = "";
    for (let x = 0; x < row.length; x++) {
      if (visited && visited.has(key(x, y))) {
        visitedRow += ".";
      } else {
        visitedRow += row[x].size > 0 ? row[x].size : ".";
      }
    }
    log(visitedRow);
    return { break: false };
  });
};

const computeQuadrant: (
  map: Map<number, Robot>[][],
  xStart: number,
  xEnd: number,
  yStart: number,
  yEnd: number,
) => number = (map, xStart, xEnd, yStart, yEnd) => {
  log(`computing quadrant: x=${xStart}...${xEnd} y=${yStart}...${yEnd}`);
  let score = 0;
  for (let y = yStart; y <= yEnd; y++) {
    for (let x = xStart; x <= xEnd; x++) {
      score += map[y][x].size;
    }
  }
  return score;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const map: Map<number, Robot>[][] = [];
  const yLength = onlyTests ? 7 : 103;
  const xLength = onlyTests ? 11 : 101;
  for (let y = 0; y < yLength; y++) {
    map.push([]);
    for (let x = 0; x < xLength; x++) {
      map[y][x] = new Map();
    }
  }

  input.forEach((robot) => {
    const { x, y } = robot.curr;
    map[y][x].set(robot.idx, robot);
  });

  log(`\ninitial map`);
  printMap(map, log);
  const limit = 100;

  for (let sec = 0; sec < limit; sec += 1) {
    input.forEach((robot) => {
      const { idx, curr, velocity } = robot;
      const { x, y } = curr;
      // log(
      //   `\t moving ${idx} from ${x},${y} by ${velocity.x},${velocity.y}`,
      // );
      curr.x += velocity.x;
      curr.y += velocity.y;
      if (curr.x <= 0) {
        curr.x = xLength + curr.x;
      }
      if (curr.x >= xLength) {
        curr.x = curr.x - xLength;
      }
      if (curr.y <= 0) {
        curr.y = yLength + curr.y;
      }
      if (curr.y >= yLength) {
        curr.y = curr.y - yLength;
      }
      map[y][x].delete(idx);
      map[curr.y][curr.x].set(idx, robot);
      // log(`\t moved ${idx} to ${curr.x},${curr.y}`);
    });

    log(`\nmap after ${sec + 1} secs`);
    printMap(map, log);
  }

  // Compute the quadrants
  let score = 1;
  score *= computeQuadrant(map, 0, ((xLength - 1) / 2) - 1, 0, ((yLength -1) / 2) - 1);
  score *= computeQuadrant(map, ((xLength - 1) / 2) + 1, xLength - 1,0, ((yLength -1) / 2) - 1);
  score *= computeQuadrant(map, 0, ((xLength - 1) / 2) - 1, ((yLength -1) / 2) + 1, yLength - 1);
  score *= computeQuadrant(map, ((xLength - 1) / 2) + 1, xLength - 1, ((yLength -1) / 2) + 1, yLength - 1);

  return score;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`,
        expected: 12,
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
