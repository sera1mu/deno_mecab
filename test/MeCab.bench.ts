import { MeCab } from "../src/MeCab.ts";

const measureTime = async (label: string, fn: () => Promise<void>) => {
  console.log("Start:", label);
  const startTime = performance.now();
  try {
    await fn();
  } catch (err) {
    throw new Error(`Error: ${err}`);
  }
  const endTime = performance.now();
  const result = endTime - startTime;
  console.log(label, result);

  return result;
};

const run = async () => {
  const mecab = new MeCab(["mecab"]);
  const parseText =
    "あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。";

  const result: Record<string, number> = {};

  result.parse = await measureTime("parse", async () => {
    await mecab.parse(parseText);
  });

  result.dump = await measureTime("dump", async () => {
    await mecab.dump(parseText);
  });

  result.chasen = await measureTime("chasen", async () => {
    await mecab.chasen(parseText);
  });

  result.simple = await measureTime("simple", async () => {
    await mecab.simple(parseText);
  });

  result.wakati = await measureTime("wakati", async () => {
    await mecab.wakati(parseText);
  });

  result.yomi = await measureTime("yomi", async () => {
    await mecab.yomi("林檎");
  });

  return result;
};

const main = async () => {
  const data = [];
  const runCount = Number(Deno.args[0]);

  if (Deno.args[0]) {
    if (isNaN(runCount)) {
      console.log("Please input valid number");
      Deno.exit(1);
    }

    for (let count = 0; count < runCount; count++) {
      const result = await run();
      data.push(result);
      console.log("Count:", count, "\n", result);
    }
  } else {
    console.log("Please provide try counts.");
    Deno.exit(1);
  }

  console.log("Benchmark done.");
  console.log("Calculating...");

  const total: Record<string, number> = {
    parse: 0,
    dump: 0,
    chasen: 0,
    simple: 0,
    wakati: 0,
    yomi: 0,
  };
  for (const entry of data) {
    for (const key of Object.keys(total)) {
      total[key] += entry[key];
    }
  }

  const average: Record<string, number> = {
    parse: 0,
    dump: 0,
    chasen: 0,
    simple: 0,
    wakati: 0,
    yomi: 0,
  };

  for (const key of Object.keys(total)) {
    average[key] = total[key] / runCount;
  }

  const json = JSON.stringify({
    average,
    data,
  });

  console.log("Average", average);
  console.log("Data: ", data);

  const jsonFile = Deno.args[1];
  Deno.writeTextFile(jsonFile, json);
};

await main();
