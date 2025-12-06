import run from "aocrunner";
const ONLY_TESTS = false;
const DEBUG = false;
const log = (...args: any[]) => DEBUG && console.log.apply(null, args);

const parseInput = (rawInput: string) => {
  const lines = rawInput.split('\n');
  const equations: { operand: string, values: number[] }[] = [];
  while (lines[0].length > 0) {
    // Find the first column where all rows have a space
    let separatorIndex = -1;
    for (let i = 0; i < lines[0].length; i += 1) {
      if (lines.every((line) => line[i] === ' ')) {
        separatorIndex = i;
        break;
      }
    }
    log(lines[0].length);
    let strOperands: string[] = [];
    if (separatorIndex === -1) {
      // This is the last portion!
      lines.forEach((line, idx) => {
        strOperands.push(line.trim());
        lines[idx] = '';
      });
      log(`Found operands: ${strOperands.join(',')}`);
    } else {
      // Collect the operands
      lines.forEach((line, idx) => {
        strOperands.push(line.substring(0, separatorIndex).trim());
        lines[idx] = line.substring(separatorIndex+1);
      });
      log(`Found operands: ${strOperands.join(',')}`);
    }
    const operand = strOperands.pop()!;
    equations.push({
      values: strOperands.map((num) => parseInt(num)),
      operand,
    });
  }
  return equations;
};

const part1 = (rawInput: string) => {
  const equations = parseInput(rawInput);
  log(equations);

  let sum = 0;
  equations.forEach((equation) => {
    const op = equation.operand;
    if (op === '+') {
      sum += equation.values.reduce((prev, num) => prev + num, 0);
    } else if (op === '*') {
      sum += equation.values.reduce((prev, num) => prev * num, 1);
    }
  });

  return sum;
};

const parseInputForPart2 = (rawInput: string) => {
  const lines = rawInput.split('\n');
  const equations: { operand: string, values: number[] }[] = [];
  while (lines[0].length > 0) {
    // Find the first column where all rows have a space
    let separatorIndex = -1;
    for (let i = 0; i < lines[0].length; i += 1) {
      if (lines.every((line) => line[i] === ' ')) {
        separatorIndex = i;
        break;
      }
    }
    log(lines[0].length);
    let strOperands: string[] = [];
    if (separatorIndex === -1) {
      // This is the last portion!
      lines.forEach((line, idx) => {
        strOperands.push(line);
        lines[idx] = '';
      });
      log(`Found operands: ${strOperands.join(',')}`);
    } else {
      // Collect the operands
      lines.forEach((line, idx) => {
        strOperands.push(line.substring(0, separatorIndex));
        lines[idx] = line.substring(separatorIndex+1);
      });
      log(`Found operands: ${strOperands.join(',')}`);
    }
    const operand = strOperands.pop()!.trim();
    // Transform the strOperands
    const strValues: string[] = [];
    // Iterate over the columns
    for (let colIdx = 0; colIdx < strOperands[0].length; colIdx += 1) {
      let col = '';
      strOperands.forEach((_, rowIdx) => {
        col += strOperands[rowIdx][colIdx];
      });
      strValues.push(col)
    }

    equations.push({
      values: strValues.map((num) => parseInt(num)),
      operand,
    });
  }
  return equations;
};

const part2 = (rawInput: string) => {
  const equations = parseInputForPart2(rawInput);
  log(equations);

  let sum = 0;
  equations.forEach((equation) => {
    const op = equation.operand;
    if (op === '+') {
      sum += equation.values.reduce((prev, num) => prev + num, 0);
    } else if (op === '*') {
      sum += equation.values.reduce((prev, num) => prev * num, 1);
    }
  });

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `,
        expected: 4277556,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `,
        expected: 3263827,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: ONLY_TESTS,
});
