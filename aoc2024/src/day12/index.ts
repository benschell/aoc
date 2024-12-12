import run from "aocrunner";
import { coordFromKey, key, printMap } from "../utils/map.js";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((row) => row.split(""));

const part1 = (rawInput: string) => {
  const map = parseInput(rawInput);
  printMap(map, log);
  const visited = new Set<string>();
  let score = 0;
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const ck = key(x, y);
      if (!visited.has(ck)) {
        visited.add(ck);

        // We've not visited this node. Look around this node for others of the same type.
        const curr = map[y][x];
        const region = new Set<string>([ck]);
        const toVisit = [ck];
        let size = 1;
        while (toVisit.length) {
          // From this starting place...
          const node = toVisit.pop()!;
          const { x, y } = coordFromKey(node);
          let hasFound = false;
          // ... Look left, right, up, down
          let k;
          k = key(x - 1, y);
          if (x > 0 && !visited.has(k) && map[y][x - 1] === curr) {
            // Left is part of our region
            visited.add(k);
            region.add(k);
            toVisit.push(k);
            hasFound = true;
          }
          k = key(x + 1, y);
          if (x < row.length - 1 && !visited.has(k) && map[y][x + 1] === curr) {
            // Right is part of our region
            visited.add(k);
            region.add(k);
            toVisit.push(k);
            hasFound = true;
          }
          k = key(x, y - 1);
          if (y > 0 && !visited.has(k) && map[y - 1][x] === curr) {
            // Up is part of our region
            visited.add(k);
            region.add(k);
            toVisit.push(k);
            hasFound = true;
          }
          k = key(x, y + 1);
          if (y < map.length - 1 && !visited.has(k) && map[y + 1][x] === curr) {
            // Down is part of our region
            visited.add(k);
            region.add(k);
            toVisit.push(k);
            hasFound = true;
          }
          // if (!hasFound) {
          //   // We've found everything for this region
          //   break;
          // }
          // if (size++ > 10) {
          //   break;
          // }
        }
        log("Found region:", curr, region);
        // Score this region
        const area = region.size;
        const perimeter = [...region].reduce((score, location) => {
          const { x, y } = coordFromKey(location);
          const curr = map[y][x];
          let k;
          k = key(x - 1, y);
          if (x <= 0 || map[y][x - 1] !== curr) {
            // Left is a fence
            // log(`Left of ${location} is a fence!`);
            score += 1;
          }
          k = key(x + 1, y);
          if (x >= row.length - 1 || map[y][x + 1] !== curr) {
            // Right is a fence
            // log(`Right of ${location} is a fence!`);
            score += 1;
          }
          k = key(x, y - 1);
          if (y <= 0 || map[y - 1][x] !== curr) {
            // Up is a fence
            // log(`Up of ${location} is a fence!`);
            score += 1;
          }
          k = key(x, y + 1);
          if (y >= map.length - 1 || map[y + 1][x] !== curr) {
            // Down is a fence
            // log(`Down of ${location} is a fence!`);
            score += 1;
          }
          return score;
        }, 0);
        log(`Area: ${area}, Perimeter: ${perimeter}`);
        score += (area * perimeter);
      }
    }
  }

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
        input: `AAAA
BBCD
BBCC
EEEC`,
        expected: 140,
      },
      {
        input: `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
        expected: 772,
      },
      {
        input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1930,
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
