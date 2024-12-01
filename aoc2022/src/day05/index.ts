import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  const halves = rawInput.split("\n\n")
  const stackRows = halves[0].split('\n');
  const stacks: string[][] = [];
  for (let idx = 0; idx < stackRows.length - 1; idx++) { // -1 = ignore the last row
    for (let rowIdx = 0; rowIdx < stackRows[idx].length; rowIdx += 4) {
      const stackIdx = rowIdx / 4;
      if (!stacks[stackIdx + 1]) {
        stacks[stackIdx + 1] = [];
      }
      if (stackRows[idx][rowIdx + 1] !== ' ') {
        stacks[stackIdx + 1].unshift(stackRows[idx][rowIdx + 1].replace('[', '').replace(']', ''));
      }
    }
  }
  const instrs = halves[1].split('\n').map((instr) => {
    const parts = instr.split(' ');
    return {
      count: parseInt(parts[1]),
      from: parseInt(parts[3]),
      to: parseInt(parts[5]),
    };
  });

  return {
    stacks,
    instrs,
  };
}

const part1 = (rawInput: string) => {
  const { stacks, instrs } = parseInput(rawInput);
  log(stacks);
  instrs.forEach((instr) => {
    log('executing:', instr);
    for (let i = 0; i < instr.count; i++) {
      stacks[instr.to].push(stacks[instr.from].pop()!);
    }
    log(stacks);
  });

  return stacks.reduce((acc, stack, idx) => {
    if (idx === 0) {
      return acc;
    }
    return acc + stack.pop();
  }, '');
};

const part2 = (rawInput: string) => {
  const { stacks, instrs } = parseInput(rawInput);
  log(stacks);
  instrs.forEach((instr) => {
    log('executing:', instr);
    let moving = [];
    for (let i = 0; i < instr.count; i++) {
      moving.push(stacks[instr.from].pop()!);
    }
    for (let i = 0; i < instr.count; i++) {
      stacks[instr.to].push(moving.pop()!);
    }
    log(stacks);
  });

  return stacks.reduce((acc, stack, idx) => {
    if (idx === 0) {
      return acc;
    }
    return acc + stack.pop();
  }, '');
};

run({
  part1: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests,
});
