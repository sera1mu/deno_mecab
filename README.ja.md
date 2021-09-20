# deno_mecab

[![Test](https://img.shields.io/github/workflow/status/sera1mu/deno-mecab/Test?label=Test&logo=github&logoColor=silver)](https://github.com/sera1mu/deno-mecab/actions/workflows/test.yml)
[![Lint](https://img.shields.io/github/workflow/status/sera1mu/deno-mecab/Lint?label=Lint&logo=github&logoColor=silver)](https://github.com/sera1mu/deno-mecab/actions/workflows/check-code.yml)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/sera1mu/deno-mecab?logo=Code%20Climate)](https://codeclimate.com/github/sera1mu/deno-mecab/test_coverage)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/sera1mu/deno-mecab?logo=Code%20Climate)](https://codeclimate.com/github/sera1mu/deno-mecab/maintainability)
[![license](https://img.shields.io/github/license/sera1mu/deno-mecab)](https://github.com/sera1mu/deno-mecab/blob/main/LICENSE)

### [English](https://github.com/sera1mu/deno-mecab/blob/main/README.ja.md) | 日本語

deno_mecabは、MeCabを用いた非同期の日本語形態素解析モジュールです。

## Getting Started

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
// [{surface: "JavaScript", feature: "名詞", featureDetails: [ "固有名詞", "組織", "*" ], ...

// Dump (ダンプ出力)
console.log(await mecab.dump(text));
// [{nodeId: 0, surface: "BOS", feature: "BOS/EOS", featureDetails: [ "*", "*", "*" ], ...

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
