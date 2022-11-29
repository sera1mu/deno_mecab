import { MeCabOptions, ParsedDumpWord, ParsedWord } from "./types.ts";

/**
 * Run and parse text with MeCab.
 *
 * Requires `allow-run` permission.
 */
export default class MeCab {
  private readonly cmd: string[];
  private readonly options?: MeCabOptions;

  constructor(cmd: string[], options?: MeCabOptions) {
    this.cmd = cmd;
    this.options = options;
  }

  /**
   * Run MeCab (the cmd specified by the constructor).
   *
   * Requires `allow-run` permission.
   */
  private async runMeCab(text: string, cmdArgs?: string[]): Promise<string> {
    const options: Deno.RunOptions = {
      cmd: cmdArgs ? this.cmd.concat(cmdArgs) : this.cmd,
      cwd: this.options?.cwd,
      env: this.options?.env,
      stdout: "piped",
      stdin: "piped",
    };

    const process = Deno.run(options);

    // Write text to stdin
    await process.stdin?.write(new TextEncoder().encode(text));
    process.stdin?.close();

    const [{ code }, stdout] = await Promise.all([
      process.status(),
      process.output(),
    ]);
    process.close();

    if (code !== 0) {
      throw new Error(
        `MeCab exited with code ${code}. MeCab stdout: ${stdout}`,
      );
    }

    return new TextDecoder().decode(stdout);
  }

  /**
   * Parse text.
   * Requires `allow-run` permission.
   */
  async parse(text: string): Promise<ParsedWord[]> {
    const result = await this.runMeCab(text);

    // Remove not needed symbol
    const splitedResult = result
      .replace(/\nEOS\n/, "")
      .replace(/\t/g, ",")
      .split("\n");

    const parsedWords: ParsedWord[] = [];

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
   * Get a dump of text.
   * Requires `allow-run` permission.
   */
  async dump(text: string): Promise<ParsedDumpWord[]> {
    const result = await this.runMeCab(text, ["-Odump"]);

    // Remove not needed symbol
    const splitedLines = result.replace(/\n$/, "").split("\n");

    const parsedWords: ParsedDumpWord[] = [];

    for (const line of splitedLines) {
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
   * Word-separate text.
   * Requires `allow-run` permission.
   */
  async wakati(text: string): Promise<string[]> {
    const result = await this.runMeCab(text, ["-Owakati"]);

    const editedResult = result.split(" ");
    editedResult.pop();

    return editedResult;
  }

  /**
   * Add reading to text.
   * Requires `allow-run` permission.
   */
  async yomi(text: string): Promise<string> {
    const result = await this.runMeCab(text, ["-Oyomi"]);

    const editedResult = result.replace(/ \n/g, "");
    return editedResult;
  }
}
