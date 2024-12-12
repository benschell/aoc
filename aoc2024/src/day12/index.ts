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

const solve = (map: string[][], partTwo?: boolean): number => {
  const nodeMap: {
    x: number;
    y: number;
    leftFence?: boolean;
    leftFenceCounted?: boolean;
    rightFence?: boolean;
    rightFenceCounted?: boolean;
    upFence?: boolean;
    upFenceCounted?: boolean;
    downFence?: boolean;
    downFenceCounted?: boolean;
  }[][] = [];
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
          nodeMap[y] ??= [];
          nodeMap[x] ??= [];
          nodeMap[y][x] = { x, y };
          let hasFound = false;
          // ... Look left, right, up, down
          let k;
          k = key(x - 1, y);
          if (x > 0 && map[y][x - 1] === curr) {
            // Left is part of our region
            nodeMap[y][x].leftFence = false;
            if (!visited.has(k)) {
              visited.add(k);
              region.add(k);
              toVisit.push(k);
              hasFound = true;
            }
          }
          k = key(x + 1, y);
          if (x < row.length - 1 && map[y][x + 1] === curr) {
            // Right is part of our region
            nodeMap[y][x].rightFence = false;
            if (!visited.has(k)) {
              visited.add(k);
              region.add(k);
              toVisit.push(k);
              hasFound = true;
            }
          }
          k = key(x, y - 1);
          if (y > 0 && map[y - 1][x] === curr) {
            // Up is part of our region
            nodeMap[y][x].upFence = false;
            if (!visited.has(k)) {
              visited.add(k);
              region.add(k);
              toVisit.push(k);
              hasFound = true;
            }
          }
          k = key(x, y + 1);
          if (y < map.length - 1 && map[y + 1][x] === curr) {
            // Down is part of our region
            nodeMap[y][x].downFence = false;
            if (!visited.has(k)) {
              visited.add(k);
              region.add(k);
              toVisit.push(k);
              hasFound = true;
            }
          }

          nodeMap[y][x].leftFence ??= true;
          nodeMap[y][x].rightFence ??= true;
          nodeMap[y][x].upFence ??= true;
          nodeMap[y][x].downFence ??= true;
        }
        log("Found region:", curr, region);
        // Score this region
        const area = region.size;
        const perimeter = [...region].reduce((score, location) => {
          log(`examining: ${location}, starting score: ${score}`);
          const { x, y } = coordFromKey(location);
          const node = nodeMap[y][x];
          if (!partTwo) {
            if (node.leftFence) {
              score += 1;
            }
            if (node.rightFence) {
              score += 1;
            }
            if (node.upFence) {
              score += 1;
            }
            if (node.downFence) {
              score += 1;
            }
          } else {
            // Consider an upFence.
            if (node.upFence && !node.upFenceCounted) {
              // Count the upFence
              score += 1;
              node.upFenceCounted = true;
              log(
                `found upFence\t starting at ${x},${y} and now looking left/right`,
              );
              // look to the right and mark upFenceCounted as necessary
              let n, nx;
              n = node;
              nx = x;
              while (true) {
                n = nodeMap[y][++nx];
                if (n && n.upFence) {
                  n.upFenceCounted = true;
                  log(`\t up fence counted! ${nx},${y}`);
                } else {
                  break;
                }
              }
              n = node;
              nx = x;
              while (true) {
                n = nodeMap[y][--nx];
                if (n && n.upFence) {
                  n.upFenceCounted = true;
                  log(`\t up fence counted! ${nx},${y}`);
                } else {
                  break;
                }
              }
            }
            // Consider a rightFence.
            if (node.rightFence && !node.rightFenceCounted) {
              // Count the rightFence
              score += 1;
              node.rightFenceCounted = true;
              log(
                `found rightFence starting at ${x},${y} and now looking up/down`,
              );
              let n, ny;
              n = node;
              ny = y;
              while (ny + 1 < nodeMap.length) {
                n = nodeMap[++ny][x];
                if (n && n.rightFence) {
                  n.rightFenceCounted = true;
                  log(`\t right fence counted! ${x},${ny}`);
                } else {
                  break;
                }
              }
              n = node;
              ny = y;
              while (ny - 1 >= 0) {
                n = nodeMap[--ny][x];
                if (n && n.rightFence) {
                  n.rightFenceCounted = true;
                  log(`\t right fence counted! ${x},${ny}`);
                } else {
                  break;
                }
              }
            }
            // Consider an downFence.
            if (node.downFence && !node.downFenceCounted) {
              // Count the downFence
              score += 1;
              node.downFenceCounted = true;
              log(
                `found downFence\t starting at ${x},${y} and now looking left/right`,
              );
              // look to the right and mark downFenceCounted as necessary
              let n, nx;
              n = node;
              nx = x;
              while (true) {
                n = nodeMap[y][++nx];
                if (n && n.downFence) {
                  n.downFenceCounted = true;
                  log(`\t down fence counted! ${nx},${y}`);
                } else {
                  break;
                }
              }
              n = node;
              nx = x;
              while (true) {
                n = nodeMap[y][--nx];
                if (n && n.downFence) {
                  n.downFenceCounted = true;
                  log(`\t down fence counted! ${nx},${y}`);
                } else {
                  break;
                }
              }
            }
            // Consider a leftFence.
            if (node.leftFence && !node.leftFenceCounted) {
              // Count the leftFence
              score += 1;
              node.leftFenceCounted = true;
              log(
                `found leftFence\t starting at ${x},${y} and now looking up/down`,
              );
              let n, ny;
              n = node;
              ny = y;
              while (ny + 1 < nodeMap.length) {
                n = nodeMap[++ny][x];
                if (n && n.leftFence) {
                  n.leftFenceCounted = true;
                  log(`\t left fence counted! ${x},${ny}`);
                } else {
                  break;
                }
              }
              n = node;
              ny = y;
              while (ny - 1 >= 0) {
                n = nodeMap[--ny][x];
                if (n && n.leftFence) {
                  n.leftFenceCounted = true;
                  log(`\t left fence counted! ${x},${ny}`);
                } else {
                  break;
                }
              }
            }
          }
          log(`returning score: ${score}`);
          return score;
        }, 0);
        log(`Area: ${area}, Perimeter: ${perimeter}`);
        score += area * perimeter;
      }
    }
  }

  return score;
};

const part1 = (rawInput: string) => {
  return solve(parseInput(rawInput));
};

const part2 = (rawInput: string) => {
  return solve(parseInput(rawInput), true);
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
      {
        input: `AAAA
BBCD
BBCC
EEEC`,
        expected: 80,
      },
      {
        input: `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
        expected: 436,
      },
      {
        input: `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`,
        expected: 236,
      },
      {
        input: `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`,
        expected: 368,
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
        expected: 1206,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
