import run from "aocrunner";

const onlyTests = true;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  const parts = rawInput.split("\n\n");
  const registers = new Map(parts[0].split('\n').map((reg) => {
    const parts = reg.split(': ');
    return [
      parts[0],
      parts[1] === '1',
    ];
  }));
  const gates = parts[1].split('\n').map((gate) => {
    const parts = gate.split(' ');
    return {
      lin: parts[0],
      rin: parts[2],
      type: parts[1],
      outLabel: parts[4],
      outVal: undefined,
      resolved: false,
    };
  });
  return { registers, gates };
}

const part1 = (rawInput: string) => {
  const { registers, gates } = parseInput(rawInput);
  log(registers);
  let maxZ = -1;
  while(true) {
    let hasUpdated = false;
    // Iterate over every gate to see if we can update any
    gates.forEach((gate) => {
      if (gate.outLabel.startsWith('z')) {
        const num = parseInt(gate.outLabel.split('z')[1]);
        maxZ = num > maxZ ? num : maxZ;
      }
      if (!gate.resolved && registers.has(gate.lin) && registers.has(gate.rin)) {
        // we're not resolved yet, and we do have both inputs!
        const first = registers.get(gate.lin)!;
        const second = registers.get(gate.rin)!;
        let out = false;
        if (gate.type === 'AND') {
          out = first && second;
        } else if (gate.type === 'OR') {
          out = first || second;
        } else if (gate.type === 'XOR') {
          out = first != second;
        }
        // log('setting', gate.outLabel, 'to', out, 'due to', first, gate.type, second);
        registers.set(gate.outLabel, out);
        gate.resolved = true;
        hasUpdated = true;
      }
    });

    if (!hasUpdated) {
      break;
    }
  }

  let out = 0;
  for (let i=maxZ; i >= 0; i--) {
    const label = `z${(''+i).padStart(2, '0')}`;
    // log('checking label:', label, registers.get(label));
    // log('shifting', out, 'by 1');
    out = out << 1;
    if (registers.get(label)) {
      // log('adding 1 due to', label, registers.get(label));
      out += 1;
    }
  }
  log({ out });

  log(registers);

  return out;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02`,
        expected: 4,
      },
      {
        input: `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`,
        expected: 2024,
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
