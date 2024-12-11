import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) =>
  rawInput.split(" ").map((num) => parseInt(num));
const doBlinksForNum: (
  num: number,
  blinks: number,
  logPadding: string,
) => number = (num, blinks, lp) => {
  if (blinks === 0) {
    return 1;
  }
  log(`\n${lp}doing ${blinks} blinks for ${num}`);
  const input = [num];
  log(`${lp}input:`, input);
  // for (let i=0; i < blinks; i++) {
  for (let j = 0; j < input.length; j++) {
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

  log(`${lp}with ${blinks - 1} blinks left:`);
  log(`${lp}`, input);
  // }
  const out = doBlinks(input, blinks - 1, `${lp}\t`);
  log(`${lp}returning:`, out, input);
  return out;
};
const priors = new Map<string, number>();
const key = (num: number, blinks: number) => `${num}-${blinks}`;
const doBlinks = (
  input: number[],
  blinks: number,
  logPadding: string,
  shouldLog?: boolean,
) => {
  return input.reduce((score, num) => {
    const k = key(num, blinks);
    const found = priors.has(k);
    // console.log("lookup:", k, priors.has(k), priors.get(k));
    const count = found
      ? priors.get(k)!
      : doBlinksForNum(num, blinks, logPadding);
    if (!found) {
      priors.set(k, count);
    }
    // if (shouldLog) {
    //   console.log(`${logPadding}did blinks for`, num, count);
    // }
    return score + count;
  }, 0);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const blinks = 25;
  log("\n\nstart:", input);
  return doBlinks(input, blinks, "");
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // 40: 22.4 sec
  // 41: 29.1 sec : +  7
  // 42: 43.0 sec : + 21
  // 43: 66.4 sec : + 44
  const blinks = 75;
  return doBlinks(input, blinks, "", true);
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
