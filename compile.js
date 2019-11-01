import { compileForE2E, compileForRelease } from './src/tools/compiler';

let e2e = false;
const args = process.argv.slice(2);
if (args.length > 0) {
  const argument = args[0].trim();
  if (argument === 'e2e') {
    e2e = true;
  }
}

if (e2e) {
  compileForE2E();
} else {
  compileForRelease();
}
