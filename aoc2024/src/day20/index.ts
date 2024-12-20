import run from "aocrunner";
import {
  coordFromKey,
  Direction,
  key,
  Point,
  PrintCellFunc,
  printMap,
} from "../utils/map.js";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  const start: Point = { x: -1, y: -1 };
  const end: Point = { x: -1, y: -1 };
  const map = rawInput.split("\n").map((row, y) => {
    const ret = row.split("");
    ret.forEach((cell, x) => {
      if (cell === "S") {
        start.x = x;
        start.y = y;
        ret[x] = ".";
      } else if (cell === "E") {
        end.x = x;
        end.y = y;
        ret[x] = ".";
      }
    });
    return ret;
  });
  return { map, start, end };
};

const part1 = (rawInput: string) => {
  const { map, start, end } = parseInput(rawInput);
  const printCell: PrintCellFunc = (cell, x, y) => {
    if (x === start.x && y === start.y) {
      return "S";
    } else if (x === end.x && y === end.y) {
      return "E";
    } else {
      return cell;
    }
  };
  printMap(map, log, undefined, printCell);

  let currKey = key(start.x, start.y);
  const endKey = key(end.x, end.y);
  const path: string[] = [];
  while (currKey !== endKey) {
    path.push(currKey);
    // Find next position
    const curr = coordFromKey(currKey);
    if (
      map[curr.y + 1][curr.x] !== "#" &&
      !path.includes(key(curr.x, curr.y + 1))
    ) {
      currKey = key(curr.x, curr.y + 1);
      continue;
    }
    if (
      map[curr.y - 1][curr.x] !== "#" &&
      !path.includes(key(curr.x, curr.y - 1))
    ) {
      currKey = key(curr.x, curr.y - 1);
      continue;
    }
    if (
      map[curr.y][curr.x + 1] !== "#" &&
      !path.includes(key(curr.x + 1, curr.y))
    ) {
      currKey = key(curr.x + 1, curr.y);
      continue;
    }
    if (
      map[curr.y][curr.x - 1] !== "#" &&
      !path.includes(key(curr.x - 1, curr.y))
    ) {
      currKey = key(curr.x - 1, curr.y);
      continue;
    }
  }
  path.push(endKey);

  const originalLength = path.length - 1;
  log("original path length:", originalLength);
  log(path);

  // Examine possible candidates
  const candidates: { key: string; dir: Direction }[] = path.reduce(
    (set, currKey, currIdx) => {
      const curr = coordFromKey(currKey);
      // Consider each direction from this point and decide whether to add to the set
      if (
        curr.x - 2 >= 0 &&
        map[curr.y][curr.x - 1] === "#" &&
        map[curr.y][curr.x - 2] === "." &&
        path.indexOf(key(curr.x - 2, curr.y)) > currIdx
      ) {
        // This is a candidate to the West
        set.push({ key: currKey, dir: Direction.W });
      }
      if (
        curr.x + 2 < map[curr.y].length &&
        map[curr.y][curr.x + 1] === "#" &&
        map[curr.y][curr.x + 2] === "." &&
        path.indexOf(key(curr.x + 2, curr.y)) > currIdx
      ) {
        // This is a candidate to the East
        set.push({ key: currKey, dir: Direction.E });
      }
      if (
        curr.y - 2 >= 0 &&
        map[curr.y - 1][curr.x] === "#" &&
        map[curr.y - 2][curr.x] === "." &&
        path.indexOf(key(curr.x, curr.y - 2)) > currIdx
      ) {
        // This is a candidate to the West
        set.push({ key: currKey, dir: Direction.N });
      }
      if (
        curr.y + 2 < map.length &&
        map[curr.y + 1][curr.x] === "#" &&
        map[curr.y + 2][curr.x] === "." &&
        path.indexOf(key(curr.x, curr.y + 2)) > currIdx
      ) {
        // This is a candidate to the East
        set.push({ key: currKey, dir: Direction.S });
      }
      return set;
    },
    [] as { key: string; dir: Direction }[],
  );
  log({ candidates });
  return candidates.reduce((score, candidate) => {
    // If we remove this candidate, what is the length?
    if (!path.includes(candidate.key)) {
      throw new Error(`Invalid candidate: ${JSON.stringify(candidate)}`);
    }
    const { key: currKey, dir } = candidate;
    const curr = coordFromKey(currKey);
    // log("considering candidate:", curr, dir);
    let nextKey: string;
    if (dir === Direction.E) {
      // Look two spaces to the right
      nextKey = key(curr.x + 2, curr.y);
    } else if (dir === Direction.W) {
      // Look two spaces to the left
      nextKey = key(curr.x - 2, curr.y);
    } else if (dir === Direction.N) {
      // Look two spaces up
      nextKey = key(curr.x, curr.y - 2);
    } else if (dir === Direction.S) {
      // Look two spaces down
      nextKey = key(curr.x, curr.y + 2);
    } else {
      throw new Error(`Invalid direction: ${dir}`);
    }
    // log("next key:", nextKey);
    const currIdx = path.indexOf(currKey);
    const nextIdx = path.indexOf(nextKey);
    // log({ currIdx, nextIdx });
    const savings =
      nextIdx -
      currIdx -
      1 - // Adding back the end location
      1; // Adding back the wall space that is part of the path
    log("Savings:", savings);
    if ((onlyTests && savings >= 2) || (!onlyTests && savings >= 100)) {
      return score + 1;
    }
    return score;
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
        input: `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`,
        expected: 44,
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
