import run from "aocrunner";
const ONLY_TESTS = false;
const DEBUG = false;
const log = (...args: any[]) => DEBUG && console.log.apply(null, args);

const parseInput = (rawInput: string) => rawInput.split(',').map((range) => range.split('-').map((num) => parseInt(num)));

const part1 = (rawInput: string) => {
  const ranges = parseInput(rawInput);
  log(ranges);
  let numInvalid = 0;
  ranges.forEach((range) => {
    // For each number in this range...
    log(`Inspecting range: ${range}`);
    for (let num = range[0]; num <= range[1]; num++) {
      const numAsString = num.toString();

      // If the num has an odd number of digits, it definitely is valid
      if (numAsString.length % 2 === 1) {
        continue;
      }

      // The num has an even number of digits. Split it in half and compare the halves
      const halfway = numAsString.length / 2;
      const firstHalf = numAsString.substring(0, halfway);
      const secondHalf = numAsString.substring(halfway);
      // log(`comparing: ${firstHalf} to ${secondHalf}`);

      if (firstHalf == secondHalf) {
        log(`found one! ${numAsString}`);
        numInvalid += num;
      }
    }
  });
  

  return numInvalid;
};

const part2 = (rawInput: string) => {
  const ranges = parseInput(rawInput);
  log(ranges);
  let numInvalid = 0;
  ranges.forEach((range) => {
    // For each number in this range...
    log(`Inspecting range: ${range}`);
    for (let num = range[0]; num <= range[1]; num++) {
      const numAsString = num.toString();
      if (num === 222222) log(`inspecting: ${numAsString}`);
      const halfway = Math.floor(numAsString.length / 2);
      for (let length = 1; length <= halfway; length += 1) {
        // We're going to divide the string into this many divisions, only if
        // it can be evenly divided into that many divisions
        if (numAsString.length % length === 0) {
          const sections = numAsString.split('').reduce((sections, section) => {
            const lastSection: string | undefined = sections[sections.length-1];
            if (!lastSection) {
              return [...sections, section];
            }
            if (lastSection.length !== length) {
              sections[sections.length-1] += section;
              return sections;
            }
            return [...sections, section];
          }, [] as Array<string>);
          // log(sections);
          if (sections.every((section) => section === sections[0])) {
            log(`found invalid: ${num}`);
            numInvalid += num;
            break;
          }
        }
      }
    }
  });
  

  return numInvalid;
};

run({
  part1: {
    tests: [
      {
        input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`,
        expected: 1227775554,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`,
        expected: 4174379265,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: ONLY_TESTS,
});
