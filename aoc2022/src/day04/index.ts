import run from "aocrunner";
import chalk from "chalk";

const onlyTests = false;

const log = (str: string) => {
  if (onlyTests) {
    console.log(str);
  }
};

const parseInput = (rawInput: string) => rawInput.split('\n').map((row) => {
  const parts = row.split(',');
  const first = parts[0].split('-');
  const second = parts[1].split('-');
  return [{
    start: parseInt(first[0]),
    length: parseInt(first[1]) - parseInt(first[0]),
    end: parseInt(first[1]),
  }, {
    start: parseInt(second[0]),
    length: parseInt(second[1]) - parseInt(second[0]),
    end: parseInt(second[1]),
  }];
});
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((score, pair) => {
    if (
      // Second inside of First
      (pair[1].start >= pair[0].start && pair[0].end >= pair[1].end) ||
      // First inside of Second
      (pair[0].start >= pair[1].start && pair[1].end >= pair[0].end)
    ) {
      return score + 1;
    }
    return score;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((score, pair) => {
    if (
      (pair[0].start <= pair[1].start && pair[0].end >= pair[1].start) ||
      (pair[1].start <= pair[0].start && pair[1].end >= pair[0].start)
    ) {
      log(`${pair[0].start}-${pair[0].end},${pair[1].start}-${pair[1].end}`);
      return score + 1;
    } else {
      log(chalk.red(`${pair[0].start}-${pair[0].end},${pair[1].start}-${pair[1].end}`));

    }
    return score;
  }, 0);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
