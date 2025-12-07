import run from "aocrunner";
const ONLY_TESTS = false;
const DEBUG = true;
const log = (...args: any[]) => DEBUG && console.log.apply(null, args);

const parseInput: (rawInput: string) => (number | string)[][] = (rawInput: string) => rawInput.split('\n').map((row) => row.split(''));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  log(input);

  // We only need to determine:
  // a) how many splitters...
  // b) ...that could possibly be hit = there is a splitter above and to the left or right without a splitter directly above in the space between
  const splitterIdxs: [number, number][] = [];
  input.forEach((row, rowIdx) => row.forEach((cell, colIdx) => {
    if (cell === '^') {
      splitterIdxs.push([rowIdx, colIdx]);
    }
  }));
  log(`splitters: ${JSON.stringify(splitterIdxs)}`);

  let numSplits = 1; // The first splitter directly below the S
  splitterIdxs.forEach(([rowIdx, colIdx]) => {
    // From this splitter, look above it for a splitter with colIdx-1 or colIdx+2
    // EXCEPT when *that* row has a splitter at colIdx
    for (let i = rowIdx-1; i >= 0; i -= 1) {
      if (input[i][colIdx] === '^') {
        // We've hit a row above us with a splitter directly above
        break;
      }
      if (
        (input[i][colIdx-1] === '^' || input[i][colIdx+1] === '^') &&
        input[i][colIdx] !== '^'
      ) {
        // This is an active splitter
        log(`${rowIdx}-${colIdx} encountered a split @ row ${i}`);
        numSplits += 1;
        break;
      }
    }
  });

  return numSplits;
};

type COORD = [number, number];
const evaluateSources: (input: string[][], sources: COORD[]) => COORD[] = (input, sources) => {
  const newSources: COORD[] = [];
  sources.forEach((source) => {
    // Walk from this source till you hit another splitter, then add it's new sources to the array
    const colIdx = source[1];
    let didHitSplitter = false;
    for (let rowIdx = source[0] + 1; rowIdx < input.length; rowIdx += 1) {
      if (input[rowIdx][colIdx] === '^') {
        newSources.push([rowIdx, colIdx-1]); // Left
        newSources.push([rowIdx, colIdx+1]); // Right
        didHitSplitter = true;
        break;
      }
    }
    if (!didHitSplitter) {
      newSources.push(source);
    }
  });
  log(`newSources: ${JSON.stringify(newSources)}`);
  return newSources;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // Process each row
  input[0][input[0].indexOf('S')] = 1;
  log(input[0].join(''));
  for (let rowIdx = 1; rowIdx < input.length; rowIdx += 1) {
    // For each cell in this row that is not a splitter, look above it for a number and copy it down
    for (let colIdx = 0; colIdx < input[rowIdx].length; colIdx += 1) {
      if (
        input[rowIdx][colIdx] !== '^' // This cell isn't a splitter
          && typeof input[rowIdx-1][colIdx] === 'number' // The cell above is a number!
        // && input[rowIdx-1][colIdx] !== '.' // The cell above isn't empty (if there )
        // && input[rowIdx-1][colIdx] !== '^' // The cell above isn't a splitter
        // && input[rowIdx-1][colIdx] > 0 // Really this or the prior two rules are all that's necessary
      ) {
        input[rowIdx][colIdx] = input[rowIdx-1][colIdx];
      }
    }
    // Now, for each cell in this row that IS a splitter, increment its neighbors (if they aren't splitters)
    for (let colIdx = 0; colIdx < input[rowIdx].length; colIdx += 1) {
      if (input[rowIdx][colIdx] === '^') { // This cell IS a splitter
        if (typeof input[rowIdx-1][colIdx] !== 'number') {
          // There is not a number above this splitter, so it is inactive
          continue;
        }
        if (input[rowIdx][colIdx-1] === '.') {
          // the left is empty, so now it's got 1 more beam in it than entered this splitter
          input[rowIdx][colIdx-1] = input[rowIdx-1][colIdx];
        } else if (typeof input[rowIdx][colIdx-1] === 'number') {
          // the left is not a splitter, so it *should* be a number
          (input[rowIdx][colIdx-1] as number) += (input[rowIdx-1][colIdx] as number);
        }
        if (input[rowIdx][colIdx+1] === '.') {
          // the right is empty, so now it's got 1 more beam in it than entered this splitter
          input[rowIdx][colIdx+1] = input[rowIdx-1][colIdx];
        } else if (typeof input[rowIdx][colIdx+1] === 'number') {
          // the right is not a splitter, so it *should* be a number
          (input[rowIdx][colIdx+1] as number) += (input[rowIdx-1][colIdx] as number);
        }
      }
    }
      log(input[rowIdx].map((cell) => {
        if (cell === '.' || cell === '^') return cell.padStart(3, ' ');
        return ("" + (cell as number)).padStart(3, '0');
      }).join(' '));
  }
  return input[input.length-1].reduce((sum, cur) => {
    if (cur !== '.') {
      return (sum as number) + (cur as number);
    }
    return (sum as number);
  }, 0);

  // Naive, OOM
  // const source: COORD = [0, input[0].indexOf('S')];
  // let lastSources;
  // let currentSources = [source];
  // do {
  //   lastSources = currentSources;
  //   currentSources = evaluateSources(input, lastSources);
  //   log(`\t lastSources: ${JSON.stringify(lastSources)}`);
  //   log(`\t currentSources: ${JSON.stringify(currentSources)}`);
  // } while(lastSources.length < currentSources.length)

  // return lastSources.length;
};

run({
  part1: {
    tests: [
      {
        input: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
        expected: 40,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: ONLY_TESTS,
});
// 1748 - high
