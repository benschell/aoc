import run from "aocrunner";
import { iterateOnRows, LogFunc } from "../utils/map.js";
import { question, close } from "../utils/index.js";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  const parts = rawInput.split("\n\n");
  const map = parts[0].split("\n").map((row) => row.split(""));
  const robot: Point = { x: -1, y: -1 };
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map.length; x++) {
      if (map[y][x] === ROBOT) {
        robot.x = x;
        robot.y = y;
        map[y][x] = '.';
        break;
      }
    }
    if (robot.x > -1) {
      break;
    }
  }
  const dirs = parts[1].split("");
  return { map, dirs, robot };
};
type Point = {
  x: number;
  y: number;
};
const BOX = "O";
const ROBOT = "@";
const EMPTY = ".";
const WALL = "#";
export const printMap = (
  map: string[][],
  log: LogFunc,
  robot: Point,
) => {
  iterateOnRows(map, (row, y) => {
    let visitedRow = "";
    for (let x = 0; x < row.length; x++) {
      if (y === robot.y && x === robot.x) {
        visitedRow += ROBOT;
      } else {
        visitedRow += row[x];
      }
    }
    log(visitedRow);
    return { break: false };
  });
};

const canMove: (
  map: string[][],
  prop: "x" | "y",
  start: number,
  limit: number,
  shouldDec: boolean,
  otherVal: number,
) => boolean = (map, prop, start, limit, shouldDec, otherVal) => {
  for (
    let i = start;
    shouldDec ? i > limit : i < limit;
    shouldDec ? i-- : i++
  ) {
    const point = prop === "y" ? map[i][otherVal] : map[otherVal][i];
    if (point === "#") {
      return false;
    }
    if (point === ".") {
      return true;
    }
  }
  return false;
};

const moveBoxesAndRobot: (
  map: string[][],
  prop: "x" | "y",
  robot: Point,
  shouldDec: boolean,
) => void = (map, prop, robot, shouldDec) => {
  let emptySpot: Point = { x: -1, y: -1 };
  let boxes: Point[] = [];
  for (
    let i = robot[prop] + (shouldDec ? -1 : 1);
    shouldDec ? i >= 0 : i < (prop === "y" ? map.length : map[robot.y].length);
    shouldDec ? i-- : i++
  ) {
    const point = prop === "y" ? map[i][robot.x] : map[robot.y][i];
    if (point === WALL) {
      // We've hit a wall
      break;
    } else if (point === BOX) {
      const boxPoint = {
        x: prop === "x" ? i : robot.x,
        y: prop === "y" ? i : robot.y,
      };
      boxes.push(boxPoint);
    } else if (point === EMPTY) {
      // We've found the empty spot
      emptySpot.x = prop === "x" ? i : robot.x;
      emptySpot.y = prop === "y" ? i : robot.y;
      break;
    }
  }

  log("found empty spot to move boxes @ ", emptySpot);
  log("found boxes:", boxes);
  boxes.reverse(); // Do them last to first
  boxes.forEach((boxPoint) => {
    // Move the box in the correct direction
    const { x, y } = boxPoint;
    if (prop === "y") {
      if (shouldDec) {
        // Move the box up
        if (map[y - 1][x] != EMPTY) {
          throw new Error(
            `Cannot move box ${x},${y} to a non-empty space (${map[y - 1][x]})`,
          );
        }
        map[y - 1][x] = BOX;
        map[y][x] = EMPTY;
      } else {
        // Move the box down
        if (map[y + 1][x] != EMPTY) {
          throw new Error(
            `Cannot move box ${x},${y} to a non-empty space (${map[y + 1][x]})`,
          );
        }
        map[y + 1][x] = BOX;
        map[y][x] = EMPTY;
      }
    } else {
      if (shouldDec) {
        // Move the box left
        if (map[y][x - 1] != EMPTY) {
          throw new Error(
            `Cannot move box ${x},${y} to a non-empty space (${map[y][x - 1]})`,
          );
        }
        map[y][x - 1] = BOX;
        map[y][x] = EMPTY;
      } else {
        // Move the box right
        if (map[y][x + 1] != EMPTY) {
          throw new Error(
            `Cannot move box ${x},${y} to a non-empty space (${map[y][x + 1]})`,
          );
        }
        map[y][x + 1] = BOX;
        map[y][x] = EMPTY;
      }
    }
  });

  if (prop === "y") {
    robot.y += shouldDec ? -1 : 1;
  } else {
    robot.x += shouldDec ? -1 : 1;
  }
  log("moved robot:", robot);
};

const part1 = async (rawInput: string) => {
  const { map, dirs, robot } = parseInput(rawInput);
  printMap(map, log, robot);
  log(robot);

  const doQuestion = false;
  for (let i = 0; i < dirs.length; i++) {

    const dir = dirs[i];
    log("moving:", dir);
    // Check whether the robot can move
    let moveable = false;
    if (dir === "^") {
      // Look to see if there is an empty space in this direction
      moveable = canMove(map, "y", robot.y - 1, 0, true, robot.x);
      moveable && moveBoxesAndRobot(map, "y", robot, true);
    } else if (dir === "v") {
      // Look to see if there is an empty space in this direction
      moveable = canMove(map, "y", robot.y + 1, map.length, false, robot.x);
      moveable && moveBoxesAndRobot(map, "y", robot, false);
    } else if (dir === "<") {
      // Look to see if there is an empty space in this direction
      moveable = canMove(map, "x", robot.x - 1, 0, true, robot.y);
      moveable && moveBoxesAndRobot(map, "x", robot, true);
    } else if (dir === ">") {
      // Look to see if there is an empty space in this direction
      moveable = canMove(
        map,
        "x",
        robot.x + 1,
        map[robot.y].length,
        false,
        robot.y,
      );
      moveable && moveBoxesAndRobot(map, "x", robot, false);
    } else {
      log(`NOT MOVEABLE ${dir}`);
    }

    // The robot can move, so move any boxes adjacent to the robot

    if (doQuestion) {
      printMap(map, log, robot);
      log(robot);
      const proceed = await question("Proceed?");
      if (proceed === "n") {
        break;
      }
    }
  }
  close();
  printMap(map, log, robot);
  log(robot);

  return map.reduce((score, row, y) => {
    return row.reduce((score, cell, x) => {
      if (cell === BOX) {
        return score + (100 * y) + x;
      }
      return score;
    }, score);
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
        input: `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`,
        expected: 2028,
      },
      //       {
      //         input: `##########
      // #..O..O.O#
      // #......O.#
      // #.OO..O.O#
      // #..O@..O.#
      // #O#..O...#
      // #O..O..O.#
      // #.OO.O.OO#
      // #....O...#
      // ##########

      // <vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
      // vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
      // ><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
      // <<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
      // ^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
      // ^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
      // >^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
      // <><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
      // ^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
      // v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
      //         expected: 10092,
      //       },
    ],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
