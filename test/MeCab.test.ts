import { MeCab } from "../MeCab.ts";
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

Deno.test("MeCab: generateMeCabRunError", () => {
  const message = "This is a test.";
  const actual = MeCab.generateMeCabRunError(message);
  const excepted = new Error(`Failed to run MeCab correctly: ${message}`);

  assertStrictEquals(actual.message, excepted.message);
});

Deno.test("MeCab: parse", async () => {
  const text = "あいうえお";
  const mecab = new MeCab([dummyMeCabPath]);
  const actual = await mecab.parse(text);
  const excepted = [["あいうえお"]];

  assertEquals(actual, excepted);
});

Deno.test("MeCab: dump", async () => {
  const text = "あいうえお";
  const mecab = new MeCab([dummyMeCabPath]);
  const actual = await mecab.dump(text);
  const excepted = [["0", "あいうえお", ["dummy", "*"]]];

  assertEquals(actual, excepted);
});

Deno.test("MeCab: chasen (not included spaces)", async () => {
  const text = "あいうえお";
  const mecab = new MeCab([dummyMeCabPath]);
  const actual = await mecab.chasen(text, false);
  const excepted = [["あいうえお"]];

  assertEquals(actual, excepted);
});

Deno.test("MeCab: chasen (include spaces)", async () => {
  const text = "あいうえお";
  const mecab = new MeCab([dummyMeCabPath]);
  const actual = await mecab.chasen(text, true);
  const excepted = [["あいうえお"]];

  assertEquals(actual, excepted);
});

Deno.test("MeCab: simple", async () => {
  const text = "あいうえお";
  const mecab = new MeCab([dummyMeCabPath]);
  const actual = await mecab.simple(text);
  const excepted = [["あいうえお"]];

  assertEquals(actual, excepted);
});

Deno.test("MeCab: wakati", async () => {
  const text = "あ いうえ お";
  const mecab = new MeCab([dummyMeCabPath]);
  const actual = await mecab.wakati(text);
  const excepted = ["あ", "いうえ", "お"];

  assertEquals(actual, excepted);
});

Deno.test("MeCab: yomi", async () => {
  const text = "あいうえお";
  const mecab = new MeCab([dummyMeCabPath]);
  const actual = await mecab.yomi(text);
  const excepted = "あいうえお";

  assertStrictEquals(actual, excepted);
});
