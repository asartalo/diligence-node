import { promises as fsp } from 'fs';

async function readFile(file) {
  return fsp.readFile(file, 'utf8');
}

export default readFile;
