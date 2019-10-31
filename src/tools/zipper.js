import { createWriteStream, promises as fsp } from 'fs';
import archiver from 'archiver';
import { dirname } from 'path';

async function zipper(folder, zipFile) {
  await fsp.access(folder);
  await fsp.access(dirname(zipFile));
  const output = createWriteStream(zipFile);
  const zipArchive = archiver('zip');

  return new Promise(resolve => {
    output.on('close', () => resolve(zipFile));
    zipArchive.pipe(output);
    zipArchive.directory(folder, '/');
    zipArchive.finalize();
  });
}

export default zipper;
