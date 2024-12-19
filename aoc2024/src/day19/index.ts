import run from "aocrunner";

const onlyTests = true;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  const parts = rawInput.split("\n\n");
  const types = parts[0].split(', ');
  const combos = parts[1].split('\n');
  return { types , combos };
}

const checkCombo: (combo: string, types: string[]) => boolean = (combo, types) => {
  // log(`Checking ${combo} against ${types.join(', ')}`);
  // Find all types that the combo starts with
  const candidates = types.filter((type) => combo.startsWith(type));
  // Try removing each of these types and seeing what happens
  for ( const candidate of candidates ){ 
    // log('candidate:', candidate);
    if (candidate === combo) {
      return true;
    }
    if (checkCombo(combo.substring(candidate.length), types)) {
      return true;
    }
  }
  return false;
}

const part1 = (rawInput: string) => {
  const { types, combos } = parseInput(rawInput);
  log(types);
  log(combos);

  return combos.reduce((score, combo) => {
    const ret = checkCombo(combo, types);
    log(`for ${combo} and ${types.join(',')}, was there a solution? ${ret}`)
    if (ret) { 
      return score + 1;
    }
    return score;
  }, 0);
};

const resultCache = new Map<string, number>();
const checkComboPartTwo: (combo: string, types: string[]) => number = (combo, types) => {
  log(`Checking ${combo} against ${types.length > 0 && types.join(', ')}`);
  if (resultCache.has(combo)) {
    log('\t\treturning from cache', combo, resultCache.get(combo));
    return resultCache.get(combo)!;
  }
  // Find all types that the combo starts with
  const candidates = types.filter((type) => combo.startsWith(type));
  log(`\t${combo} starts with: ${candidates.join(',')}`);
  // Try removing each of these types and seeing what happens
  let count = 0;
  for ( const candidate of candidates ){ 
    log('\tcandidate:', candidate);
    if (candidate === combo) {
      log('\t\tincrementing count', combo);
      count += 1;
    } else {
      log('\t\trecursing', combo, candidate);
      count += checkComboPartTwo(combo.substring(candidate.length), types);
    }
  }
  resultCache.set(combo, count);
  log('\t\treturning', combo, count);
  return count;
}

const part2 = (rawInput: string) => {
  const { types, combos } = parseInput(rawInput);
  log(types);
  log(combos);

  return combos.reduce((score, combo, idx) => {
    // if (idx > 1) return score;
    log('\n');
    const ret = checkComboPartTwo(combo, types);
    log(`for ${combo} and ${types.join(',')}, how many solutions? ${ret}`)
    return score + ret;
  }, 0);
};

run({
  part1: {
    tests: [
//       {
//         input: `r, wr, b, g, bwu, rb, gb, br

// brwrr
// bggr
// gbbr
// rrbgbr
// ubwu
// bwurrg
// brgr
// bbrgwb`,
//         expected: 6,
//       },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
        expected: 16,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
