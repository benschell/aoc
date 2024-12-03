import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  return [...rawInput.matchAll(/mul\((\d+),(\d+)\)|don't\(\)|do\(\)/g)].map(
    (match) => ({
      match: match[0],
      first: parseInt(match[1]),
      second: parseInt(match[2]),
    }),
  );
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce((score, calc) => {
    if (calc.match.includes("mul")) {
      return score + calc.first * calc.second;
    }
    return score;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let shouldProcess = true;
  return input.reduce((score, calc) => {
    log('executing:', calc, shouldProcess);
    if (calc.match.includes("mul") && shouldProcess) {
      return score + calc.first * calc.second;
    } else if (calc.match === "don't()") {
      shouldProcess = false;
    } else if (calc.match === "do()") {
      shouldProcess = true;
    }
    return score;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
        expected: 161,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
        expected: 48,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
