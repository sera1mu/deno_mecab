interface MeCabOptions {
  cwd?: string;
  env?: { [key: string]: string };
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
  async parse(text: string): Promise<string[][]> {
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
    const parsedResult = [];

    // Edit result
    for (const line of splitedResult) {
      const splitedLine = line.split(",");
      parsedResult.push(splitedLine);
    }

    return parsedResult;
  }

  /**
   * Get a dump of text
   */
  async dump(text: string): Promise<string[][]> {
    // Run MeCab
    let result: string;
    try {
      result = await this.runMeCab(text, ["-Odump"]);
    } catch (err) {
      throw MeCab.generateMeCabRunError(err.message);
    }

    // Remove not needed symbol
    const splitedResult = result.replace(/\n$/, "").split("\n");
    const parsedResult = [];

    // Edit result
    for (const line of splitedResult) {
      const splitedLine = line.split(" ");
      const splitedLineFeature: string[] = splitedLine[2].split(",");
      // deno-lint-ignore no-explicit-any
      const finallySplitedLine: any = splitedLine;
      finallySplitedLine[2] = splitedLineFeature;
      parsedResult.push(finallySplitedLine);
    }

    return parsedResult;
  }

  /**
   * Parse (morphological analysis) text in Chasen compatible
   * @param includeSpaces Whether to ignore half-width spaces
   */
  async chasen(text: string, includeSpaces?: boolean): Promise<string[][]> {
    // Run MeCab
    let result: string;
    try {
      result = await this.runMeCab(
        text,
        // If enabled includeSpaces, run -Ochasen2
        includeSpaces ? ["-Ochasen2"] : ["-Ochasen"],
      );
    } catch (err) {
      throw MeCab.generateMeCabRunError(err.message);
    }
    // Remove not needed symbol
    const splitedResult = result
      .replace(/\nEOS\n/, "")
      .replace(/\t/g, ",")
      .split("\n");
    const parsedResult = [];

    // Edit result
    for (const line of splitedResult) {
      const splitedLine = line.split(",");
      parsedResult.push(splitedLine);
    }

    return parsedResult;
  }

  /**
   * Text parsing (morphological analysis) and outputting only morphemes and part of speech
   */
  async simple(text: string): Promise<string[][]> {
    // Run MeCab
    let result: string;
    try {
      result = await this.runMeCab(text, ["-Osimple"]);
    } catch (err) {
      throw MeCab.generateMeCabRunError(err.message);
    }
    // Remove not needed symbol
    const splitedResult = result
      .replace(/\nEOS\n/, "")
      .replace(/\t/g, ",")
      .split("\n");
    const parsedResult = [];

    // Edit result
    for (const line of splitedResult) {
      const splitedLine = line.split(",");
      parsedResult.push(splitedLine);
    }

    return parsedResult;
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
