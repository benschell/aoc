import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;
const DEBUG = false;
const ONLY_TESTS = false;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const ops = input.split('\n');
  let loc = 50;
  let numZeros = 0;
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const dir = op[0];
    const num = Number(op.substring(1));
    const oldLoc = loc;

    if (dir === 'L') {
      loc -= num;
    } else if (dir === 'R') {
      loc += num;
    } else {
      throw new Error(`Unexpected direction: "${dir}"`);
    }

    loc = loc % 100;
    if (loc < 0) { 
      loc = 100 + loc;
    }
    
    if (loc === 0) {
      numZeros += 1;
    }

    if (DEBUG) {
      console.log(`Moved: ${dir} by ${num} from ${oldLoc} to ${loc}; numZeros: ${numZeros}`);
    }
  }

  return numZeros;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const ops = input.split('\n');
  let loc = 50;
  let passedZero = 0;
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const dir = op[0];
    let num = Number(op.substring(1));
    const oldLoc = loc;

    if (num >= 100) {
      DEBUG && console.log(`adding: ${Math.floor(num/100)}`);
      passedZero += Math.floor(num / 100);
      num = num % 100;
    }

    if (dir === 'L') {
      loc -= num;
    } else if (dir === 'R') {
      loc += num;
    } else {
      throw new Error(`Unexpected direction: "${dir}"`);
    }

    if (loc > 99 && loc % 100 !== 0) {
      DEBUG && console.log(`greater than 99, so adding 1 (${loc})`);
      passedZero += 1;
    }
    loc = loc % 100;
    if (loc < 0) { 
      if (oldLoc !== 0) {
        DEBUG && console.log(`less than zero, so adding 1 (${loc})`);
        passedZero += 1;
      }
      loc = 100 + loc;
    }
    
    if (loc === 0) {
      DEBUG && console.log(`zero, so adding 1`);
      passedZero += 1;
    }

    if (DEBUG) {
      console.log(`Moved: ${dir} by ${num} from ${oldLoc} to ${loc}; passedZero: ${passedZero}`);
    }
  }

  return passedZero;
};

run({
  part1: {
    tests: [
      {
        input: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
        expected: 3,
      },
      {
        input: `L50
L100`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
        expected: 6,
      },
      {
        input: `R1000`,
        expected: 10,
      },
      {
        input: `L1000`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: ONLY_TESTS,
});
