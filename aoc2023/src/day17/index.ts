import run from "aocrunner";
import {
  MinPriorityQueue,
} from "@datastructures-js/priority-queue";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

type Node = {
  name: string;
  x: number;
  y: number;
  costToEnter: number;
  edges: {
    to: string;
    cost: number;
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
  rawInput.split("\n").forEach((row, y) => {
    if (y > maxY) {
      maxY = y;
    }
    row.split("").forEach((cell, x) => {
      if (x > maxX) {
        maxX = x;
      }
      const name = getName(x, y);
      map.set(name, {
        name,
        x,
        y,
        costToEnter: parseInt(cell),
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
        dest = map.get(getName(x - 1, y));

        node.edges.push({
          to: getName(x - 1, y),
          cost: dest!.costToEnter,
        });
      }
      if (x < maxX) {
        dest = map.get(getName(x + 1, y));

        node.edges.push({
          to: getName(x + 1, y),
          cost: dest!.costToEnter,
        });
      }
      if (y > 0) {
        dest = map.get(getName(x, y - 1));

        node.edges.push({
          to: getName(x, y - 1),
          cost: dest!.costToEnter,
        });
      }
      if (y < maxY) {
        dest = map.get(getName(x, y + 1));

        node.edges.push({
          to: getName(x, y + 1),
          cost: dest!.costToEnter,
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
  log('toDir:', toDir);
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
  stepsInDirection: number;
};
const key = (step: Step) => {
  return `${step.x},${step.y}via${step.toDir}@${step.stepsInDirection}`;
}

const heatLoss = (rawInput: string, maxSteps: number, minSteps: number) => {

  const { map, maxX, maxY, dest } = parseInput(rawInput);

  const startFromWest: Step = {
    x: 0,
    y: 0,
    toDir: "E",
    cost: 0,
    stepsInDirection: 0,
  };
  const startFromNorth: Step = {
    x: 0,
    y: 0,
    toDir: "S",
    cost: 0,
    stepsInDirection: 0,
  };

  const queue = new MinPriorityQueue<Step>((step) => step.cost);
  queue.enqueue(startFromWest);
  // queue.enqueue(startFromNorth);
  const visited = new Set<string>();
  visited.add(key(startFromWest));
  visited.add(key(startFromNorth));

  while(queue.size()) {
    const step = queue.pop();
    const { x, y, toDir, cost, stepsInDirection } = step;

    if (x === maxX && y === maxY) {
      if (stepsInDirection < minSteps) continue;
      return step.cost;
    }

    const nextPositions = getNextPositions(toDir, x, y);
    log(nextPositions);
    for (const { dir, x: nx, y: ny } of nextPositions) {
      if (nx < 0 || nx > maxX || ny < 0 || ny > maxY) continue; // disregard invalid locations
      if (toDir === dir && stepsInDirection + 1 > maxSteps) continue; // This would be more than three steps in that direction
      if (toDir !== dir && stepsInDirection < minSteps) {
        log('not traveled enough steps!', toDir, dir, stepsInDirection, minSteps);
        continue;
      }

      log(`considering going ${dir} from ${x},${y} to ${nx},${ny}`);

      const next: Step = {
        x: nx,
        y: ny,
        toDir: dir,
        cost: cost + map.get(getName(nx, ny))!.costToEnter,
        stepsInDirection: toDir === dir ? stepsInDirection + 1 : 1,
      };
      const nkey = key(next);
      if (!visited.has(nkey)) {
        visited.add(nkey);
        queue.push(next);
      }
    }
  }
  return -1;
}

const part1 = (rawInput: string) => {
  return heatLoss(rawInput, 3, 0);
};

const part2 = (rawInput: string) => {
  return heatLoss(rawInput, 10, 4);
};

run({
  part1: {
    tests: [
      {
        input: `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
        expected: 102,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`,
        expected: 94,
      },
      {
        input: `111111111111
999999999991
999999999991
999999999991
999999999991`,
        expected: 71,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
