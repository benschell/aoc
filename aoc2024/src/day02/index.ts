import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((report) => report.split(" ").map((val) => parseInt(val)))
    .map((report) => {
      return {
        orig: report,
        diff: report.reduce((res, _, idx) => {
          if (idx > 0) {
            return [...res, report[idx - 1] - report[idx]];
          }
          return res;
        }, [] as number[]),
      };
    });

const computeReport = (report: number[]) => {
  return {
    orig: report,
    diff: report.reduce((res, _, idx) => {
      if (idx > 0) {
        return [...res, report[idx - 1] - report[idx]];
      }
      return res;
    }, [] as number[]),
  };
};

const parseInputPartTwo = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((report) => report.split(" ").map((val) => parseInt(val)))
    .map(computeReport);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  log(input);
  return input.reduce((score, { orig, diff }, reportIdx) => {
    if (
      // If abs of all of diff are greater than 0...
      // (all increasing or decreasing)
      // and at the same time, every value is less than 4
      diff.every((val) => {
        const abs = Math.abs(val);
        return abs > 0 && abs < 4;
      }) &&
      // And if all of diff are the same sign...
      (diff.every((val) => val < 0) || diff.every((val) => val > 0))
    ) {
      return score + 1;
    }
    return score;
  }, 0);
};

const checkReport = (diff: number[]) => {
  return (
    // If abs of all of diff are greater than 0...
    // (all increasing or decreasing)
    // and at the same time, every value is less than 4
    diff.every((val, idx) => {
      const abs = Math.abs(val);
      return abs > 0 && abs < 4;
    }) &&
    // And if all of diff are the same sign...
    (diff.every((val) => val < 0) || diff.every((val) => val > 0))
  );
};

const part2 = (rawInput: string) => {
  const input = parseInputPartTwo(rawInput);
  log(input);
  return input.reduce((score, { orig, diff }, reportIdx) => {
    const valid = checkReport(diff)
    if (valid) {
      return score + 1;
    } else {
      // Try computing and checking by removing each one and checking
      log(orig, 'was invalid');
      for (let i=0; i < orig.length; i++) {
        const newOrig = [...orig];
        newOrig.splice(i, 1);
        log('Removing', i, 'so trying:', newOrig);
        const { diff: newDiff } = computeReport(newOrig);
        const newValid = checkReport(newDiff);
        if (newValid) {
          log('Now', newOrig, 'is valid!');
          return score + 1;
        }
      }
    }
    return score;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
