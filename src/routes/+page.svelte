<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import random, { Random } from "random";
  import seedrandom from "seedrandom";

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");

  function random_string(n: number) {
    let op = "";
    for (let i = 0; i <= n; i++) {
      let choice = random.choice(characters);
      op += choice;
    }
    return op;
  }

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

  function get_bingo_board(url: URL) {
    const seed = url.searchParams.get("seed");

    if (seed === null) {
      const seed = random_string(100);
      const date = new Date();
      goto(`./?seed=${seed}${date.getMilliseconds()}`);
      return [];
    }

    const rng = new Random(seedrandom(seed));
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

    return bingoboard;
  }

  let bingoboard: BINGO[] = $state([]);

  function serialize_square(name: string, index: number): string {
    return `${name}${index}`;
  }

  function click_square(name: string, index: number) {
    let query = new URLSearchParams($page.url.searchParams.toString());
    if (is_checked(name, index)) {
      query.set(serialize_square(name, index), "unchecked");
    } else {
      query.set(serialize_square(name, index), "checked");
    }
    goto(`./?${query.toString()}`);
  }

  function is_checked(name: string, index: number): boolean {
    let query = new URLSearchParams($page.url.searchParams.toString());
    const res = query.get(serialize_square(name, index)) === "checked";
    return res;
  }

  $effect(() => {
    bingoboard = get_bingo_board($page.url);
  });
</script>

<div
  class="flex justify-between flex-row w-full flex-grow mt-4 align-bottom mb-4"
>
  <h1 class="font-light text-4xl text-slate-800">Bingo</h1>
  <a href="./" class="text-sky-800">Nytt brett</a>
</div>

<div
  class="grid grid-cols-5 gap-1 bg-slate-500 w-full border-slate-500 border-solid border-"
>
  {#each "BINGO" as letter (letter)}
    <div class="font-bold text-xl h-20 p-2 bg-gray-700 place-items-center grid">
      {letter}
    </div>
  {/each}
  {#each bingoboard as bingo_row, idx (idx)}
    <div
      class="font-light aspect-square p-2 place-items-center grid text-lg"
      onclick={() => click_square("B", idx)}
      class:bg-red-500={is_checked("B", idx)}
      class:bg-slate-600={!is_checked("B", idx)}
    >
      {bingo_row.B}
    </div>
    <div
      class="font-light aspect-square p-2 place-items-center grid text-lg"
      onclick={() => click_square("i", idx)}
      class:bg-red-500={is_checked("i", idx)}
      class:bg-slate-600={!is_checked("i", idx)}
    >
      {bingo_row.I}
    </div>

    {#if idx === 2}
      <div class="font-light aspect-square p-2 place-items-center grid text-lg">
        FREE<br />SPACE
      </div>
    {:else}
      <div
        class="font-light aspect-square p-2 place-items-center grid text-lg"
        onclick={() => click_square("N", idx)}
        class:bg-red-500={is_checked("N", idx)}
        class:bg-slate-600={!is_checked("N", idx)}
      >
        {bingo_row.N}
      </div>
    {/if}
    <div
      class="font-light aspect-square p-2 place-items-center grid text-lg"
      onclick={() => click_square("G", idx)}
      class:bg-red-500={is_checked("G", idx)}
      class:bg-slate-600={!is_checked("G", idx)}
    >
      {bingo_row.G}
    </div>
    <div
      class="font-light aspect-square p-2 place-items-center grid text-lg"
      onclick={() => click_square("O", idx)}
      class:bg-red-500={is_checked("O", idx)}
      class:bg-slate-600={!is_checked("O", idx)}
    >
      {bingo_row.O}
    </div>
  {/each}
  <!-- <div class="bg-red-500">hacky tailwindcss whitelist</div> -->
</div>
