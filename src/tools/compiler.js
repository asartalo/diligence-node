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


async function compileForE2E() {
  // Cleanup e2e dir
  await shellRunner(`mkdir -p "${e2eBuildDir}"`).run();
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
  log(`Extension has been compiled to "${e2eXpi}"`);
}

async function compileForRelease() {
  // Create dir
  await shellRunner(`mkdir -p "${releaseDir}"`).run();
  // Cleanup dir
  await shellRunner(`rm -R "${releaseDir}/*"`).run();
  // Copy src contents
  await shellRunner(`cp -R "${srcExtensionDir}/" "${releaseDir}/"`).run();
  // Remove test files
  await shellRunner(`rm  "${releaseDir}"/**/*.test.js`).run();

  await zipper(e2eBuildDir, releaseXpi);
  log(`Extension has been compiled to "${releaseXpi}"`);
}

export { compileForE2E, compileForRelease };
