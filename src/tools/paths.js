import { resolve } from 'path';

export const rootDir = resolve(`${__dirname}/../../`);
export const binDir = `${rootDir}/node_modules/.bin`;
export const srcDir = `${rootDir}/src`;
export const srcExtensionDir = `${srcDir}/extension`;
export const buildDir = `${rootDir}/build`;
export const toolsDir = `${srcDir}/tools`;
