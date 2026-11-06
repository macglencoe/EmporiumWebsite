export async function promptHidden(label) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('This command requires an interactive terminal');
  process.stdout.write(label); process.stdin.setRawMode(true); process.stdin.resume(); process.stdin.setEncoding('utf8');
  let value = '';
  return new Promise((resolve, reject) => process.stdin.on('data', function onData(character) {
    if (character === '\u0003') { process.stdin.setRawMode(false); process.stdin.pause(); reject(new Error('Cancelled')); return; }
    if (character === '\r' || character === '\n') { process.stdin.off('data', onData); process.stdin.setRawMode(false); process.stdin.pause(); process.stdout.write('\n'); resolve(value); return; }
    if (character === '\u007f') { value = value.slice(0, -1); return; }
    if (character >= ' ') value += character;
  }));
}
