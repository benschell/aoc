import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

type Point = {
  x: number;
  y: number;
}
type ClawMachine = {
  a: Point;
  b: Point;
  prize: Point;
}

const parseInput = (rawInput: string): ClawMachine[] =>
  rawInput.split("\n\n").map((section) => {
    const lines = section.split("\n");
    const a = lines[0]
      .split(": ")[1]
      .split(", ")
      .map((part) => parseInt(part.split("+")[1]));
    const b = lines[1]
      .split(": ")[1]
      .split(", ")
      .map((part) => parseInt(part.split("+")[1]));
      const prize = lines[2]
        .split(": ")[1]
        .split(", ")
        .map((part) => parseInt(part.split("=")[1]));
    return {
      a: {
        x: a[0],
        y: a[1],
      },
      b: {
        x: b[0],
        y: b[1],
      },
      prize: {
        x: prize[0],
        y: prize[1],
      },
    };
  });

/**
 * (ax * 3 * a) + (bx * b) = out
 * // Find the minimum a value
 *              (yout * bx) - (xout * by)
 * A tokens = ---------------------------
 *                (ay * bx) - (ax * by)
 *
 *
 * (ax * aTokens) + (bx * bTokens) = xout;
 *              xout - (ax * aTokens)
 * B tokens = ------------------------
 *                    bx
 */
const solve = (input: ClawMachine[]) => {
  return input.reduce((score, cm, idx) => {
    const { a, b, prize} = cm;
    const num = ((prize.y * b.x) - (prize.x * b.y));
    const denom = (a.y * b.x) - (a.x * b.y);
    const aTokens = num / denom;
    if (Number.isInteger(aTokens)) {
      log(`Machine ${idx} returns an integer! ${aTokens}`);
      const bTokens = (prize.x - (a.x * aTokens)) / b.x;
      if (Number.isInteger(bTokens)) {
        const cost = aTokens * 3 + bTokens;
        log(`Computed token counts: a=${aTokens}, b=${bTokens} => cost=${cost}`)
        return score + cost;
      }
    }
    return score;
  }, 0);
}
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return solve(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  input.forEach((cm) => {
    cm.prize.x += 10000000000000;
    cm.prize.y += 10000000000000;
  });

  return solve(input);
};

run({
  part1: {
    tests: [
      {
        input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
        expected: 480,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
        expected: 875318608908,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
