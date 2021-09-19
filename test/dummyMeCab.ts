#!/usr/bin/env -S deno run

const buf = new Uint8Array(1024);
const n = <number> await Deno.stdin.read(buf);
const text = new TextDecoder().decode(buf.subarray(0, n)).trim();

if (Deno.args[0] === "-Owakati" || Deno.args[0] === "-Oyomi") {
  await Deno.stdout.write(new TextEncoder().encode(`${text} \n`));
} else if (Deno.args[0] === "-Odump") {
  const result =
    `0 ${text} dummy,*,*,*,*,*,*,*,* 0 0 0 0 0 0 0 0 0.000000 0.000000 0.000000 1`;
  await Deno.stdout.write(new TextEncoder().encode(result));
} else if (!(Deno.args[0])) {
  const result = `${text}\tdummy,*,*,*,*,*,*,*,*\nEOS\n`;
  await Deno.stdout.write(new TextEncoder().encode(result));
} else {
  console.log(`${Deno.args[0]} option is not exist.`);
}
