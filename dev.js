import chokidar from 'chokidar';
import clear from 'clear';
import shellRunner from './src/tools/shell-runner';
import {
  rootDir,
  srcDir,
  e2eDir,
  buildDir,
  toolsDir,
} from './src/tools/paths';

const ignorePaths = [
  `${rootDir}/node_modules/**`,
  `${rootDir}/coverage/**`,
  `${buildDir}/**`,
  '**/.git/**',
  '.DS_Store',
];


const devScript = `${toolsDir}/dev.js`;
const log = console.log.bind(console);
const errLog = console.error.bind(console);

const runner = shellRunner(
  `node --require=esm ${devScript}`,
  { stdio: 'inherit' },
);

function logShell(input) {
  log(input.stdout);
  return input;
}

function run(path) {
  clear();
  if (path) {
    log('File changed', path);
  }
  runner.kill('SIGINT');
  runner.run(path)
    .then(logShell)
    .catch(errLog);
}

// Watch for changes in the src path and compile
chokidar.watch([srcDir, e2eDir], {
  ignoreInitial: true,
  ignored: ignorePaths,
})
  .on('change', run)
  .on('add', run)
  .on('add', run);

run();
