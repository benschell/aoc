import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  const parts = rawInput.split("\n\n");
  const rules = parts[0].split("\n").map((rule) => rule.split("|").map((num) => parseInt(num)));
  const updates = parts[1].split("\n").map((update) => update.split(",").map((num) => parseInt(num)));
  return {
    rules,
    updates,
  };
};

const part1 = (rawInput: string) => {
  const { rules, updates } = parseInput(rawInput);

  return updates.reduce((score, update) => {
    // Iterate over the rules to make sure this update complies
    if (rules.every((rule) => {
      const earlierIdx = update.indexOf(rule[0]);
      const laterIdx = update.indexOf(rule[1]);
      if (earlierIdx === -1 || laterIdx === -1) {
        // One of the numbers from the rule is not in this update
        // So it complies with this rule!
        return true;
      }
      return earlierIdx < laterIdx;
    })) {
      return score + update[Math.floor(update.length / 2)];
    }
    return score;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 143,
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
