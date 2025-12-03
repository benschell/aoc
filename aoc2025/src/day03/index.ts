import run from "aocrunner";
const ONLY_TESTS = false;
const DEBUG = false;
const log = (...args: any[]) => DEBUG && console.log.apply(null, args);

const parseInput = (rawInput: string) => rawInput.split('\n').map((row) => row.split('').map((num) => parseInt(num)));

type SLOT = {value: number; index: number};
const findLargest: (bank: number[]) => SLOT = (bank) => {
  let largest = {value: 0, index: 0};
  bank.forEach((num, idx) => {
    if (num > largest.value) {
      largest.value = num;
      largest.index = idx;
    }
  })
  return largest;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let sum = 0;
  input.forEach((bank) => {
    let first: SLOT, second: SLOT;
    // Find the largest number in the whole bank
    const largest = findLargest(bank);
    if (largest.index === bank.length -1) {
      // This is the odd case where the largest number is in the last position. So, that number should be in the second position.
      second = largest;
      // Then, let's look through everything but the last position for the first position
      first = findLargest(bank.slice(0, -1));
    } else {
      // The largest number was not in the last position. So, let's look in the remaining items for the next largest
      first = largest;
      second = findLargest(bank.slice(first.index+1));
    }
    log(`For ${bank.join('')}, found ${first.value}${second.value}`);
    sum += parseInt(`${first.value}${second.value}`);
  });
  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let sum = 0;
  input.forEach((bank) => {
    let originalBank = bank.concat([]);
    // Prune the smallest item starting at the start of the array until the size is down to 12 digits
    let iters = 0;
    while (bank.length > 12) {
      let idx = 0;
      while (idx < bank.length) {
        if (bank[idx] < bank[idx+1]) {
          // We should prune this number
          bank.splice(idx, 1);
          break;
        }
        idx += 1;
        if (idx === bank.length - 1) {
          // We got to the last number, so let's just prune it
          bank.splice(idx, 1);
          break;
        }
      }
    }
    log(`For ${originalBank.join('')}, got ${bank.join('')}`);
    sum += parseInt(bank.join(''));
  });
  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `987654321111111
811111111111119
234234234234278
818181911112111`,
        expected: 357,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `234234234234278`,
        expected: 434234234278,
      },
      {
        input: `818181911112111`,
        expected: 888911112111,
      },
      {
        input: `987654321111111
811111111111119
234234234234278
818181911112111`,
        expected: 3121910778619,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: ONLY_TESTS,
});
