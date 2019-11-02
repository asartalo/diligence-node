import { promises as fsp } from 'fs';
import { log } from './loggers';
import shellRunner from './shell-runner';
import readFile from './read-file';
import zipper from './zipper';

import {
  srcExtensionDir,
  toolsDir,
  e2eBuildDir,
  e2eXpi,
  releaseDir,
  releaseXpi,
} from './paths';

function run(cmd) {
  console.log(`Running command: ${cmd}`);
  return shellRunner(cmd, { stdio: 'inherit' }).run();
}

async function compileForE2E() {
  // Cleanup e2e dir
  await run(`mkdir -p "${e2eBuildDir}"`);
  // Cleanup e2e dir
  await run(`rm -R "${e2eBuildDir}"/*`);
  // Copy src contents
  await run(`cp -R "${srcExtensionDir}"/* "${e2eBuildDir}/"`);
  // Remove test files
  await run(`rm  "${e2eBuildDir}"/**/*.test.js`);

  // Insert end-to-end scripst to content-script
  const contentScriptFile = `${srcExtensionDir}/content-script.js`;
  const e2eContentScriptFile = `${e2eBuildDir}/content-script.js`;
  const e2eScript = await readFile(`${toolsDir}/e2e-helper.js`);
  const contentScript = await readFile(contentScriptFile);
  await fsp.writeFile(e2eContentScriptFile, `${e2eScript}\n${contentScript}`);

  // Zip the files and save as build/e2e.zip
  await zipper(e2eBuildDir, e2eXpi);
  log(`Extension has been compiled to "${e2eXpi}"`);
}

async function compileForRelease() {
  // Create dir
  await run(`mkdir -p "${releaseDir}"`);
  // Cleanup dir
  await run(`rm -R "${releaseDir}"/*`);
  // Copy src contents
  await run(`cp -R "${srcExtensionDir}"/* "${releaseDir}/"`);
  // Remove test files
  await run(`rm  "${releaseDir}"/**/*.test.js`);

  await zipper(e2eBuildDir, releaseXpi);
  log(`Extension has been compiled to "${releaseXpi}"`);
}

export { compileForE2E, compileForRelease };
