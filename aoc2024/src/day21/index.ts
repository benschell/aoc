import run from "aocrunner";

const onlyTests = true;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => rawInput.split("\n").map((row) => row.split('') as NUM_OPTIONS[]);

type NUM_OPTIONS = "A" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
const numKeypad: Record<NUM_OPTIONS, Record<NUM_OPTIONS, DIR_OPTIONS[]>> = {
  A: {
    "0": '<'.split('') as DIR_OPTIONS[],
    "1": '^<<'.split('') as DIR_OPTIONS[],
    "2": '^<'.split('') as DIR_OPTIONS[],
    "3": '^'.split('') as DIR_OPTIONS[],
    "4": '^^<<'.split('') as DIR_OPTIONS[],
    "5": '^^<'.split('') as DIR_OPTIONS[],
    "6": '^^'.split('') as DIR_OPTIONS[],
    "7": '^^^<<'.split('') as DIR_OPTIONS[],
    "8": '^^^<'.split('') as DIR_OPTIONS[],
    "9": '^^^'.split('') as DIR_OPTIONS[],
    A: [],
  },
  "0": {
    "0": [],
    "1": '^<'.split('') as DIR_OPTIONS[],
    "2": '^'.split('') as DIR_OPTIONS[],
    "3": '^>'.split('') as DIR_OPTIONS[],
    "4": '^^<'.split('') as DIR_OPTIONS[],
    "5": '^^'.split('') as DIR_OPTIONS[],
    "6": '^^>'.split('') as DIR_OPTIONS[],
    "7": '^^^<'.split('') as DIR_OPTIONS[],
    "8": '^^^'.split('') as DIR_OPTIONS[],
    "9": '^^^>'.split('') as DIR_OPTIONS[],
    A: '>'.split('') as DIR_OPTIONS[],
  },
  "1": {
    "0": '>v'.split('') as DIR_OPTIONS[],
    "1": [],
    "2": '>'.split('') as DIR_OPTIONS[],
    "3": '>>'.split('') as DIR_OPTIONS[],
    "4": '^'.split('') as DIR_OPTIONS[],
    "5": '^>'.split('') as DIR_OPTIONS[],
    "6": '^>>'.split('') as DIR_OPTIONS[],
    "7": '^^'.split('') as DIR_OPTIONS[],
    "8": '^^>'.split('') as DIR_OPTIONS[],
    "9": '^^>>'.split('') as DIR_OPTIONS[],
    A: '>>v'.split('') as DIR_OPTIONS[],
  },
  "2": {
    "0": 'v'.split('') as DIR_OPTIONS[],
    "1": '<'.split('') as DIR_OPTIONS[],
    "2": [],
    "3": '>'.split('') as DIR_OPTIONS[],
    "4": '^<'.split('') as DIR_OPTIONS[],
    "5": '^'.split('') as DIR_OPTIONS[],
    "6": '^>'.split('') as DIR_OPTIONS[],
    "7": '^^<'.split('') as DIR_OPTIONS[],
    "8": '^^'.split('') as DIR_OPTIONS[],
    "9": '>^^'.split('') as DIR_OPTIONS[],
    A: '>v'.split('') as DIR_OPTIONS[],
  },
  "3": {
    "0": '<v'.split('') as DIR_OPTIONS[],
    "1": '<<'.split('') as DIR_OPTIONS[],
    "2": '<'.split('') as DIR_OPTIONS[],
    "3": [],
    "4": '^<<'.split('') as DIR_OPTIONS[],
    "5": '^<'.split('') as DIR_OPTIONS[],
    "6": '^'.split('') as DIR_OPTIONS[],
    "7": '<<^^'.split('') as DIR_OPTIONS[],
    "8": '^^<'.split('') as DIR_OPTIONS[],
    "9": '^^'.split('') as DIR_OPTIONS[],
    A: '<v'.split('') as DIR_OPTIONS[],
  },
  "4": {
    "0": '>vv'.split('') as DIR_OPTIONS[],
    "1": 'v'.split('') as DIR_OPTIONS[],
    "2": '>v'.split('') as DIR_OPTIONS[],
    "3": '>>v'.split('') as DIR_OPTIONS[],
    "4": [],
    "5": '>'.split('') as DIR_OPTIONS[],
    "6": '>>'.split('') as DIR_OPTIONS[],
    "7": '^'.split('') as DIR_OPTIONS[],
    "8": '>^'.split('') as DIR_OPTIONS[],
    "9": '>>^'.split('') as DIR_OPTIONS[],
    A: '>vv'.split('') as DIR_OPTIONS[],
  },
  "5": {
    "0": 'vv'.split('') as DIR_OPTIONS[],
    "1": 'v<'.split('') as DIR_OPTIONS[],
    "2": 'v'.split('') as DIR_OPTIONS[],
    "3": 'v>'.split('') as DIR_OPTIONS[],
    "4": '<'.split('') as DIR_OPTIONS[],
    "5": [],
    "6": '>'.split('') as DIR_OPTIONS[],
    "7": '^<'.split('') as DIR_OPTIONS[],
    "8": '^'.split('') as DIR_OPTIONS[],
    "9": '^>'.split('') as DIR_OPTIONS[],
    A: 'vv'.split('') as DIR_OPTIONS[],
  },
  "6": {
    "0": '<vv'.split('') as DIR_OPTIONS[],
    "1": '<<v'.split('') as DIR_OPTIONS[],
    "2": '<v'.split('') as DIR_OPTIONS[],
    "3": 'v'.split('') as DIR_OPTIONS[],
    "4": '<<'.split('') as DIR_OPTIONS[],
    "5": '<'.split('') as DIR_OPTIONS[],
    "6": [],
    "7": '^<<'.split('') as DIR_OPTIONS[],
    "8": '^<'.split('') as DIR_OPTIONS[],
    "9": '^'.split('') as DIR_OPTIONS[],
    A: 'vv'.split('') as DIR_OPTIONS[],
  },
  "7": {
    "0": '>vvv'.split('') as DIR_OPTIONS[],
    "1": 'vv'.split('') as DIR_OPTIONS[],
    "2": 'vv>'.split('') as DIR_OPTIONS[],
    "3": 'vv>>'.split('') as DIR_OPTIONS[],
    "4": 'v'.split('') as DIR_OPTIONS[],
    "5": 'v>'.split('') as DIR_OPTIONS[],
    "6": 'v>>'.split('') as DIR_OPTIONS[],
    "7": [],
    "8": '>'.split('') as DIR_OPTIONS[],
    "9": '>>'.split('') as DIR_OPTIONS[],
    A: '>>vvv'.split('') as DIR_OPTIONS[],
  },
  "8": {
    "0": 'vvv'.split('') as DIR_OPTIONS[],
    "1": 'vv<'.split('') as DIR_OPTIONS[],
    "2": 'vv'.split('') as DIR_OPTIONS[],
    "3": 'vv>'.split('') as DIR_OPTIONS[],
    "4": 'v<'.split('') as DIR_OPTIONS[],
    "5": 'v'.split('') as DIR_OPTIONS[],
    "6": 'v>'.split('') as DIR_OPTIONS[],
    "7": '<'.split('') as DIR_OPTIONS[],
    "8": [],
    "9": '>'.split('') as DIR_OPTIONS[],
    A: 'vvv>'.split('') as DIR_OPTIONS[],
  },
  "9": {
    "0": '<vvv'.split('') as DIR_OPTIONS[],
    "1": '<<vv'.split('') as DIR_OPTIONS[],
    "2": '<vv'.split('') as DIR_OPTIONS[],
    "3": 'vv'.split('') as DIR_OPTIONS[],
    "4": '<<v'.split('') as DIR_OPTIONS[],
    "5": '<v'.split('') as DIR_OPTIONS[],
    "6": 'v'.split('') as DIR_OPTIONS[],
    "7": '<<'.split('') as DIR_OPTIONS[],
    "8": '<'.split('') as DIR_OPTIONS[],
    "9": [],
    A: 'vvv'.split('') as DIR_OPTIONS[],
  },
};
type DIR_OPTIONS = '<' | '>' | '^' | 'v' | 'A';
const dirKeypad: Record<DIR_OPTIONS, Record<DIR_OPTIONS, DIR_OPTIONS[]>> = {
  '<': {
    '<': [],
    '>': '>>'.split('') as DIR_OPTIONS[],
    '^': '>^'.split('') as DIR_OPTIONS[],
    'v': '>'.split('') as DIR_OPTIONS[],
    'A': '>>^'.split('') as DIR_OPTIONS[],
  },
  '>': {
    '<': '<<'.split('') as DIR_OPTIONS[],
    '>': [],
    '^': '<^'.split('') as DIR_OPTIONS[],
    'v': '<'.split('') as DIR_OPTIONS[],
    'A': '^'.split('') as DIR_OPTIONS[],
  },
  '^': {
    '<': 'v<'.split('') as DIR_OPTIONS[],
    '>': 'v>'.split('') as DIR_OPTIONS[],
    '^': [],
    'v': 'v'.split('') as DIR_OPTIONS[],
    'A': '>'.split('') as DIR_OPTIONS[],
  },
  'v': {
    '<': '<'.split('') as DIR_OPTIONS[],
    '>': '>'.split('') as DIR_OPTIONS[],
    '^': '^'.split('') as DIR_OPTIONS[],
    'v': [],
    'A': '>^'.split('') as DIR_OPTIONS[],
  },
  'A': {
    '<': 'v<<'.split('') as DIR_OPTIONS[],
    '>': 'v'.split('') as DIR_OPTIONS[],
    '^': '<'.split('') as DIR_OPTIONS[],
    'v': '<v'.split('') as DIR_OPTIONS[],
    'A': [],
  },
}
const numExpand: (input: NUM_OPTIONS[]) => DIR_OPTIONS[] = (input) => {
  let out: DIR_OPTIONS[] = [];
  let curr: NUM_OPTIONS = 'A';
  for (let i=0; i < input.length; i++) {
    out.push(...numKeypad[curr][input[i]])
    out.push('A');
    curr = input[i];
  }
  return out;
}
const dirExpand: (input: DIR_OPTIONS[]) => DIR_OPTIONS[] = (input) => {
  let out: DIR_OPTIONS[] = [];
  let curr: DIR_OPTIONS = 'A';
  for (let i=0; i < input.length; i++) {
    out.push(...dirKeypad[curr][input[i]])
    out.push('A');
    curr = input[i];
  }
  return out;
}

const part1 = (rawInput: string) => {
  const input: NUM_OPTIONS[][] = parseInput(rawInput);

  let score = 0;

  for (let i = 0; i < input.length; i++) {
    const inp = input[i];
    log('orig:', inp);
    let out = numExpand(inp);
    log('NUM EXPAND:', out.join(''));
    // log('vs.........', '<A^A>^^AvvvA');
    out = dirExpand(out);
    log('DIR EXPAND:', out.join('').split(' '));
    // log('vs.........', 'v<<A>>^A<A>AvA<^AA>A<vAAA>^A');
    out = dirExpand(out);
    log('DIR EXPAND:', out.join('').split('A'));
    log('vs.........', '<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A'.split('A'));
    inp.pop();

    const inpNum = parseInt(inp.join(''));
    const outScore = inpNum * out.length;
    log('increasing score: ', out.length, '*', inpNum, '=', outScore);
    score += outScore;
  }

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
        input: `029A
980A
179A
456A
379A`,
        expected: 126384,
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
