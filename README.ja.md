# deno-mecab

[![Test](https://img.shields.io/github/workflow/status/sera1mu/deno-mecab/Test?label=Test&logo=github&logoColor=silver)](https://github.com/sera1mu/deno-mecab/actions/workflows/test.yml)
[![Lint](https://img.shields.io/github/workflow/status/sera1mu/deno-mecab/Lint?label=Lint&logo=github&logoColor=silver)](https://github.com/sera1mu/deno-mecab/actions/workflows/check-code.yml)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/sera1mu/deno-mecab?logo=Code%20Climate)](https://codeclimate.com/github/sera1mu/deno-mecab/test_coverage)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/sera1mu/deno-mecab?logo=Code%20Climate)](https://codeclimate.com/github/sera1mu/deno-mecab/maintainability)
[![license](https://img.shields.io/github/license/sera1mu/deno-mecab)](https://github.com/sera1mu/deno-mecab/blob/main/LICENSE)

### [English](https://github.com/sera1mu/deno-mecab/blob/main/README.ja.md) | 日本語

deno-mecabは、MeCabを用いた非同期の日本語形態素解析モジュールです。

## Getting Started

**現在このモジュールはWindowsでは動作しません。解決までお待ちください。**

### Dependencies

- deno
- mecab
- mecab dictionary
  - `mecab-ipadic-neologd` を使用することをおすすめします。
    (https://github.com/neologd/mecab-ipadic-neologd)

### Example

簡単な例として、これを実行してみましょう:

```
deno run --allow-run https://deno.land/x/deno_mecab/example.ts
```

簡単な例:

```ts
import { MeCab } from "https://deno.land/x/deno_mecab/mod.ts";

const mecab = new MeCab(["mecab"]);

const text = "JavaScriptはとても楽しいです。";

// Parse (形態素解析)
console.log(await mecab.parse(text));
// [["JavaScript","名詞","固有名詞","組織","*","*","*","*"],["は","助詞","係助詞","*","*","*","*","は","ハ","ワ"],["とても","副詞","助詞類接続","*","*","*","*","とても","トテモ","トテモ"] ...

// Dump (ダンプ出力)
console.log(await mecab.dump(text));
// [["0","BOS",["BOS/EOS","*","*","*","*","*","*","*","*"],"0","0","0","0","0","0","2","1","0.000000","0.000000","0.000000","0"],["3","JavaScript",["名詞","固有名詞","組織","*","*","*","*"],"0","10","1292" ...

// Chasen (Chasen互換)
console.log(await mecab.chasen(text));
// [["JavaScript","JavaScript","JavaScript","名詞-固有名詞-組織","",""],["は","ハ","は","助詞-係助詞","",""],["とても","トテモ","とても","副詞-助詞類接続","",""] ...

// Simple (品詞のみ出力)
console.log(await mecab.simple(text));
// [["は","助詞-係助詞"],["とても","副詞-助詞類接続"],["楽しい","形容詞-自立"],["です","助動詞"],["。","記号-句点"]];

// Wakati (わかち書き)
console.log(await mecab.wakati("JavaScriptはとても楽しいです。"));
// [ "JavaScript", "は", "とても", "楽しい", "です", "。" ]

// Yomi (読み付与)
console.log(await mecab.yomi("日本語"));
// ニホンゴ
```

## Maintainer

[@sera1mu](https://github.com/sera1mu)

## License

MIT &copy; 2021 Seraimu
