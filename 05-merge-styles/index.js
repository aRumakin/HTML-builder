const path = require('path');
const fs = require('node:fs/promises');

const originDir = path.join(__dirname, 'styles');
const copyFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles(originDir, copyFile) {

  await fs.rm(copyFile, { force: true });

  const originFiles = (await fs.readdir(originDir, { withFileTypes: true }));
  const originCssFiles = originFiles.filter(({ name }) => name.match(/.css$/));

  // originCssFiles.forEach((file) => {
  //   if (file.isFile()) {
  //     fs.open(path.join(originDir, file.name))
  //       .then((fdFile) => fdFile.readFile()
  //         .then((data) => fs.appendFile(copyFile, `${data}\n`)
  //         ));
  //   }
  // });
  
  originCssFiles.forEach(async (file) => {
    if (file.isFile()) {
      const fdFile = await fs.open(path.join(originDir, file.name));
      const data = await fdFile.readFile();

      await fs.appendFile(copyFile, `${data}\n`);

      fdFile.close();
    }
  });
}

mergeStyles(originDir, copyFile);
