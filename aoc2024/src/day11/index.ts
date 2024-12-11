import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => rawInput.split(" ").map((num) => parseInt(num));
const doBlinks = (input: number[], blinks: number) => {
  log('start:', input);
  for (let i=0; i < blinks; i++) {
    for (let j=0; j<input.length; j++) {
      const num = input[j];
      const numStr = `${num}`;
      if (num === 0) {
        input[j] = 1;
      } else if (numStr.length % 2 === 0) {
        const half = numStr.length / 2;
        const first = parseInt(numStr.substring(0, half));
        const second = parseInt(numStr.substring(half));
        input.splice(j, 1, first, second);
        j += 1; // we added one item, so we need to move forward
      } else {
        input[j] = num * 2024;
      }
    }

    log(`after ${i+1} blinks:`);
    log(input);
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const blinks = 25;
  doBlinks(input, blinks);

  return input.length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `125 17`,
        expected: 55312,
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
