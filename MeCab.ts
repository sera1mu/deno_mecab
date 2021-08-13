interface MeCabOptions {
  cwd?: string;
  env?: { [key: string]: string; };
}

export class MeCab {
  private cmd: string[];
  private options?: MeCabOptions;

  constructor(cmd: string[], options?: MeCabOptions) {
    this.cmd = cmd;
    this.options = options;
  }

  private async runMeCab(text: string, cmdArgs?: string[]): Promise<string> {
    const options: Deno.RunOptions = {
      cmd: (cmdArgs ? this.cmd.concat(cmdArgs) : this.cmd),
      cwd: this.options?.cwd,
      env: this.options?.env,
      stdout: "piped",
      stdin: "piped",
    };

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const process = Deno.run(options);

    await process.stdin?.write(encoder.encode(text));
    process.stdin?.close();

    const [{ code }, stdout] = await Promise.all([
      process.status(),
      process.output(),
    ]);

    // Check process exited with exit code 0
    if(code !== 0) {
        throw stdout;
    }

    const decodedOutput = decoder.decode(stdout);
    return decodedOutput;
  }

  async parse(text: string): Promise<string[][]> {
    const result = await this.runMeCab(text);
    const splitedResult = result.replace(/\nEOS\n/, '').split("\n");
    const parsedResult = [];

    for(const line of splitedResult) {
      const splitedLine = line.replace(/\t/, ",").split(",");
      parsedResult.push(splitedLine);
    }

    return parsedResult;
  }

  async dump(text: string): Promise<string[][]> {
    const result = await this.runMeCab(text, ["-Odump"]);
    const splitedResult = result.replace(/\n$/, '').split("\n");
    const parsedResult = [];

    for(const line of splitedResult) {
      const splitedLine = line.split(" ");
      const splitedLineFeature: string[] = splitedLine[2].split(",");
      let finallySplitedLine: any = splitedLine;
      finallySplitedLine[2] = splitedLineFeature;
      parsedResult.push(finallySplitedLine);
    }

    return parsedResult;
  }

  async chasen(text: string, includeSpaces?: boolean): Promise<string[][]> {
    const result = await this.runMeCab(text, includeSpaces ? ["-Ochasen2"] : ["-Ochasen"]);
    const splitedResult = result.replace(/\nEOS\n/, '').split("\n");
    const parsedResult = [];

    for(const line of splitedResult) {
      const splitedLine = line.replace(/\t/g, ",").split(",");
      parsedResult.push(splitedLine);
    }

    return parsedResult;
  }

  async wakati(text: string): Promise<string[]> {
    let result: string;
    try {
      result = await this.runMeCab(text, ['-Owakati']);
    } catch(err) {
      throw new Error(`Failed to run MeCab correctly: ${err.message}`);
    }

    const editedResult = result.split(" ");
    editedResult.pop();

    return editedResult;
  }

  async yomi(text: string): Promise<string> {
    let result: string;
    try {
      result = await this.runMeCab(text, ['-Oyomi']);
    } catch(err) {
      throw new Error(`Failed to run MeCab correctly: ${err.message}`);
    }

    const editedResult = result.replace(/\n/g, "");
    return editedResult;
  }
}
