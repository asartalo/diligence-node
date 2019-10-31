/* eslint no-console: "off" */
import chokidar from 'chokidar';
import notifier from 'node-notifier';
import clear from 'clear';
import { promises as fsp } from 'fs';
import shellRunner from './shell-runner';
import readFile from './read-file';
import zipper from './zipper';

import debounced from './debounced';
import {
  rootDir,
  binDir,
  srcDir,
  buildDir,
  srcExtensionDir,
  toolsDir,
} from './paths';

const e2eBuildDir = `${buildDir}/e2e`;
const e2eXpi = `${buildDir}/e2e.xpi`;

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
  if (!path) {
    return {};
  }

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

  let testFileExists = true;
  try {
    await fsp.access(path);
  } catch (e) {
    testFileExists = false;
  }

  try {
    if (path && testFileExists) {
      stepTitle('Running individual test');
      console.log(`File: ${path}`);
      const { code } = await shellRunner(
        `npm run test-single ${path}`,
        { stdio: 'inherit' },
      ).run().then(logShell);
      if (code !== 0) {
        throw Error('Test failed');
      }
    } else {
      console.log('No test file found for current file');
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

async function compileForE2E() {
  stepTitle('Compiling files for end-to-end tests');

  // Cleanup e2e dir
  await shellRunner(`rm -R "${e2eBuildDir}/*"`).run();
  // Copy src contents
  await shellRunner(`cp -R "${srcExtensionDir}/" "${e2eBuildDir}/"`).run();
  // Remove test files
  await shellRunner(`rm  "${e2eBuildDir}"/**/*.test.js`).run();

  // Insert end-to-end scripst to content-script
  const contentScriptFile = `${srcExtensionDir}/content-script.js`;
  const e2eContentScriptFile = `${e2eBuildDir}/content-script.js`;
  const e2eScript = await readFile(`${toolsDir}/e2e-helper.js`);
  const contentScript = await readFile(contentScriptFile);
  await fsp.writeFile(e2eContentScriptFile, `${e2eScript}\n${contentScript}`);

  // Zip the files and save as build/e2e.zip
  await zipper(e2eBuildDir, e2eXpi);
  console.log(`Extension has been compiled to "${e2eXpi}"`);
}

async function devPipeline(path) {
  const { testFile } = getFilesFromPath(path);

  clear();
  stepCount = 0;

  try {
    await debouncedLintFiles(path);
    const testsSucceeded = await runTests(testFile);
    if (testsSucceeded) {
      compileForE2E();
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

devPipeline();
