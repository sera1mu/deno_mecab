/** Advanced execution options of MeCab */
export interface MeCabOptions {
  cwd?: string;
  env?: { [key: string]: string };
}

export interface ParsedWord {
  // 0
  surface: string;
  // 1
  feature: string;
  // 2..4
  featureDetails: string[];
  // 5..6
  conjugationForms: string[];
  // 7
  originalForm: string;
  // 8
  reading?: string;
  // 9
  pronunciation?: string;
}

export interface ParsedDumpWord extends ParsedWord {
  // 0
  nodeId: number;
  // surface: 1
  // feature: 2
  // 3
  characterStartByte: number;
  // 4
  characterEndByte: number;
  // 5
  rcAttr: number;
  // 6
  lcAttr: number;
  // 7
  posId: number;
  // 8
  characterType: number;
  // 9
  status: number;
  // 10
  isBest: number;
  // 11
  alpha: number;
  // 12
  beta: number;
  // 13
  prob: number;
  // 14
  cost: number;
}
