const path = require('path');
const fs = require('node:fs/promises');
const crypto = require('crypto');

async function copyDir() {
  const mainDir = path.join(__dirname, 'files');
  const copyDir = path.join(__dirname, 'files-copy');
  
  await fs.mkdir(copyDir, { recursive: true });
  const copyedFilesArr = (await fs.readdir(copyDir, { withFileTypes: true })).map(({ name }) => name);
  const filesArr = (await fs.readdir(mainDir, { withFileTypes: true })).map(({ name }) => name);
  
  for (const file of copyedFilesArr) {
    if (!filesArr.includes(file)) {
      fs.rm(path.join(copyDir, file));
    }
  }

  for (const file of filesArr) {
    if (!copyedFilesArr.includes(file)) {
      fs.copyFile(path.join(mainDir, file), path.join(copyDir, file));
    } else {
      const fdOrigin = await fs.open(path.join(mainDir, file));
      const dataOrigin = await fdOrigin.readFile();
      const originHash = crypto.createHash('md5').update(dataOrigin).digest('hex');

      const fdCopy = await fs.open(path.join(copyDir, file));
      const dataCopy = await fdCopy.readFile();
      const copyHash = crypto.createHash('md5').update(dataCopy).digest('hex');

      if (originHash !== copyHash) {
        await fs.writeFile(path.join(copyDir, file), dataOrigin);
      }

      fdOrigin.close();
      fdCopy.close();
    }
  }
}

copyDir();
