const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

async function getFiles() {
  const pathToDir = path.join(__dirname, 'secret-folder');
  try {
    const filesArr = await readdir(pathToDir, {encoding: 'utf-8', withFileTypes: true});
    for (const file of filesArr) {
      const { base, name, ext } = path.parse(file.name);
      fs.stat((path.join(pathToDir, base)), (_err, stats) => {
        if (!stats.isDirectory()) {
          console.log(`${name} - ${ext.replace(/\./, '')} - ${(stats.size / 1024).toFixed(3)}kb`);
        }
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}

getFiles();
