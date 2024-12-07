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
  type Calc = {
    result: number;
    nums: number[];
    rev: number[];
  }

  const validate = (calc: Calc) => {
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
    return isValid;
  }

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce((score, calc) => {
    if (validate(calc)) {
      return score + calc.result;
    }
    return score;
  }, 0);
};

/** CHATGPT */
function generateOperations(operations: string[], size: number): string[] {
  const result: string[] = [];

  // Helper function to recursively build combinations
  function generateCombination(currentCombination: string[], depth: number) {
    // If the combination has reached the required size, add it to the result
    if (depth === size) {
      result.push(currentCombination.join(''));
      return;
    }

    // Try each operation at the current position
    for (let op of operations) {
      currentCombination[depth] = op;  // Assign the operation at the current position
      generateCombination(currentCombination, depth + 1);  // Recurse for the next position
    }
  }

  // Start the recursive process with an empty combination
  generateCombination(new Array(size), 0);

  return result;
}
/** END CHATGPT */

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce((score, calc) => {
    // Existing impl (no concatenation)
    if (validate(calc)) {
      return score + calc.result;
    }

    // Brute force 
    // Generate possible permutations
    // Example usage
    log('Brute forcing:', calc);
    const operations = ['+', '*', '|'];
    const size = calc.nums.length-1;
    const permutations = generateOperations(operations, size);
    for(let i=0; i<permutations.length; i++) {
      const nums = [...calc.nums];
      const perm = permutations[i].split('');
      log('\texecuting:', perm);
      for(let j=0; j<perm.length; j++) {
        const op = perm[j];
        // Do op to nums[0] and nums[1]
        const first = nums.shift()!;
        const second = nums.shift()!;
        if (op === '+') {
          nums.unshift(first+second);
        } else if (op === '*') {
          nums.unshift(first * second);
        } else if (op === '|') {
          nums.unshift(parseInt(`${first}${second}`));
        } else {
          throw new Error(`Unknown op? ${op}`);
        }
      }
      log('final num:', nums[0], 'vs', calc.result);
      if (nums[0] === calc.result) {
        // This is a valid item!
        log('\t\t\t VALID ITEM!', nums[0], calc.result);
        return score + calc.result;
      }
    }

    return score;
  }, 0);
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
        expected: 11387,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
