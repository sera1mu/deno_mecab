# deno_mecab

[![Test](https://img.shields.io/github/workflow/status/sera1mu/deno-mecab/Test?label=Test&logo=github&logoColor=silver)](https://github.com/sera1mu/deno-mecab/actions/workflows/test.yml)
[![Lint](https://img.shields.io/github/workflow/status/sera1mu/deno-mecab/Lint?label=Lint&logo=github&logoColor=silver)](https://github.com/sera1mu/deno-mecab/actions/workflows/check-code.yml)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/sera1mu/deno-mecab?logo=Code%20Climate)](https://codeclimate.com/github/sera1mu/deno-mecab/test_coverage)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/sera1mu/deno-mecab?logo=Code%20Climate)](https://codeclimate.com/github/sera1mu/deno-mecab/maintainability)
[![license](https://img.shields.io/github/license/sera1mu/deno-mecab)](https://github.com/sera1mu/deno-mecab/blob/main/LICENSE)

### English | [日本語](https://github.com/sera1mu/deno-mecab/blob/main/README.ja.md)

deno-mecab is an asynchronous Japanese morphological analysis module using
MeCab.

## Getting Started

### Requirements

- [Deno](https://deno.land)
- [MeCab](https://taku910.github.io/mecab/)
- MeCab Dictionary
  - [mecab-ipadic](https://github.com/taku910/mecab/tree/master/mecab-ipadic)
  - [mecab-jumandic](https://github.com/taku910/mecab/tree/master/mecab-jumandic)
  - [mecab-ipadic-neologd](https://github.com/neologd/mecab-ipadic-neologd)

### Example

For a quick example, run this:

```
deno run --allow-run https://deno.land/x/deno_mecab/example.ts
```

A simple example:

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
