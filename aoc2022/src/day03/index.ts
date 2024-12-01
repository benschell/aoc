import run from "aocrunner";
import chalk from "chalk";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((row) => [row.slice(0, row.length / 2), row.slice(row.length / 2)]);
const parseInputTwo = (rawInput: string) => rawInput.split("\n");

const onlyTests = false;

const logAndHighlight = (str: string, idx: number) => {
  if (onlyTests) {
    console.log(
      chalk.blue(str.substring(0, idx)) +
        chalk.red(str[idx]) +
        chalk.blue(str.substring(idx + 1)),
    );
  }
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce((score, row) => {
    // Find which char exists in each
    for (let i = 0; i < row[0].length; i++) {
      const char = row[0].charAt(i);
      if (row[1].includes(char)) {
        // This is the one
        // Fun logging:
        const idx = row[1].indexOf(char);
        logAndHighlight(row[0], i);
        logAndHighlight(row[1], idx);

        // Actual solution
        const code = char.charCodeAt(0);
        if (code > 96) {
          // Lowercase
          return score + (code - 96);
        } else if (code > 64) {
          // Uppercase
          return score + 26 + (code - 64);
        }
      }
    }
    return score;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInputTwo(rawInput);
  let score = 0;
  for (let row = 0; row < input.length; row += 3) {
    const first = input[row];
    const second = input[row + 1];
    const third = input[row + 2];

    for (let i = 0; i < first.length; i++) {
      const char = first.charAt(i);
      if (second.includes(char) && third.includes(char)) {
        // Found it!
        logAndHighlight(first, i);
        logAndHighlight(second, second.indexOf(char));
        logAndHighlight(third, third.indexOf(char));

        const code = char.charCodeAt(0);
        if (code > 96) {
          // Lowercase
          score += code - 96;
        } else if (code > 64) {
          // Uppercase
          score += 26 + (code - 64);
        }
        break;
      }
    }
  }

  return score;
};

run({
  part1: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
