import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((row) => row.split("   ").map((num) => parseInt(num)))
    .reduce(
      (result: [number[], number[]], row) => {
        result[0].push(row[0]);
        result[1].push(row[1]);
        return result;
      },
      [[], []],
    )
    .map((set) => set.sort());

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let score = 0;
  for (let idx = 0; idx < input[0].length; idx++) {
    score += Math.abs(input[0][idx] - input[1][idx]);
  }
  return score;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input[0].reduce((score, row, idx) => {
    const timesInSecond = input[1].filter((num) => num === row).length;
    return score + (row * timesInSecond);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
