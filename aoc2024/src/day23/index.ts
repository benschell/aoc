import run from "aocrunner";

const onlyTests = true;

const log = (...str: any[]) => {
  if (onlyTests) {
    console.log(...str);
  }
};

const parseInput = (rawInput: string) => {
  const raw = rawInput.split("\n").map((row) => row.split('-'));
  const connections = new Map<string, { label: string, count: number, ends: string[] }>();
  raw.forEach((parts) => {
    if (!connections.has(parts[0])) {
      connections.set(parts[0], { label: parts[0], count: 0, ends: []});
    }
    const conn = connections.get(parts[0])!;
    conn.count += 1;
    conn.ends.push(parts[1]);
    if (!connections.has(parts[1])) {
      connections.set(parts[1], { label: parts[1], count: 0, ends: []});
    }
    const secondConn = connections.get(parts[1])!;
    secondConn.count += 1;
    secondConn.ends.push(parts[0]);
  });
  return { connections };
};

const key = (labels: string[]) => {
  labels.sort();
  return labels.join('');
}
const part1 = (rawInput: string) => {
  const {connections} = parseInput(rawInput);
  const found = new Set<string>();
  connections.forEach((first) => {
    if (first.label.startsWith('t')) {
      log(`examining peers of ${first.label}:`);
      first.ends.forEach((secondLabel) => {
        const second = connections.get(secondLabel)!;
        log(`\texamining peers of ${secondLabel};`);
        second.ends.forEach((thirdLabel) => {
          if (thirdLabel === first.label) { return; }
          const third = connections.get(thirdLabel)!;
          if (third.ends.includes(first.label)) {
            // Third connects back to First, so we have a cycle!
            const idxKey = key([first.label, secondLabel, thirdLabel]);
            log(`\t\tWill include this cycle: ${idxKey}`);
            found.add(idxKey);
          }
        });
      });
    }
  });
  log([...found]);
  return found.size;
};

const part2 = (rawInput: string) => {
  const { connections } = parseInput(rawInput);
  const found = new Set<string>();
  connections.forEach((first) => {
    log(`examining peers of ${first.label}:`);
    first.ends.forEach((secondLabel) => {
      const second = connections.get(secondLabel)!;
      log(`\texamining peers of ${secondLabel};`);
      second.ends.forEach((thirdLabel) => {
        if (thirdLabel === first.label) { return; }
        
        const third = connections.get(thirdLabel)!;
        if (third.ends.includes(first.label)) {
          // Third connects back to First, so we have a cycle!
          const idxKey = key([first.label, secondLabel, thirdLabel]);
          log(`\t\tWill include this cycle: ${idxKey}`);
          found.add(idxKey);
        }
      });
    });
  });
  // Try each key and see if 
  return;
};

run({
  part1: {
    tests: [
      {
        input: `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`,
        expected: 'co,de,ka,ta',
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests,
});
