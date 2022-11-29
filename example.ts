import MeCab from "https://deno.land/x/deno_mecab@v1.2.2/mod.ts";

const mecab = new MeCab(["mecab"]);

const text = "JavaScriptはとても楽しいです。";

// Parse (形態素解析)
console.log(await mecab.parse(text));

// Dump (ダンプ出力)
console.log(await mecab.dump(text));

// Wakati (わかち書き)
console.log(await mecab.wakati("JavaScriptはとても楽しいです。"));

// Yomi (読み付与)
console.log(await mecab.yomi("日本語"));
