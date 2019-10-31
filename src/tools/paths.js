import { resolve } from 'path';

export const rootDir = resolve(`${__dirname}/../../`);
export const binDir = `${rootDir}/node_modules/.bin`;
export const srcDir = `${rootDir}/src`;
export const e2eDir = `${rootDir}/e2e`;
export const srcExtensionDir = `${srcDir}/extension`;
export const buildDir = `${rootDir}/build`;
export const toolsDir = `${srcDir}/tools`;
export const e2eBuildDir = `${buildDir}/e2e`;
export const e2eXpi = `${buildDir}/e2e.xpi`;
export const releaseDir = `${buildDir}/release`;
export const releaseXpi = `${buildDir}/diligence.xpi`;
