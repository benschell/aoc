import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  const parts = rawInput.split("\n\n");
  const rules = parts[0]
    .split("\n")
    .map((rule) => rule.split("|").map((num) => parseInt(num)));
  const updates = parts[1]
    .split("\n")
    .map((update) => update.split(",").map((num) => parseInt(num)));
  return {
    rules,
    updates,
  };
};

const part1 = (rawInput: string) => {
  const { rules, updates } = parseInput(rawInput);

  return updates.reduce((score, update) => {
    // Iterate over the rules to make sure this update complies
    if (
      rules.every((rule) => {
        const earlierIdx = update.indexOf(rule[0]);
        const laterIdx = update.indexOf(rule[1]);
        if (earlierIdx === -1 || laterIdx === -1) {
          // One of the numbers from the rule is not in this update
          // So it complies with this rule!
          return true;
        }
        return earlierIdx < laterIdx;
      })
    ) {
      return score + update[Math.floor(update.length / 2)];
    }
    return score;
  }, 0);
};

const part2 = (rawInput: string) => {
  const { rules, updates } = parseInput(rawInput);

  const validate = (update: number[]) => {
    return rules.every((rule) => {
      const earlierIdx = update.indexOf(rule[0]);
      const laterIdx = update.indexOf(rule[1]);
      if (earlierIdx === -1 || laterIdx === -1) {
        // One of the numbers from the rule is not in this update
        // So it complies with this rule!
        return true;
      }
      return earlierIdx < laterIdx;
    });
  };

  return updates.reduce((score, update) => {
    // Iterate over the rules to make sure this update complies
    if (!validate(update)) {
      while (!validate(update)) {
        // Reorder this update and determine the score
        let i = 1;
        for (let i = 1; i < update.length; i++) {
          log("\nThis update is out of order:", update, i);
          let j = i;
          for (let j = i-1; j >= 0; j--) {
            log("\tcomparing:", update[j], update[i]);
            // Find a rule that pertains to update[i] and update[j]
            const rule = rules.find(
              (rule) =>
                (rule[0] === update[i] && rule[1] === update[j]) ||
                (rule[0] === update[j] && rule[1] === update[i]),
            );
            if (rule) {
              // If update[j] should be AFTER update[i]:
              // rule[0] should be before rule[1];
              if (rule[0] === update[i] && rule[1] === update[j]) {
                log("should swap", update[i], update[j], "due to", rule);
                const prior = update[j];
                update[j] = update[i];
                update[i] = prior;
                if (validate(update)) {
                  break;
                }
              }
              if (rule[1] === update[i] && rule[0] === update[j]) {
                log("already in order!", update[i], update[j], "via", rule);
              }
              // const earlierIdx = update.indexOf(rule[0]);
              // const laterIdx = update.indexOf(rule[1]);
              // if (earlierIdx === -1 || laterIdx === -1) {
              //   // One of the numbers from the rule is not in this update
              //   // So it complies with this rule!
              //   return true;
              // }
              // return earlierIdx < laterIdx;
            }
          }

          if (validate(update)) {
            break;
          }
        }
        log('\t re-running sort!', update);
      }
      log('\t\t finished sorting:', update);

      return score + update[Math.floor(update.length / 2)];
    }
    return score;
  }, 0);
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
/*
*/
        expected: 123,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
