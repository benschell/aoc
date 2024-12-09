import run from "aocrunner";
import { coordFromKey, key, LogFunc, printMap } from "../utils/map.js";

const onlyTests = false;

const log: LogFunc = (...str: any[]) => {
  if (onlyTests) {
  console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  const map = rawInput.split("\n").map((row) => row.split(""));
  // Determine possible frequencies
  const freqCoords = new Map<string, string[]>();
  let maxX = -1;
  let maxY = -1;
  const freqs = map.reduce((set, row, y) => {
    if (y > maxY) maxY = y;
    row.reduce((set, cell, x) => {
      if (x > maxX) maxX = x;
      if (cell !== ".") {
        if (!set.has(cell)) {
          set.add(cell);
        }
        if (!freqCoords.has(cell)) {
          freqCoords.set(cell, []);
        }
        const arr = freqCoords.get(cell);
        arr?.push(key(x, y));
      }
      return set;
    }, set);
    return set;
  }, new Set<string>());
  return { map, maxY, maxX, freqs, freqCoords };
};

const part1 = (rawInput: string) => {
  return;
  const { map, maxY, maxX, freqs, freqCoords } = parseInput(rawInput);
  printMap(map, log);
  log("freqs:", freqs);
  const antinodes = new Set<string>();

  const score = [...freqs].reduce((score, freq) => {
    // For each frequency, look at the coords
    const coords = freqCoords.get(freq);
    // For each coord, look at the subsequent coords
    // and compute their antinodes
    coords?.forEach((coord, idx) => {
      const from = coordFromKey(coord);
      for (let i = idx + 1; i < coords.length; i++) {
        const to = coordFromKey(coords[i]);
        log("comparing:", from, to);
        const xDiff = Math.abs(from.x - to.x);
        const yDiff = Math.abs(from.y - to.y);
        if (to.x >= from.x) {
          const priorAntinode = key(from.x - xDiff, from.y - yDiff);
          const laterAntinode = key(to.x + xDiff, to.y + yDiff);
          if (
            from.x - xDiff >= 0 &&
            from.y - yDiff >= 0 &&
            !antinodes.has(priorAntinode)
          ) {
            log("antinode @", priorAntinode);
            antinodes.add(priorAntinode);
            score += 1;
          }
          if (
            to.x + xDiff <= maxX &&
            to.y + yDiff <= maxY &&
            !antinodes.has(laterAntinode)
          ) {
            log("antinode @", laterAntinode);
            antinodes.add(laterAntinode);
            score += 1;
          }
        } else {
          const priorAntinode = key(from.x + xDiff, from.y - yDiff);
          const laterAntinode = key(to.x - xDiff, to.y + yDiff);
          if (
            from.x + xDiff <= maxX &&
            from.y - yDiff >= 0 &&
            !antinodes.has(priorAntinode)
          ) {
            log("antinode @", priorAntinode);
            antinodes.add(priorAntinode);
            score += 1;
          }
          if (
            to.x - xDiff >= 0 &&
            to.y + yDiff <= maxY &&
            !antinodes.has(laterAntinode)
          ) {
            log("antinode @", laterAntinode);
            antinodes.add(laterAntinode);
            score += 1;
          }
        }
      }
    });

    return score;
  }, 0);

  log("antinodes?", antinodes);
  printMap(map, log, antinodes);
  return score;
};

const part2 = (rawInput: string) => {
  const { map, maxY, maxX, freqs, freqCoords } = parseInput(rawInput);
  printMap(map, console.log);
  log("freqs:", freqs);
  const antinodes = new Set<string>();

  [...freqs].forEach((freq) => {
    // For each frequency, look at the coords
    const coords = freqCoords.get(freq);
    // For each coord, look at the subsequent coords
    // and compute their antinodes
    coords?.forEach((fromKey, idx) => {
      const from = coordFromKey(fromKey);
      antinodes.add(fromKey);

      for (let i = idx + 1; i < coords.length; i++) {
        const toKey = coords[i];
        const to = coordFromKey(toKey);
        antinodes.add(toKey);

        log("comparing:", from, to);
        const xDiff = Math.abs(from.x - to.x);
        const yDiff = Math.abs(from.y - to.y);
        let count = 1;
        while (true) {
          let didFindAntinode = false;
          const xMod = count * xDiff;
          const yMod = count * yDiff;
          if (to.x >= from.x) {
            const priorAntinode = key(from.x - xMod, from.y - yMod);
            const laterAntinode = key(to.x + xMod, to.y + yMod);
            if (from.x - xMod >= 0 && from.y - yMod >= 0) {
              didFindAntinode = true;
              if (!antinodes.has(priorAntinode)) {
                log("new antinode @", priorAntinode);
                antinodes.add(priorAntinode);
              }
            }
            if (to.x + xMod <= maxX && to.y + yMod <= maxY) {
              didFindAntinode = true;
              if (!antinodes.has(laterAntinode)) {
                log("new antinode @", laterAntinode);
                antinodes.add(laterAntinode);
              }
            }
          } else {
            const priorAntinode = key(from.x + xMod, from.y - yMod);
            const laterAntinode = key(to.x - xMod, to.y + yMod);
            if (from.x + xMod <= maxX && from.y - yMod >= 0) {
              didFindAntinode = true;
              if (!antinodes.has(priorAntinode)) {
                log("new antinode @", priorAntinode);
                antinodes.add(priorAntinode);
              }
            }
            if (to.x - xMod >= 0 && to.y + yMod <= maxY) {
              didFindAntinode = true;
              if (!antinodes.has(laterAntinode)) {
                log("new antinode @", laterAntinode);
                antinodes.add(laterAntinode);
              }
            }
          }
          count += 1;
          if (!didFindAntinode) { // || count > 10) {
            break;
          }
        }
      }
    });
  });

  log("antinodes?", antinodes);
  console.log("\n");
  printMap(map, console.log, antinodes);
  return antinodes.size;
};

run({
  part1: {
    tests: [
      {
        input: `..........
..........
..........
....a.....
..........
.....a....
..........
..........
..........
..........`,
        expected: 2,
      },
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `..........
..........
..........
....a.....
..........
.....a....
..........
..........
..........
..........`,
        expected: 5,
      },
      {
        input: `T.........
...T......
.T........
..........
..........
..........
..........
..........
..........
..........`,
        expected: 9,
      },
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 34,
      },
      {
        input: `..........
..........
...T......
......T...
....T.....
..........
..........
..........
..........
..........
..........
..........`,
        expected: 12,
      },
      {
        input: `..........
..........
...T.T....
..........
..........
..........
..........
..........
..........
..........
..........
..........`,
        expected: 5,
      },
      {
        input: `..........
..........
...TT.....
..........
..........
..........
..........
..........
..........
..........
..........
..........`,
        expected: 10,
      },
//       {
//         input: `..........
// ..........
// ..........
// ....T.....
// ...T.T....
// ....T.....
// ..........
// ..........
// ..........
// ..........
// ..........
// ..........`,
//         expected: 6,
//       },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
