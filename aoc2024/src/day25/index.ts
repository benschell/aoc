import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  const segments = rawInput.split("\n\n");
  const keys: number[][] = [];
  const locks: number[][] = [];
  segments.forEach((segment) => {
    const rows = segment.split('\n');
    if (rows[0] === '#####') {
      // This is a lock
      const cols: number[] = [0, 0, 0, 0, 0];
      for (let y = 1; y <= 5; y++) {
        for (let x = 0; x < 5; x++) {
          if (rows[y][x] === '#') {
            cols[x] = y;
          }
        }
      }
      locks.push(cols);
    } else {
      const cols: number[] = [0, 0, 0, 0, 0];
      for (let y = 5; y >= 1; y--) {
        for (let x = 0; x < 5; x++) {
          if (rows[y][x] === '#') {
            cols[x] = 6-y;
          }
        }
      }
      keys.push(cols);
    }
  })
  return { keys, locks };
}

const part1 = (rawInput: string) => {
  const { keys, locks } = parseInput(rawInput);
  log(keys);
  log(locks);
  let valid = 0;
  locks.forEach((lock) => {
    keys.forEach((key) => {
      let isValid = true;
      for (let x=0; x < 5; x++) {
        if (lock[x] + key[x] > 5) {
          isValid = false;
          break;
        }
      }
      if (isValid) {
        log(`lock ${lock.join(',')} and key ${key.join(',')}: all columns fit!`);
        valid += 1;
      }
    });
  });

  return valid;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`,
        expected: 3,
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
