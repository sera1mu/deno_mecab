interface MeCabOptions {
  cwd?: string;
  env?: { [key: string]: string; };
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
   * Run MeCab(cmd)
   * @param cmdArgs After cmd args (e.g. -Ochasen)
   */
  private async runMeCab(text: string, cmdArgs?: string[]): Promise<string> {
    const options: Deno.RunOptions = {
      cmd: (cmdArgs ? this.cmd.concat(cmdArgs) : this.cmd),
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

    // Check process exited with exit code 0
    if(code !== 0) {
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
    const result = await this.runMeCab(text);
    // Remove not needed symbol
    const splitedResult = result.replace(/\nEOS\n/, '').split("\n");
    const parsedResult = [];

    // Edit result
    for(const line of splitedResult) {
      const splitedLine = line.replace(/\t/, ",").split(",");
      parsedResult.push(splitedLine);
    }

    return parsedResult;
  }

  /**
   * Get a dump of text
   */
  async dump(text: string): Promise<string[][]> {
    // Run MeCab
    const result = await this.runMeCab(text, ["-Odump"]);

    // Remove not needed symbol
    const splitedResult = result.replace(/\n$/, '').split("\n");
    const parsedResult = [];

    // Edit result
    for(const line of splitedResult) {
      const splitedLine = line.split(" ");
      const splitedLineFeature: string[] = splitedLine[2].split(",");
      let finallySplitedLine: any = splitedLine;
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
    const result = await this.runMeCab(text, includeSpaces ? ["-Ochasen2"] : ["-Ochasen"]);
    // Remove not needed symbol
    const splitedResult = result.replace(/\nEOS\n/, '').split("\n");
    const parsedResult = [];

    // Edit result
    for(const line of splitedResult) {
      const splitedLine = line.replace(/\t/g, ",").split(",");
      parsedResult.push(splitedLine);
    }

    return parsedResult;
  }

  /**
   * Text parsing (morphological analysis) and outputting only morphemes and part of speech
   */
  async simple(text: string): Promise<string[][]> {
    // Run MeCab
    const result = await this.runMeCab(text, ["-Osimple"]);
    // Remove not needed symbol
    const splitedResult = result.replace(/\nEOS\n/, '').split("\n");
    const parsedResult = [];

    // Edit result
    for(const line of splitedResult) {
      const splitedLine = line.replace(/\t/, ",").split(",");
      parsedResult.push(splitedLine);
    }

    return parsedResult;
  }

  /**
   * Word-separate text
   */
  async wakati(text: string): Promise<string[]> {
    let result: string;
    try {
      // Run MeCab
      result = await this.runMeCab(text, ['-Owakati']);
    } catch(err) {
      throw new Error(`Failed to run MeCab correctly: ${err.message}`);
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
    let result: string;
    try {
      // Run MeCab
      result = await this.runMeCab(text, ['-Oyomi']);
    } catch(err) {
      throw new Error(`Failed to run MeCab correctly: ${err.message}`);
    }

    // Edit result
    const editedResult = result.replace(/\n/g, "");
    return editedResult;
  }
}
