import run from "aocrunner";

const onlyTests = false;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

enum OpCode {
  ADV = "ADV",
  BXL = "BXL",
  BST = "BST",
  JNZ = "JNZ",
  BXC = "BXC",
  OUT = "OUT",
  BDV = "BDV",
  CDV = "CDV",
  NOOP = "NOOP", // Temp for testing
}
type Instruction = {
  opcode: OpCode;
  operand: number;
};
type Computer = {
  a: number;
  b: number;
  c: number;
  iptr: number;
  instrs: Instruction[];
};
const getOpcodeFromStr: (instr: number) => OpCode = (instr) => {
  if (instr === 0) return OpCode.ADV;
  else if (instr === 1) return OpCode.BXL;
  else if (instr === 2) return OpCode.BST;
  else if (instr === 3) return OpCode.JNZ;
  else if (instr === 4) return OpCode.BXC;
  else if (instr === 5) return OpCode.OUT;
  else if (instr === 6) return OpCode.BDV;
  else if (instr === 7) return OpCode.CDV;
  return OpCode.NOOP;
};

const parseInput = (rawInput: string) => {
  const computer: Computer = {
    a: -1,
    b: -1,
    c: -1,
    iptr: 0,
    instrs: [],
  };
  const parts = rawInput.split("\n\n");
  const state = parts[0].split("\n");
  computer.a = parseInt(state[0].split(": ")[1]);
  computer.b = parseInt(state[1].split(": ")[1]);
  computer.c = parseInt(state[2].split(": ")[1]);

  const instrs = parts[1].split(": ")[1];
  for (let i = 0; i < instrs.length; i += 4) {
    computer.instrs.push({
      opcode: getOpcodeFromStr(parseInt(instrs[i])),
      operand: parseInt(instrs[i + 2]),
    });
  }

  return computer;
};

const getOperand: (instr: Instruction, computer: Computer) => number = (
  instr,
  computer,
) => {
  if (
    instr.opcode === OpCode.BXL ||
    instr.opcode === OpCode.JNZ ||
    instr.opcode === OpCode.BXC
  ) {
    // Literal operands
    return instr.operand;
  }
  // Combo operand
  if (instr.operand < 4) {
    return instr.operand;
  }
  if (instr.operand === 4) {
    return computer.a;
  }
  if (instr.operand === 5) {
    return computer.b;
  }
  if (instr.operand === 6) {
    return computer.c;
  }
  throw new Error(`Unknown operand: ${instr.opcode}-${instr.operand}`);
};

const set: (
  opcode: OpCode,
  computer: Computer,
  reg: "a" | "b" | "c",
  val: number,
) => void = (opcode, computer, reg, val) => {
  log(`[${opcode}]: Setting ${reg} to ${val}`);
  computer[reg] = val;
};

const part1 = (rawInput: string) => {
  const computer = parseInput(rawInput);

  let out: number[] = [];
  let count = 0;
  console.log('initial state:', computer);
  while (true) {
    if (++count > 100) {
      console.log("BREAKING EARLY, SHOULD REMOVE THIS CHECK");
      break;
    }
    if (computer.iptr >= computer.instrs.length) {
      console.log(computer.iptr, 'is >=', computer.instrs.length);
      break;
    }

    // Process the instruction
    const instr = computer.instrs[computer.iptr];
    let shouldIncrement = true;
    const operand = getOperand(instr, computer);
    if (
      instr.opcode === OpCode.ADV ||
      instr.opcode === OpCode.BDV ||
      instr.opcode === OpCode.CDV
    ) {
      const out =
        instr.opcode === OpCode.ADV
          ? "a"
          : instr.opcode === OpCode.BDV
          ? "b"
          : "c";
      const num = computer.a;
      const denom = Math.pow(2, operand);
      set(instr.opcode, computer, out, Math.floor(num / denom));
    } else if (instr.opcode === OpCode.BXL) {
      set(instr.opcode, computer, "b", computer.b ^ operand);
    } else if (instr.opcode === OpCode.BST) {
      set(instr.opcode, computer, "b", operand % 8);
    } else if (instr.opcode === OpCode.JNZ) {
      if (computer.a !== 0) {
        shouldIncrement = false;
        log(`Jumping to ${operand}`);
        computer.iptr = operand;
      } else {
        log("NOT jumping");
      }
    } else if (instr.opcode === OpCode.BXC) {
      set(instr.opcode, computer, "b", computer.b ^ computer.c);
    } else if (instr.opcode === OpCode.OUT) {
      log("adding to out:", operand % 8);
      out.push(operand % 8);
    } else {
      throw new Error(`Unknown opcode: ${instr.opcode}`);
    }
    if (shouldIncrement) {
      computer.iptr += 1;
    }
  }
  log("\nFinal State:");
  log(computer);
  log(`Out: ${out.join(",")}`);

  return out.join(",");
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `Register A: 0
Register B: 0
Register C: 9

Program: 2,6`,
        expected: "",
      },
      {
        input: `Register A: 10
Register B: 0
Register C: 0

Program: 5,0,5,1,5,4`,
        expected: "0,1,2",
      },
      {
        input: `Register A: 2024
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`,
        expected: "4,2,5,6,7,7,7,7,3,1,0",
      },
      {
        input: `Register A: 0
Register B: 29
Register C: 0

Program: 1,7`,
        expected: "",
      },
      {
        input: `Register A: 0
Register B: 2024
Register C: 43690

Program: 4,0`,
        expected: "",
      },
      {
        input: `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`,
        expected: "4,6,3,5,6,3,5,2,1,0",
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
