import run from "aocrunner";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";
// import { createPoint, createRobot, Direction, iterateOnRows, LogFunc, Robot } from "../utils/map.js";

const onlyTests = true;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

// const parseInput = (rawInput: string) => {
//   const map = rawInput.split("\n").map((row) => row.split(''));
//   const robot = createRobot(Direction.E);
//   const start = createPoint();
//   const end = createPoint();
//   map.forEach((row, y) => {
//     row.forEach((cell, x) => {
//       if (cell === 'S') {
//         start.x = x;
//         start.y = y;
//         map[y][x] = '.';

//         robot.x = x;
//         robot.y = y;
//       }
//       if (cell === 'E') {
//         end.x = x;
//         end.y = y;
//         map[y][x] = '.';
//       }
//     });
//   })
//   return { map, start, end, robot };
// }

// const printMap = (
//   map: string[][],
//   robot: Robot,
//   log: LogFunc,
//   path?: string[],
// ) => {
//   iterateOnRows(map, (row, y) => {
//     let visitedRow = "";
//     for (let x = 0; x < row.length; x++) {
//       // if (visited && visited.has(key(x, y))) {
//       //   visitedRow += "+";
//       if (robot.y === y && robot.x === x) {
//         visitedRow += '@';
//       } else {
//         visitedRow += row[x];
//       }
//     }
//     log(visitedRow);
//     return { break: false };
//   });
// };

type Node = {
  name: string;
  x: number;
  y: number;
  // costToEnter: number;
  edges: {
    to: string;
    // cost: number;
  }[];
};

type TheMap = Map<string, Node>;
const getName = (x: number, y: number) => `${x}-${y}`;
const getNodeByName = (map: TheMap, name: string) => {
  const node = map.get(name);
  if (!node) {
    throw new Error(`${name} Node not found`);
  }
  return node;
};
const getNode = (map: TheMap, x: number, y: number) => {
  const name = getName(x, y);
  return getNodeByName(map, name);
};

const parseInput = (rawInput: string) => {
  const map = new Map<string, Node>();
  let maxX = -1;
  let maxY = -1;
  let startX = -1;
  let startY = -1;
  let endX = -1;
  let endY = -1;
  rawInput.split("\n").forEach((row, y) => {
    if (y > maxY) maxY = y;
    row.split("").forEach((cell, x) => {
      if (x > maxX) maxX = x;
      if (cell === "S") {
        startX = x;
        startY = y;
      } else if (cell === "E") {
        endX = x;
        endY = y;
      }
      const name = getName(x, y);
      map.set(name, {
        name,
        x,
        y,
        // costToEnter: parseInt(cell),
        edges: [],
      });
    });
  });
  // Compute edges
  log("max x and y", maxX, maxY);
  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      // Set the available edges for this node
      const node = getNode(map, x, y);
      let dest;
      if (x > 0) {
        // dest = map.get(getName(x - 1, y));

        node.edges.push({
          to: getName(x - 1, y),
          // cost: dest!.costToEnter,
        });
      }
      if (x < maxX) {
        // dest = map.get(getName(x + 1, y));

        node.edges.push({
          to: getName(x + 1, y),
          // cost: dest!.costToEnter,
        });
      }
      if (y > 0) {
        dest = map.get(getName(x, y - 1));

        node.edges.push({
          to: getName(x, y - 1),
          // cost: dest!.costToEnter,
        });
      }
      if (y < maxY) {
        dest = map.get(getName(x, y + 1));

        node.edges.push({
          to: getName(x, y + 1),
          // cost: dest!.costToEnter,
        });
      }
    }
  }

  return {
    map,
    maxX,
    maxY,
    dest: getName(maxX, maxY),
  };
};

const directions = ["N", "E", "S", "W"];
type Direction = (typeof directions)[number];
const getNextPositions = (toDir: Direction, x: number, y: number) => {
  log("toDir:", toDir);
  if (toDir === "S") {
    return [
      {
        dir: "E",
        x: x + 1,
        y,
      },
      {
        dir: "W",
        x: x - 1,
        y,
      },
      {
        dir: "S",
        x,
        y: y + 1,
      },
    ];
  } else if (toDir === "W") {
    return [
      {
        dir: "N",
        x,
        y: y + 1,
      },
      {
        dir: "W",
        x: x - 1,
        y,
      },
      {
        dir: "S",
        x,
        y: y + 1,
      },
    ];
  } else if (toDir === "N") {
    return [
      {
        dir: "E",
        x: x + 1,
        y,
      },
      {
        dir: "W",
        x: x - 1,
        y,
      },
      {
        dir: "N",
        x,
        y: y - 1,
      },
    ];
  } else if (toDir === "E") {
    return [
      {
        dir: "E",
        x: x + 1,
        y,
      },
      {
        dir: "N",
        x,
        y: y - 1,
      },
      {
        dir: "S",
        x,
        y: y + 1,
      },
    ];
  } else {
    throw new Error("Invalid toDir? " + toDir);
  }
};

type Step = {
  x: number;
  y: number;
  toDir: Direction;
  cost: number;
  // stepsInDirection: number;
};
const key = (step: Step) => {
  return `${step.x},${step.y}via${step.toDir}@${step.stepsInDirection}`;
};

const bellmanFord = (rawInput: string) => {
  const { map, maxX, maxY, dest } = parseInput(rawInput);

  const startFromWest: Step = {
    x: 0,
    y: 0,
    toDir: "E",
    cost: 0,
    // stepsInDirection: 0,
  };
  // const startFromNorth: Step = {
  //   x: 0,
  //   y: 0,
  //   toDir: "S",
  //   cost: 0,
  //   // stepsInDirection: 0,
  // };

  const queue = new MinPriorityQueue<Step>((step) => step.cost);
  queue.enqueue(startFromWest);
  // queue.enqueue(startFromNorth);
  const visited = new Set<string>();
  visited.add(key(startFromWest));
  // visited.add(key(startFromNorth));

  while (queue.size()) {
    const step = queue.pop();
    const { x, y, toDir, cost /*, stepsInDirection*/ } = step;

    if (x === maxX && y === maxY) {
      // if (stepsInDirection < minSteps) continue;
      return step.cost;
    }

    const nextPositions = getNextPositions(toDir, x, y);
    log(nextPositions);
    for (const { dir, x: nx, y: ny } of nextPositions) {
      if (nx < 0 || nx > maxX || ny < 0 || ny > maxY) continue; // disregard invalid locations
      // if (toDir === dir && stepsInDirection + 1 > maxSteps) continue; // This would be more than three steps in that direction
      // if (toDir !== dir && stepsInDirection < minSteps) {
      //   log(
      //     "not traveled enough steps!",
      //     toDir,
      //     dir,
      //     stepsInDirection,
      //     minSteps,
      //   );
      //   continue;
      // }

      log(`considering going ${dir} from ${x},${y} to ${nx},${ny}`);

      const next: Step = {
        x: nx,
        y: ny,
        toDir: dir,
        cost: cost + map.get(getName(nx, ny))!.costToEnter,
        // stepsInDirection: toDir === dir ? stepsInDirection + 1 : 1,
      };
      const nkey = key(next);
      if (!visited.has(nkey)) {
        visited.add(nkey);
        queue.push(next);
      }
    }
  }
  return -1;
};

const part1 = (rawInput: string) => {
  return bellmanFord(rawInput);
  // const { map, start, end, robot } = parseInput(rawInput);
  // printMap(map, robot, log);
  // log(start);
  // log(end);
  // log(robot);

  // // Bellman Ford

  // return;
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
