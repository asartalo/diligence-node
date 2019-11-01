import notifier from 'node-notifier';
import { promises as fsp } from 'fs';
import { log, errLog } from './loggers';
import shellRunner from './shell-runner';
import { compileForE2E, compileForRelease } from './compiler';

import debounced from './debounced';
import {
  binDir,
  srcDir,
  e2eDir,
} from './paths';

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
  log(`\n${step}\n${underline}\n`);
}

function lintFiles() {
  stepTitle('Linting files...');
  return shellRunner(
    `${binDir}/eslint ${srcDir} ${e2eDir}`,
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
    .then(() => log('Linting files done.\n\n'));
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
      log(`File: ${path}`);
      const { code } = await shellRunner(
        `npm run test-single ${path}`,
        { stdio: 'inherit' },
      ).run().then(logShell);
      if (code !== 0) {
        throw Error('Test failed');
      }
    } else {
      log('No test file found for current file');
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
    log(e.message);
    log(e.stack);
    success = false;
  }

  return success;
}

async function runE2E() {
  await compileForE2E();
  stepTitle('Running end-to-end tests');
  const { code } = await shellRunner('npm run e2e', { stdio: 'inherit' }).run();
  return code === 0;
}

const e2eTimeoutMinutes = 2;
let e2eTimeout;
async function runE2EAfterTimeout() {
  return new Promise(resolve => {
    clearTimeout(e2eTimeout);
    log(`Will run end-to-end tests in ${e2eTimeoutMinutes} minutes of inactivity`);
    e2eTimeout = setTimeout(async () => {
      resolve(await runE2E());
      clearTimeout(e2eTimeout);
    }, 60000 * e2eTimeoutMinutes);
  });
}

function isE2EFile(filePath) {
  return filePath && filePath.includes(e2eDir);
}

async function devPipeline(path) {
  const { testFile } = getFilesFromPath(path);
  const isE2E = isE2EFile(path);

  stepCount = 0;
  let e2eSucceeded = false;

  try {
    await debouncedLintFiles(path);
    let testsSucceeded = true;
    if (!isE2E) {
      testsSucceeded = await runTests(testFile);
    }

    if (testsSucceeded) {
      e2eSucceeded = isE2E
        ? await runE2E()
        : await runE2EAfterTimeout();
    }

    if (e2eSucceeded) {
      stepTitle('Compiling files for release');
      compileForRelease();
    }
  } catch (e) {
    errLog(e);
  }
}

const args = process.argv.slice(2);
devPipeline(args[0]);
