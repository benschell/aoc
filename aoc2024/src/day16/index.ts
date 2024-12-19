import run from "aocrunner";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";
import { createPoint, createRobot, Direction, iterateOnRows, key, LogFunc, Robot } from "../utils/map.js";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  const map = rawInput.split("\n").map((row) => row.split(''));
  const robot = createRobot(Direction.E);
  const start = createPoint();
  const end = createPoint();
  let maxX = -1;
  let maxY = -1;
  map.forEach((row, y) => {
    maxY = y > maxY ? y : maxY;
    row.forEach((cell, x) => {
      maxX = x > maxX ? x : maxX;
      if (cell === 'S') {
        start.x = x;
        start.y = y;
        map[y][x] = '.';

        robot.x = x;
        robot.y = y;
      }
      if (cell === 'E') {
        end.x = x;
        end.y = y;
        map[y][x] = '.';
      }
    });
  })
  return { map, start, end, maxX, maxY, robot };
}

const printMap = (
  map: string[][],
  robot: Robot,
  log: LogFunc,
  path?: string[],
) => {
  iterateOnRows(map, (row, y) => {
    let visitedRow = "";
    for (let x = 0; x < row.length; x++) {
      // if (visited && visited.has(key(x, y))) {
      //   visitedRow += "+";
      if (robot.y === y && robot.x === x) {
        visitedRow += '@';
      } else {
        visitedRow += row[x];
      }
    }
    log(visitedRow);
    return { break: false };
  });
};

type Step = {
  x: number;
  y: number;
  facing: Direction;
  cost: number;
  // stepsInDirection: number;
};

const part1 = (rawInput: string) => {
  const { map, start, end, robot, maxX, maxY } = parseInput(rawInput);
  printMap(map, robot, log);
  log(start);
  log(end);
  log(robot);

  // Dijkstras
  const queue = new MinPriorityQueue<Step>((step) => step.cost);
  const distances = new Map<string, number>();
  const predecessors = new Map<string, {key: string, cost: number}>();

  distances.set(key(start.x, start.y), 0);
  queue.enqueue({
    x: start.x,
    y: start.y,
    facing: Direction.E,
    cost: 0,
  });

  while (!queue.isEmpty()) {
    const step = queue.dequeue();
    const currKey = key(step.x, step.y);
    // For each neighbor
    const neighbors: Step[] = [];
    if (
      (step.facing === Direction.N || step.facing === Direction.S || step.facing === Direction.W) &&
      step.x > 0 &&
      map[step.y][step.x-1] !== '#'
    ) {
      // We can go left
      neighbors.push({
        x: step.x - 1,
        y: step.y, 
        facing: Direction.W,
        cost: step.facing === Direction.W ? 1 : 1001,
      });
    }
    if (
      (step.facing === Direction.N || step.facing === Direction.S || step.facing === Direction.E) &&
      step.x < maxX &&
      map[step.y][step.x+1] !== '#'
    ) {
      // We can go left
      neighbors.push({
        x: step.x + 1,
        y: step.y, 
        facing: Direction.E,
        cost: step.facing === Direction.E ? 1 : 1001,
      });
    }
    if (
      (step.facing === Direction.W || step.facing === Direction.E || step.facing === Direction.N) &&
      step.y > 0 &&
      map[step.y - 1][step.x] !== '#'
    ) {
      // We can go left
      neighbors.push({
        x: step.x,
        y: step.y - 1, 
        facing: Direction.N,
        cost: step.facing === Direction.N ? 1 : 1001,
      });
    }
    if (
      (step.facing === Direction.W || step.facing === Direction.E || step.facing === Direction.S) &&
      step.y < maxY &&
      map[step.y + 1][step.x] !== '#'
    ) {
      // We can go left
      neighbors.push({
        x: step.x,
        y: step.y + 1, 
        facing: Direction.S,
        cost: step.facing === Direction.S ? 1 : 1001,
      });
    }
    const currDistance = distances.get(currKey)!;
    neighbors.forEach((neighbor) => {
      const alt = currDistance + neighbor.cost;
      const nextKey = key(neighbor.x, neighbor.y);
      const nextDistance = distances.get(nextKey);
      if (
        nextDistance === undefined ||
        alt < nextDistance
      ) {
        predecessors.set(nextKey, { key: currKey, cost: neighbor.facing !== step.facing ? 1000 : 1});
        distances.set(nextKey, alt);
        queue.enqueue(neighbor);
      }
    });
  }
  let count = 0;
  let curr = key(end.x, end.y);
  log('distance?', distances.get(curr));
  return distances.get(curr);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`,
        expected: 7036,
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
