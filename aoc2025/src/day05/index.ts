import run from "aocrunner";
const ONLY_TESTS = false;
const DEBUG = true;
const log = (...args: any[]) => DEBUG && console.log.apply(null, args);

const parseInput = (rawInput: string) => {
  const sections = rawInput.split('\n\n');
  const ranges = sections[0].split('\n').map((range) => range.split('-').map((num) => parseInt(num)));
  const ingredients = sections[1].split('\n').map((num) => parseInt(num));
  return {ranges, ingredients};
}

const part1 = (rawInput: string) => {
  const { ranges, ingredients } = parseInput(rawInput);
  log(ranges);

  let numFresh = 0;
  ingredients.forEach((ingredient) => {
    log(`Looking for ${ingredient}`);
    for (let i = 0; i < ranges.length; i += 1) {
      if (ingredient >= ranges[i][0] && ingredient <= ranges[i][1]) {
        log(`\tFound! ${ingredient} in ${ranges[i].join('-')}`);
        numFresh += 1;
        break;
      }
    }
  })

  return numFresh;
};

const part2 = (rawInput: string) => {
  const { ranges } = parseInput(rawInput);

  let rangeCandidates = ranges;
  while (true) {
    rangeCandidates.sort((a, b) => b[0] - a[0]);
    // We only need to compile the ranges
    const compiledRanges: number[][] = [];
    rangeCandidates.forEach((range) => {
      // Determine if this range overlaps any known ranges
      let overlaps = false;
      for (let i = 0; i < compiledRanges.length; i += 1) {
        if (
          // The start of our range is smaller or equal to the start of the candidate
          range[0] <= compiledRanges[i][0] && 
          // The end of our range is larger or equal to the end of the candidate
          range[1] >= compiledRanges[i][1]
        ) {
          // This range full encompases the existing range
          // We should replace the existing range with this new range.
          compiledRanges[i][0] = range[0];
          compiledRanges[i][1] = range[1];
          log(`continuing! ${range.join('-')} to ${compiledRanges[i].join('-')}`);
          overlaps = true;
          break;
        }
        if (
          // The start of our range is larger or equal to the start of the candidate
          range[0] >= compiledRanges[i][0] && 
          // The start of our range is smaller or equal to the end of the candidate
          range[0] <= compiledRanges[i][1] &&
          // The end of our range is smaller or equal to the end of the candidate
          range[1] <= compiledRanges[i][1]
        ) {
          // This range is included in an existing compiled range. We can drop this range altogether.
          log(`continuing! ${range.join('-')} to ${compiledRanges[i].join('-')}`);
          overlaps = true;
          break;
        }
        if (
          // The start of our range is larger or equal to the start of the candidate
          range[0] >= compiledRanges[i][0] && 
          // The start of our range is smaller or equal to the end of the candidate
          range[0] <= compiledRanges[i][1] &&
          // The end of our range is larger than the end of the candidate
          range[1] > compiledRanges[i][1]
        ) {
          // The beginning of this range overlaps an existing compiled range and extends
          // past the end of it. So, we need to lengthen the compiled range to match this.
          compiledRanges[i][1] = range[1];
          overlaps = true;
          break;
        }

        if (
          // The end of our range is larger or equal to the start of the candidate
          range[1] >= compiledRanges[i][0] && 
          // The end of our range is smaller or equal to the end of the candidate
          range[0] <= compiledRanges[i][1] &&
          // The start of our range is smaller than the start of the candidate
          range[0] < compiledRanges[i][0]
        ) {
          // The end of this range overlaps an existing compiled range and extends
          // before the start of it. So, we need to lengthen the compiled range to match this.
          compiledRanges[i][0] = range[0];
          overlaps = true;
          break;
        }
      }
      if (!overlaps) {
        // We did not find an existing compiledRange that this range overlaps. So, let's add to the compiled ranges
        compiledRanges.push(range);
      }
    });
    log(compiledRanges);

    if (rangeCandidates.length === compiledRanges.length) {
      // We made no changes compared to the candidates, so we're done!
      break;
    }
    // Move our current result to the candidates var for the next iteration.
    rangeCandidates = compiledRanges;
  }

  // We have all the possible candidates. So, let's count how many ingredients we have
  let numFresh = 0;
  rangeCandidates.forEach((range) => {
    numFresh += range[1] - range[0] + 1;
  })

  return numFresh;
};

run({
  part1: {
    tests: [
      {
        input: `3-5
10-14
16-20
12-18

1
5
8
11
17
32`,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `3-5
10-14
16-20
12-18

1
5
8
11
17
32`,
        expected: 14,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: ONLY_TESTS,
});
// 376634932350765 - high
// 356027961499170 - high
// 334617489365997 - low