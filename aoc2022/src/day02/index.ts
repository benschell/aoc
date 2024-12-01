import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((row) => row.split(" "));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // A = X = Rock = 1
  // B = Y = Paper = 2
  // C = Z = Scissors = 3
  return input.reduce((score, row) => {
    if (row[1] == "X") {
      score += 1; // Rock
      if (row[0] == "A") {
        score += 3; // Draw
      } else if (row[0] == "B") {
        score += 0; // Loss
      } else if (row[0] == "C") {
        score += 6; // Win
      }
    } else if (row[1] == "Y") {
      score += 2;
      if (row[0] == "A") {
        score += 6; // Win
      } else if (row[0] == "B") {
        score += 3; // Draw
      } else if (row[0] == "C") {
        score += 0; // Loss
      }
    } else if (row[1] == "Z") {
      score += 3;
      if (row[0] == "A") {
        score += 0; // Loss
      } else if (row[0] == "B") {
        score += 6; // Win
      } else if (row[0] == "C") {
        score += 3; // Draw
      }
    } else {
      console.log("Error occured in our scoring:", row);
    }
    return score;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  // A = Rock = 1
  // B = Paper = 2
  // C = Scissors = 3
  // X = Loss
  // Y = Draw
  // Z = Win
  return input.reduce((score, row) => {
    if (row[1] == "X") {
      // Loss
      if (row[0] == "A") {
        score += 3; // Scissors
      } else if (row[0] == "B") {
        score += 1; // Rock
      } else if (row[0] == "C") {
        score += 2; // Paper
      }
    } else if (row[1] == "Y") {
      // Draw
      score += 3;
      if (row[0] == "A") {
        score += 1; // Rock
      } else if (row[0] == "B") {
        score += 2; // Paper
      } else if (row[0] == "C") {
        score += 3; // Scissors
      }
    } else if (row[1] == "Z") {
      // Win
      score += 6;
      if (row[0] == "A") {
        score += 2; // Paper
      } else if (row[0] == "B") {
        score += 3; // Scissors
      } else if (row[0] == "C") {
        score += 1; // Rock
      }
    } else {
      console.log("Error occured in our scoring:", row);
    }
    return score;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `A Y
B X
C Z`,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `A Y
B X
C Z`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
