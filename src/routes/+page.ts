import { redirect } from "@sveltejs/kit";
import random, { Random } from "random";

interface BINGO {
  B: Number;
  I: Number;
  N: Number;
  G: Number;
  O: Number;
}

const ztoftn = [...Array(15).keys()];
const B = ztoftn.map((n) => n + 1);
const I = ztoftn.map((n) => n + 16);
const N = ztoftn.map((n) => n + 31);
const G = ztoftn.map((n) => n + 46);
const O = ztoftn.map((n) => n + 61);

function pick_n<T>(rng: Random, lst: Array<T>, n: number): Array<T> {
  const op: Array<T> = [];
  for (let i = 0; i <= n; i++) {
    let choice = rng.choice(lst);
    while (!choice || op.includes(choice)) {
      choice = rng.choice(lst);
    }
    op.push(choice);
  }
  return op;
}

export function load({ url }) {
  const seed = url.searchParams.get("seed");
  if (seed === null) {
    const seed = random.int(0, Number.MAX_SAFE_INTEGER);
    redirect(302, `/?seed=${seed}`);
  }

  const rng = new Random(seed);
  const bs = pick_n(rng, B, 5);
  const is = pick_n(rng, I, 5);
  const ns = pick_n(rng, N, 5);
  const gs = pick_n(rng, G, 5);
  const os = pick_n(rng, O, 5);

  const bingoboard: Array<BINGO> = [];
  for (let i of Array(5).keys()) {
    bingoboard.push({
      B: bs.at(i)!,
      I: is.at(i)!,
      N: ns.at(i)!,
      G: gs.at(i)!,
      O: os.at(i)!,
    });
  }

  return { bingoboard };
}
