# deno-mecab

[![Test](https://github.com/sera1mu/deno-mecab/actions/workflows/test.yml/badge.svg)](https://github.com/sera1mu/deno-mecab/actions/workflows/test.yml)
[![Check code](https://github.com/sera1mu/deno-mecab/actions/workflows/check-code.yml/badge.svg)](https://github.com/sera1mu/deno-mecab/actions/workflows/check-code.yml)
[![codecov](https://codecov.io/gh/sera1mu/deno-mecab/branch/main/graph/badge.svg?token=I4wy5RWjNm)](https://codecov.io/gh/sera1mu/deno-mecab)
[![license](https://img.shields.io/github/license/sera1mu/deno-mecab)](https://github.com/sera1mu/deno-mecab/blob/main/LICENSE)

deno-mecab is an asynchronous Japanese morphological analysis module using
MeCab.

## Getting Started

**Currently, this module does not work on Windows. Please wait for resolution.**

### Dependencies

- deno
- mecab
- mecab dictionary
  - We recommend the use of `mecab-ipadic-neologd`.
    (https://github.com/neologd/mecab-ipadic-neologd)

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

@sera1mu

## License

MIT &copy; 2021 Seraimu
