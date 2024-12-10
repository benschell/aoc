import run from "aocrunner";

const onlyTests = true;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

// enum Type {
//   FILE = "FILE",
//   FREE = "FREE",
// };
// type Entry = {
//   num: number;
//   type: Type;
// };
// const parseInput = (rawInput: string): { nums: Entry[] } => {
//   const nums = rawInput.split('').map((numStr, idx) => {
//     const num = parseInt(numStr);
//     if (idx % 2 === 1){
//       // Odd = free space
//       return {
//         type: Type.FREE,
//         num,
//       }
//     } else {
//       // Even = file
//       return {
//         type: Type.FILE,
//         num,
//       }
//     }
//   });
//   return { nums, }
// }
// const printNums = (nums: Entry[]) => {
//   let out = '';
//   let fileCount = 0;
//   nums.forEach((entry) => {
//     let char = '.';
//     if (entry.type === Type.FILE) {
//       char = ''+fileCount++;
//     }
//     for (let i=0; i<entry.num; i++) {
//       out += char;
//     }
//   });
//   log(out);
// };
const parseInput = (rawInput: string) =>
  rawInput.split("").map((num) => parseInt(num));

const part1 = (rawInput: string) => {
  const nums = parseInput(rawInput);
  log(nums);
  let lastFileNum = (nums.length - 1) / 2;
  let lastFile = nums.length - 1;
  let score = 0;
  let out = "";
  let fileNum = 0;
  for (let i = 0; i < nums.length; i++) {
    // log('lastFile', lastFileNum, lastFile);
    // log('current:', out);
    // log('total:', nums.reduce((out, num) => out += num, ''));
    if (i % 2 === 1) {
      // Odd, so a free space
      // Fill this free space with items from the end
      for (let j = 0; j < nums[i]; j++) {
        // Find a file from the end to fill with
        while (nums[lastFile] === 0) {
          // Move to an earlier file
          lastFile -= 2;
          lastFileNum--;
        }
        if (nums[lastFile] > 0) {
          log("filling with:", lastFileNum, nums[lastFile]);
          nums[lastFile]--;
          log("adding to score:", out.length, lastFileNum, lastFileNum * out.length);
          score += lastFileNum * out.length;
          out += lastFileNum;
        }
      }
    } else {
      log("file!", i, nums[i]);
      // Even, so a file
      for (let j = 0; j < nums[i]; j++) {
        log("adding to score 2:", out.length, fileNum, fileNum * out.length);
        score += fileNum * out.length;
        out += fileNum;
      }
      fileNum++;
    }
    if (lastFile <= i) break;
  }
  log(out);

  // if (onlyTests) {
  //   return out;
  // }
  return score;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 1928,
        // expected: "0099811188827773336446555566",
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
