import run from "aocrunner";
const ONLY_TESTS = false;
const DEBUG = false;
const log = (...args: any[]) => DEBUG && console.log.apply(null, args);

const parseInput = (rawInput: string) => rawInput.split('\n').map((row) => row.split(''));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  log(input);
  let numValidRolls = 0;
  input.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== '@') return;

      let numAdjacentRolls = 0;
      // Prior row
      if (y > 0) {
        if (x > 0 && input[y-1][x-1] === '@')
          numAdjacentRolls += 1;
        if (input[y-1][x] === '@')
          numAdjacentRolls += 1;
        if (x < input[y-1].length - 1 && input[y-1][x+1] === '@')
          numAdjacentRolls += 1;
      }
      // This row
      if (x > 0 && input[y][x-1] === '@')
        numAdjacentRolls += 1;
      if (x < input[y].length - 1 && input[y][x+1] === '@')
        numAdjacentRolls += 1;
      // Next row
      if (y < input.length - 1) {
        if (x > 0 && input[y+1][x-1] === '@')
          numAdjacentRolls += 1;
        if (input[y+1][x] === '@')
          numAdjacentRolls += 1;
        if (x < input[y+1].length - 1 && input[y+1][x+1] === '@')
          numAdjacentRolls += 1;
      }

      if (numAdjacentRolls < 4) {
        log(`for ${x},${y}, numAdjacentRolls: ${numAdjacentRolls}`);
        numValidRolls += 1;
      }
    });
  });

  return numValidRolls;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  log(input);
  let numValidRolls = 0;
  let iters = 0;
  while(true) {
    iters += 1;
    let didRemoveARoll = false;
    input.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== '@') return;

        let numAdjacentRolls = 0;
        // Prior row
        if (y > 0) {
          if (x > 0 && input[y-1][x-1] === '@')
            numAdjacentRolls += 1;
          if (input[y-1][x] === '@')
            numAdjacentRolls += 1;
          if (x < input[y-1].length - 1 && input[y-1][x+1] === '@')
            numAdjacentRolls += 1;
        }
        // This row
        if (x > 0 && input[y][x-1] === '@')
          numAdjacentRolls += 1;
        if (x < input[y].length - 1 && input[y][x+1] === '@')
          numAdjacentRolls += 1;
        // Next row
        if (y < input.length - 1) {
          if (x > 0 && input[y+1][x-1] === '@')
            numAdjacentRolls += 1;
          if (input[y+1][x] === '@')
            numAdjacentRolls += 1;
          if (x < input[y+1].length - 1 && input[y+1][x+1] === '@')
            numAdjacentRolls += 1;
        }

        if (numAdjacentRolls < 4) {
          log(`for ${x},${y}, numAdjacentRolls: ${numAdjacentRolls}`);
          numValidRolls += 1;
          input[y][x] = 'x';
          didRemoveARoll = true;
        }
      });
    });
    if (!didRemoveARoll)
      break;
  }

      log(input);
  return numValidRolls;
};

run({
  part1: {
    tests: [
      {
        input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
        expected: 43,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: ONLY_TESTS,
});
