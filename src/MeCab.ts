interface MeCabOptions {
  cwd?: string;
  env?: { [key: string]: string };
}

interface ParsedWord {
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

interface ParsedDumpWord extends ParsedWord {
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

export class MeCab {
  private cmd: string[];
  private options?: MeCabOptions;

  /**
   * @param cmd Command (Usually the path to the executable)
   * @param options Running options
   */
  constructor(cmd: string[], options?: MeCabOptions) {
    this.cmd = cmd;
    this.options = options;
  }

  /**
   * Generate error message
   *
   * Format: "Failed to run MeCab correctly: ${message}"
   */
  static generateMeCabRunError(message: string): Error {
    return new Error(`Failed to run MeCab correctly: ${message}`);
  }

  /**
   * Run MeCab(cmd)
   * @param cmdArgs After cmd args (e.g. -Ochasen)
   */
  private async runMeCab(text: string, cmdArgs?: string[]): Promise<string> {
    const options: Deno.RunOptions = {
      cmd: cmdArgs ? this.cmd.concat(cmdArgs) : this.cmd,
      cwd: this.options?.cwd,
      env: this.options?.env,
      stdout: "piped",
      stdin: "piped",
    };

    // Initialize TextEncoder and TextDecoder
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Create process
    const process = Deno.run(options);

    // Write text to stdin
    await process.stdin?.write(encoder.encode(text));
    process.stdin?.close();

    // Get status and stdout
    const [{ code }, stdout] = await Promise.all([
      process.status(),
      process.output(),
    ]);
    process.close();

    // Check process exited with exit code 0
    if (code !== 0) {
      throw stdout;
    }

    // Return process stdout
    const decodedOutput = decoder.decode(stdout);
    return decodedOutput;
  }

  /**
   * Parse (morphological analysis) text
   */
  async parse(text: string): Promise<ParsedWord[]> {
    // Run MeCab
    let result: string;
    try {
      result = await this.runMeCab(text);
    } catch (err) {
      throw MeCab.generateMeCabRunError(err);
    }
    // Remove not needed symbol
    const splitedResult = result
      .replace(/\nEOS\n/, "")
      .replace(/\t/g, ",")
      .split("\n");
    const parsedWords: ParsedWord[] = [];

    // Edit result
    for (const line of splitedResult) {
      const splitedLine = line.split(",");
      const word: ParsedWord = {
        surface: splitedLine[0],
        feature: splitedLine[1],
        featureDetails: [splitedLine[2], splitedLine[3], splitedLine[4]],
        conjugationForms: [splitedLine[5], splitedLine[6]],
        originalForm: splitedLine[7],
        reading: splitedLine[8],
        pronunciation: splitedLine[9],
      };
      parsedWords.push(word);
    }
    return parsedWords;
  }

  /**
   * Get a dump of text
   */
  async dump(text: string): Promise<ParsedDumpWord[]> {
    // Run MeCab
    let result: string;
    try {
      result = await this.runMeCab(text, ["-Odump"]);
    } catch (err) {
      throw MeCab.generateMeCabRunError(err.message);
    }

    // Remove not needed symbol
    const splitedResult = result.replace(/\n$/, "").split("\n");
    const parsedWords: ParsedDumpWord[] = [];

    // Edit result
    for (const line of splitedResult) {
      const splitedLine = line.split(" ");
      const splitedLineFeature = splitedLine[2].split(",");
      const word: ParsedDumpWord = {
        nodeId: Number(splitedLine[0]),
        surface: splitedLine[1],
        feature: splitedLineFeature[0],
        featureDetails: [
          splitedLineFeature[1],
          splitedLineFeature[2],
          splitedLineFeature[3],
        ],
        conjugationForms: [splitedLineFeature[4], splitedLineFeature[5]],
        originalForm: splitedLineFeature[6],
        reading: splitedLineFeature[7],
        pronunciation: splitedLineFeature[8],
        characterStartByte: Number(splitedLine[3]),
        characterEndByte: Number(splitedLine[4]),
        rcAttr: Number(splitedLine[5]),
        lcAttr: Number(splitedLine[6]),
        posId: Number(splitedLine[7]),
        characterType: Number(splitedLine[8]),
        status: Number(splitedLine[9]),
        isBest: Number(splitedLine[10]),
        alpha: Number(splitedLine[11]),
        beta: Number(splitedLine[12]),
        prob: Number(splitedLine[13]),
        cost: Number(splitedLine[14]),
      };
      parsedWords.push(word);
    }

    return parsedWords;
  }

  /**
   * Word-separate text
   */
  async wakati(text: string): Promise<string[]> {
    // Run MeCab
    let result: string;
    try {
      result = await this.runMeCab(text, ["-Owakati"]);
    } catch (err) {
      throw MeCab.generateMeCabRunError(err.message);
    }

    // Edit result
    const editedResult = result.split(" ");
    editedResult.pop();

    return editedResult;
  }

  /**
   * Add reading to text
   */
  async yomi(text: string): Promise<string> {
    // Run MeCab
    let result: string;
    try {
      result = await this.runMeCab(text, ["-Oyomi"]);
    } catch (err) {
      throw MeCab.generateMeCabRunError(err.message);
    }

    // Edit result
    const editedResult = result.replace(/ \n/g, "");
    return editedResult;
  }
}
