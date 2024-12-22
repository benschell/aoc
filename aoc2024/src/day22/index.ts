import run from "aocrunner";

const onlyTests = true;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => rawInput.split("\n").map((num) => BigInt(parseInt(num)));
const sixtyFour = BigInt(64);
const thirtyTwo = BigInt(32);
const twentyFourtyEight = BigInt(2048);
const bigModulo = BigInt(16777216);
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const score = input.reduce((score, secret) => {
    const orig = secret;
    // Convert this buyer 2000 times:
    for (let i=0; i < 2000; i++) {
      // log(`\tStart: ${secret}`);
      secret = ((secret * sixtyFour) ^ secret) % bigModulo;
      // log(`\tFirst: ${secret}`);
      secret = ((secret / thirtyTwo) ^ secret) % bigModulo;
      // log(`\tSecnd: ${secret}`);
      secret = ((secret * twentyFourtyEight) ^ secret) % bigModulo;
      // log(`Secret #${i}: ${secret}`);
    }
    log(`${orig}: ${secret}`);
    return score + secret;
  }, BigInt(0));
  return score.toString();
};

const ten = BigInt(10);
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const score = input.reduce((score, secret) => {
    const orig = secret;
    // Convert this buyer 2000 times:
    const queue: BigInt[] = [orig % ten];
    for (let i=0; i < 2000; i++) {
      // log(`\tStart: ${secret}`);
      secret = ((secret * sixtyFour) ^ secret) % bigModulo;
      // log(`\tFirst: ${secret}`);
      secret = ((secret / thirtyTwo) ^ secret) % bigModulo;
      // log(`\tSecnd: ${secret}`);
      secret = ((secret * twentyFourtyEight) ^ secret) % bigModulo;
      // log(`Secret #${i}: ${secret}`);
      queue.push(secret % ten); // Get the ones digit

      if (queue.length > 5) {
        queue.shift();
      }
      log('inspecting queue:', queue);
      if (i > 3)
        break;
    }
    log(`${orig}: ${secret}`);
    return score + secret;
  }, BigInt(0));
  return score.toString();
};

run({
  part1: {
    tests: [
      {
        input: `123`,
        expected: -1,
      },
      {
        input: `1
10
100
2024`,
        expected: '37327623',
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `123`,
        expected: 23,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
