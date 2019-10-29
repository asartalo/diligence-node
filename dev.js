import chokidar from 'chokidar';
import shellRunner from './src/tools/shell-runner';
import { toolsDir } from './src/tools/paths';

const devScript = `${toolsDir}/dev.js`;
const log = console.log.bind(console);
const errLog = console.error.bind(console);

const runner = shellRunner(
  `node --require=esm ${devScript}`,
  { stdio: 'inherit' },
);

function run() {
  runner.kill('SIGINT');
  runner.run()
    .then(logShell)
    .catch(errLog);
}

// Watch for changes for dev script
chokidar.watch(toolsDir, {
  ignoreInitial: false,
})
  .on(
    'change',
    (path) => {
      log('Scripts changed...', path);
      run();
    },
  );

function logShell(input) {
  log(input.stdout);
  return input;
}

run();
