import MeCab from "../src/MeCab.ts";
import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.104.0/testing/asserts.ts";
import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.104.0/path/mod.ts";

const testDir = dirname(fromFileUrl(import.meta.url));
const dummyMeCabPath = join(testDir, "dummyMeCab.ts");
const cmd = ["deno", "run", dummyMeCabPath];

Deno.test("MeCab: generateMeCabRunError", () => {
  const message = "This is a test.";
  const actual = MeCab.generateMeCabRunError(message);
  const excepted = new Error(`Failed to run MeCab correctly: ${message}`);

  assertStrictEquals(actual.message, excepted.message);
});

Deno.test("MeCab: parse", async () => {
  const text = "あいうえお";
  const mecab = new MeCab(cmd);
  const actual = await mecab.parse(text);
  const excepted = [{
    surface: text,
    feature: "dummy",
    featureDetails: ["*", "*", "*"],
    conjugationForms: ["*", "*"],
    originalForm: "*",
    reading: "*",
    pronunciation: "*",
  }];

  assertEquals(actual, excepted);
});

Deno.test("MeCab: dump", async () => {
  const text = "あいうえお";
  const mecab = new MeCab(cmd);
  const actual = await mecab.dump(text);
  const excepted = [{
    nodeId: 0,
    surface: text,
    feature: "dummy",
    featureDetails: ["*", "*", "*"],
    conjugationForms: ["*", "*"],
    originalForm: "*",
    reading: "*",
    pronunciation: "*",
    characterStartByte: 0,
    characterEndByte: 0,
    rcAttr: 0,
    lcAttr: 0,
    posId: 0,
    characterType: 0,
    status: 0,
    isBest: 0,
    alpha: 0,
    beta: 0,
    prob: 0,
    cost: 1,
  }];

  assertEquals(actual, excepted);
});

Deno.test("MeCab: wakati", async () => {
  const text = "あ いうえ お";
  const mecab = new MeCab(cmd);
  const actual = await mecab.wakati(text);
  const excepted = ["あ", "いうえ", "お"];

  assertEquals(actual, excepted);
});

Deno.test("MeCab: yomi", async () => {
  const text = "あいうえお";
  const mecab = new MeCab(cmd);
  const actual = await mecab.yomi(text);
  const excepted = "あいうえお";

  assertStrictEquals(actual, excepted);
});
