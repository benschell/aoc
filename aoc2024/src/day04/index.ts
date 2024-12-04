import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => rawInput.split("\n");

const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const masDirections = ["SE", "SW", "NE", "NW"];
type Direction = (typeof directions)[number];
type MASDirection = (typeof masDirections)[number];
const incrementOnDirection = (x: number, y: number, direction: Direction) => {
  let newX = x;
  let newY = y;
  if (direction == "N" || direction == "NE" || direction == "NW") {
    newY -= 1;
  }
  if (direction == "S" || direction == "SE" || direction == "SW") {
    newY += 1;
  }
  if (direction == "E" || direction == "NE" || direction == "SE") {
    newX += 1;
  }
  if (direction == "W" || direction == "NW" || direction == "SW") {
    newX -= 1;
  }
  return {
    x: newX,
    y: newY,
  };
};
const findXmas = (
  input: string[],
  x: number,
  y: number,
  direction: Direction,
  visited: boolean[][],
) => {
  if (
    y < 0 ||
    y >= input.length ||
    x < 0 ||
    x >= input[y].length ||
    input[y][x] !== "X"
  )
    return false;
  let { x: xm, y: ym } = incrementOnDirection(x, y, direction);
  // log(`considering ${xm},${ym} for M`);
  if (
    ym < 0 ||
    ym >= input.length ||
    xm < 0 ||
    xm >= input[ym].length ||
    input[ym][xm] !== "M"
  )
    return false;
  let { x: xa, y: ya } = incrementOnDirection(xm, ym, direction);
  // log(`considering ${xa},${ya} for A`);
  if (
    ya < 0 ||
    ya >= input.length ||
    xa < 0 ||
    xa >= input[ya].length ||
    input[ya][xa] !== "A"
  )
    return false;
  let { x: xs, y: ys } = incrementOnDirection(xa, ya, direction);
  // log(`considering ${xs},${ys} for S`);
  if (
    ys < 0 ||
    ys >= input.length ||
    xs < 0 ||
    xs >= input[ys].length ||
    input[ys][xs] !== "S"
  )
    return false;

  visited[y][x] = true;
  visited[ym][xm] = true;
  visited[ya][xa] = true;
  visited[ys][xs] = true;

  log(`Found XMAS Starting at ${x},${y} and towards ${direction}`);
  return true;
};
const findMAS = (
  input: string[],
  xm: number,
  ym: number,
  direction: MASDirection,
  visited: boolean[][],
) => {
  // log(`considering ${xm},${ym} for M`);
  if (
    ym < 0 ||
    ym >= input.length ||
    xm < 0 ||
    xm >= input[ym].length ||
    input[ym][xm] !== "M"
  )
    return false;
  let { x: xa, y: ya } = incrementOnDirection(xm, ym, direction);
  // log(`considering ${xa},${ya} for A`);
  if (
    ya < 0 ||
    ya >= input.length ||
    xa < 0 ||
    xa >= input[ya].length ||
    input[ya][xa] !== "A"
  )
    return false;
  let { x: xs, y: ys } = incrementOnDirection(xa, ya, direction);
  // log(`considering ${xs},${ys} for S`);
  if (
    ys < 0 ||
    ys >= input.length ||
    xs < 0 ||
    xs >= input[ys].length ||
    input[ys][xs] !== "S"
  )
    return false;

  visited[ym][xm] = true;
  visited[ya][xa] = true;
  visited[ys][xs] = true;

  log(`Found MAS Starting at ${xm},${ym} and towards ${direction}`);
  return true;
};

const part1 = (rawInput: string) => {
  log(rawInput);
  const input = parseInput(rawInput);
  const visited = input.map((row) => row.split("").map(() => false));
  let score = 0;
  input.forEach((row, y) => {
    let x = -2;
    log("considering row:", row);
    while ((x = row.indexOf("X", x + 1)) !== -1) {
      log(`X @ ${x} in ${row}`);
      directions.forEach((dir) => {
        if (findXmas(input, x, y, dir, visited)) {
          score += 1;
        }
      });
    }
  });

  log("\n result");
  for (let y = 0; y < input.length; y++) {
    let row = "";
    for (let x = 0; x < input[y].length; x++) {
      row += visited[y][x] ? input[y][x] : ".";
    }
    log(row);
  }

  return score;
};

const part2 = (rawInput: string) => {
  log(rawInput);
  const input = parseInput(rawInput);
  const visited = input.map((row) => row.split("").map(() => false));
  let mases: { x: number; y: number; dir: MASDirection }[] = [];
  input.forEach((row, y) => {
    let x = -2;
    log("considering row:", row);
    while ((x = row.indexOf("M", x + 1)) !== -1) {
      log(`M @ ${x} in ${row}`);
      masDirections.forEach((dir) => {
        if (findMAS(input, x, y, dir, visited)) {
          mases.push({ x, y, dir });
        }
      });
    }
  });
  let score = mases.reduce((count, mas) => {
    const { x, y, dir } = mas;
    if (dir === "SE" && mases.filter((mas) => mas.x === x + 2 && mas.y === y && mas.dir === "SW").length) {
      log(`${x},${y} @ ${dir} : Found a pair MAS going SW!`);
      count += 1;
    }
    if (dir === "SE" && mases.filter((mas) => mas.y === y + 2 && mas.x === x && mas.dir === "NE").length) {
      log(`${x},${y} @ ${dir} : Found a pair MAS going NE!`);
      count += 1;
    }
    if (dir === "NW" && mases.filter((mas) => mas.x === x - 2 && mas.y === y && mas.dir === "NE").length) {
      log(`${x},${y} @ ${dir} : Found a pair MAS going SW!`);
      count += 1;
    }
    if (dir === "NW" && mases.filter((mas) => mas.y === y - 2 && mas.x === x && mas.dir === "SW").length) {
      log(`${x},${y} @ ${dir} : Found a pair MAS going NE!`);
      count += 1;
    }
    return count;
  }, 0);
  log("\n", mases);

  log("\n result");
  for (let y = 0; y < input.length; y++) {
    let row = "";
    for (let x = 0; x < input[y].length; x++) {
      row += visited[y][x] ? input[y][x] : ".";
    }
    log(row);
  }

  return score;
};

run({
  part1: {
    tests: [
      {
        input: `..X...
.SAMX.
.A..A.
XMAS.S
.X....`,
        expected: 4,
      },
      {
        input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 9,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
