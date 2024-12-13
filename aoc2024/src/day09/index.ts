import run from "aocrunner";

const onlyTests = true;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) =>
  rawInput.split("").map((num) => parseInt(num));

const part1 = (rawInput: string) => {
  // const nums = parseInput(rawInput);
  // let score = 0;
  // let fileId = 0;
  // let index = 0;
  // let lastFileId = Math.floor(nums.length / 2);
  // log(`last file id: ${lastFileId} @ ${nums.length - 1}`);
  // while (true) {
  //   if (!nums.length) {
  //     break;
  //   }
  //   // Take off the first number (a file)
  //   const file = nums.shift()!;
  //   // Add this file to the score
  //   for (let i = 0; i < file; i++) {
  //     log(`incrementing score by: ${index} * ${fileId} = ${index * fileId}`);
  //     score += index * fileId;
  //     index += 1;
  //   }
  //   fileId += 1;
  //   if (!nums.length) {
  //     break;
  //   }
  //   const free = nums.shift()!;
  //   log("handling free space:", free);
  //   for (let i = 0; i < free; i++) {
  //     // Take from the last file
  //     if (nums[nums.length - 1] === 0) {
  //       // This file has been emptied.
  //       // Pop it and the free space before it.
  //       // Pop the file
  //       nums.pop();
  //       // Pop the free space
  //       nums.pop();
  //       // Decrement the lastFileId
  //       // (we're moving on to the next earlier file)
  //       lastFileId -= 1;
  //     }
  //     if (lastFileId <= fileId) {
  //       break;
  //     }
  //     // Take from the last file
  //     log(
  //       `incrementing score by: ${index} * ${lastFileId} = ${
  //         index * lastFileId
  //       }`,
  //     );
  //     score += index * lastFileId;
  //     index += 1;
  //     nums[nums.length - 1] -= 1;
  //   }
  // }
  // return score;
};

const part2 = (rawInput: string) => {
  const nums = parseInput(rawInput);
  let lastFileId = Math.floor(nums.length / 2);
  const fileIndexes = new Set<number>();
  for (
    let lastFileIndex = nums.length - 1;
    lastFileIndex > 0;
    lastFileIndex -= 2
  ) {
    log(`examining file @ ${lastFileId}: ${nums[lastFileIndex]}`);
    // Find index of first entry in nums that == nums[lastFileIndex]
    log(nums);
    const idx = nums.findIndex(
      (num, idx) =>
        idx % 2 === 0 && num === nums[lastFileIndex] && !fileIndexes.has(idx),
    );
    if (idx !== -1) {
      log(`\t moving ${lastFileId} to ${idx}`);
      // Move this to this location!
      nums[idx] = lastFileId;
      fileIndexes.add(idx);
    }
    lastFileId -= 1;
  }
  let score = 0;
  return score;
};

run({
  part1: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 1928,
        // expected: "0099811188827773336446555566",
      },
      {
        input: `2333133121484131402`,
        expected: 1928,
        // expected: "0099811188827773336446555566",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 2858,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
