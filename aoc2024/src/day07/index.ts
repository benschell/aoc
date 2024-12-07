import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((row) => {
    const parts = row.split(": ");
    const result = parseInt(parts[0]);
    const nums = parts[1].split(" ").map((num) => parseInt(num));
    return { result, nums, rev: [...nums].reverse() };
  });

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce((score, calc) => {
    const ops: { result: number; nums: number[] }[] = [{ result: calc.result, nums: calc.rev }];
    let isValid = false;
    while(ops.length) {
      const op = ops.shift()!;
      if (op.nums.length <= 1) {
        if (op.nums[0] === op.result) isValid = true;
        continue;
      }
      // Consider the first item
      const num = op.nums[0];
      if (op.result % num) {
        const newNums = [...op.nums];
        newNums.shift();
        // The last operation cannot be multiplication
        ops.push({
          result: op.result - num,
          nums: newNums,
        });
      } else {
        const newNums = [...op.nums];
        newNums.shift();
        // The last operation *could* be either
        ops.push({
          result: op.result - num,
          nums: newNums,
        });
        ops.push({
          result: op.result / num,
          nums: newNums,
        });
      }
    }
    if (isValid) {
      return score + calc.result;
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
        input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 3749,
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
