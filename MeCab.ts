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


  private async runCommand(text: string, cmdArgs?: string[]): Promise<string> {
    const options: Deno.RunOptions = {
      cmd: (cmdArgs ? this.cmd.concat(cmdArgs) : this.cmd),
      cwd: this.options?.cwd,
      env: this.options?.env,
      stdout: "piped",
      stderr: "piped",
      stdin: "piped",
    };

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const process = Deno.run(options);

    await process.stdin?.write(encoder.encode(text));
    process.stdin?.close();

    const [{ code }, stdout, stderr] = await Promise.all([
      process.status(),
      process.output(),
      process.stderrOutput()
    ]);

    // Check process exited with exit code 0
    if(code !== 0) {
      if(stdout !== new Uint8Array([])) {
        throw stderr;
      } else {
        throw stdout;
      }
    }

    const decodedOutput = decoder.decode(stdout);
    return decodedOutput;
  }

  async wakati(text: string): Promise<string[]> {
    let result: string;
    try {
      result = await this.runCommand(text, ['-Owakati']);
    } catch(err) {
      throw new Error(`Failed to run MeCab correctly: ${err.message}`);
    }

    const editedResult = result.split(" ");
    editedResult.pop();

    return editedResult;
  }
}
