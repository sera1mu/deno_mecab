#!/usr/bin/env -S deno run

const buf = new Uint8Array(1024);
const n = <number> await Deno.stdin.read(buf);
const text = new TextDecoder().decode(buf.subarray(0, n)).trim();

if (Deno.args[0] === "-Owakati" || Deno.args[0] === "-Oyomi") {
  await Deno.stdout.write(new TextEncoder().encode(`${text} \n`));
} else if (Deno.args[0] === "-Odump") {
  await Deno.stdout.write(new TextEncoder().encode(`0 ${text} dummy,*`));
} else {
  await Deno.stdout.write(new TextEncoder().encode(`${text}\nEOS\n`));
}
