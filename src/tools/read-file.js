import { promises as fsp } from 'fs';

async function readFile(file) {
  let contents;
  try {
    contents = await fsp.readFile(file, 'utf8');
  } catch (e) {
    console.log(`Unable to read file contents of ${file}.`);
    throw e;
  }
  return contents;
}

export default readFile;
