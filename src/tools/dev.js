/* eslint no-console: "off" */
import chokidar from 'chokidar';
import notifier from 'node-notifier';
import clear from 'clear';
import shellRunner from './shell-runner';

import debounced from './debounced';
import {
  rootDir,
  binDir,
  srcDir,
  buildDir,
} from './paths';

const ignorePaths = [
  `${rootDir}/node_modules/**`,
  `${rootDir}/coverage/**`,
  `${buildDir}/**`,
  '**/.git/**',
  '.DS_Store',
];

const log = console.log.bind(console);
const errLog = console.error.bind(console);

function sendLintNotification(input) {
  const { code } = input;
  if (code !== 0) {
    notifier.notify('Lint Errors Found');
  }
  return input;
}
function logShell(input) {
  log(input.stdout);
  return input;
}

let stepCount = 0;
function stepTitle(title) {
  stepCount += 1;
  const step = `${stepCount}. ${title}`;
  let underline = '';
  for (let i = 0, len = step.length; i < len; i++) {
    underline += '=';
  }
  console.log(`\n${step}\n${underline}\n`);
}

function lintFiles() {
  stepTitle('Linting files...');
  return shellRunner(
    `${binDir}/eslint ${srcDir}`,
    { stdio: 'inherit' },
  )
    .run()
    .then(logShell)
    .then(sendLintNotification)
    .then(({ code }) => {
      if (code !== 0) {
        throw Error('Linting errors found');
      }
    })
    .then(() => console.log('Linting files done.\n\n'));
}

const debouncedLintFiles = debounced(lintFiles, 100);

function getFilesFromPath(path) {
  let testFile; let
    jsFile;
  const testFileMatch = path.match(/^(.+)\.test.js$/);

  if (testFileMatch) {
    testFile = path;
    jsFile = `${testFileMatch[1]}.js`;
  } else {
    const jsFileMatch = path.match(/^(.+)\.js$/);
    if (jsFileMatch) {
      jsFile = path;
      testFile = `${jsFileMatch[1]}.test.js`;
    }
  }

  return {
    testFile,
    jsFile,
  };
}

async function runTests(path) {
  let success = true;
  try {
    if (path) {
      stepTitle('Running individual test');
      console.log(`File: ${path}`);
      const { code } = await shellRunner(
        `npm run test-single ${path}`,
        { stdio: 'inherit' },
      ).run().then(logShell);
      if (code !== 0) {
        throw Error('Test failed');
      }
    }
    stepTitle('Running all unit tests');
    const { code } = await shellRunner(
      'npm run test',
      { stdio: 'inherit' },
    ).run().then(logShell);

    if (code !== 0) {
      throw Error('Some tests failed');
    }
  } catch (e) {
    console.log(e.message);
    console.log(e.stack);
    success = false;
  }

  return success;
}

async function compileToDist() {
  stepTitle('Compiling files for distribution');
  // return new Promise((resolve, reject) => {
  //   glob(
  //     `${srcDir}/**/!(*.test.js)`,
  //     { nodir: true },
  //     (err, files) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         Promise.all(
  //           files.map(file => compileFileToDist(file)),
  //         ).then(result => {
  //           console.log('Compilation done.');
  //           resolve(result);
  //         });
  //       }
  //     },
  //   );
  // });
}

async function devPipeline(path) {
  const { testFile } = getFilesFromPath(path);

  clear();
  stepCount = 0;

  try {
    await debouncedLintFiles(path);
    const testsSucceeded = await runTests(testFile);

    if (testsSucceeded) {
      compileToDist();
    }
  } catch (e) {
    errLog(e);
  }
}

// Watch for changes in the src path and compile
chokidar.watch(srcDir, {
  ignoreInitial: true,
  ignored: ignorePaths,
})
  .on('change', devPipeline)
  .on('add', devPipeline)
  .on('add', devPipeline);
