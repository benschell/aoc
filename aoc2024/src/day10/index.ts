import run from "aocrunner";
import { key, printMap } from "../utils/map.js";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  const map = rawInput.split("\n").map((row) => row.split(''));
  const zeros = map.reduce((zeros, row, y) => {
    row.reduce((zeros, cell, x) => {
      if (cell === '0') {
        zeros.push([x, y]);
      }
      return zeros;
    }, zeros);
    return zeros;
  }, [] as [number, number][]);
  return { map, zeros };
};
const getNextNum = (curr: string) => {
  const num = parseInt(curr);
  if (isNaN(num)) {
    throw new Error('not a number!:' + curr);
  }
  return '' + (num + 1);
}
const dfs = (map: string[][], x: number, y: number) => {
  // DFS
  let nodes = new Array<[number, number]>();
  let visited = new Set<string>();
  let numPaths = 0;
  nodes.push([x, y]);
  while(nodes.length) {
    const node = nodes.pop();
    if (node) {
      const [x, y] = node;
      const k = key(x, y);
      if (!visited.has(key(x, y))) {
        visited.add(k);
        const curr = map[y][x];
        if (curr === '9') {
          log('got a path culminating in', x, y);
          numPaths += 1;
        } else {
          const next = getNextNum(curr);
          // Push all adjacent edges of this node
          if (x > 0 && map[y][x-1] === next) {
            nodes.push([x-1, y]);
          }
          if (x < map[y].length - 1 && map[y][x+1] === next) {
            nodes.push([x+1, y]);
          }
          if (y > 0 && map[y-1][x] === next) {
            nodes.push([x, y-1]);
          }
          if (y < map.length - 1 && map[y+1][x] === next) {
            nodes.push([x, y+1]);
          }
        }
      }
    }
  }

  log('returning:', numPaths);
  return numPaths;
}
const bfs = (map: string[][], x: number, y: number) => {
  let nodes = new Array<[number, number][]>();
  let explored = new Set<string>();
  explored.add(key(x, y));
  nodes.push([[x, y]]);
  let numPaths = 0;
  const paths = [];
  log('starting:', x, y);
  while (nodes.length) {
    // log('\t\tlooping', nodes);
    const path = nodes.shift();
    if (path) {
      const node = path[path.length-1];
      const [x, y] = node;
      log('examining:', x, y);
      const curr = map[y][x];
      if (curr === '9') {
        // A goal
        log('\t\t\t\t\tfound a path', x, y);
        numPaths += 1;
        paths.push(path);
      } else {
        const next = getNextNum(curr);
        log('looking for', next);
        // Push all adjacent edges of this node
        if (x > 0 && map[y][x-1] === next) {
          log('pushing', x-1, y);
          nodes.push([...path, [x-1, y]]);
        }
        if (x < map[y].length - 1 && map[y][x+1] === next) {
          log('pushing', x+1, y);
          nodes.push([...path, [x+1, y]]);
        }
        if (y > 0 && map[y-1][x] === next) {
          log('pushing', x, y-1);
          nodes.push([...path, [x, y-1]]);
        }
        if (y < map.length - 1 && map[y+1][x] === next) {
          log('pushing', x, y+1);
          nodes.push([...path, [x, y+1]]);
        }
      }
    }
  }

  return numPaths;
}

const part1 = (rawInput: string) => {
  const { map, zeros } = parseInput(rawInput);
  printMap(map, log);
  return zeros.reduce((score, [x, y]) => {
    log('checking:', x, y);
    const numPaths = dfs(map, x, y);
    if (numPaths > 0) {
      return score + numPaths;
    }
    return score;
  }, 0);
};

const part2 = (rawInput: string) => {
  const { map, zeros } = parseInput(rawInput);
  printMap(map, log);
  return zeros.reduce((score, [x, y]) => {
    log('checking:', x, y);
    const numPaths = bfs(map, x, y);
    if (numPaths > 0) {
      return score + numPaths;
    }
    return score;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `0123
1234
8765
9876`,
        expected: 1,
      },
      {
        input: `...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`,
        expected: 2,
      },
      {
        input: `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`,
        expected: 4,
      },
      {
        input: `10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01`,
        expected: 3,
      },
      {
        input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 36,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....`,
        expected: 3,
      },
      {
        input: `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`,
        expected: 13,
      },
      {
        input: `012345
123456
234567
345678
4.6789
56789.`,
        expected: 227,
      },
      {
        input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 81,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
