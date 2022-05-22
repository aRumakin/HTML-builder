const path = require('path');
const fs = require('node:fs/promises');

async function buitlHTML() {
  const originAssets = path.join(__dirname, 'assets');
  const projectDist = path.join(__dirname, 'project-dist');
  const projectAssets = path.join(projectDist, 'assets');

  await fs.mkdir(projectDist, { recursive: true });
  await fs.mkdir(path.join(projectDist, 'assets'), { recursive: true });

  const fdFile = await fs.open(path.join(__dirname, 'template.html'));
  const originHTML = await fdFile.readFile('utf-8');

  const regExp = /\{\{\w+\}\}/gm;
  const componentsForReplace = [...originHTML.match(regExp)];

  let newHTML = originHTML;
  componentsForReplace.forEach(async (comp) => {
    const fileName = comp.match(/\w+/)[0];
    const replaceComp = await fs.open(path.join(__dirname, 'components', `${fileName}.html`));
    const replaceHTML = await replaceComp.readFile('utf-8');
    newHTML = newHTML.replace(`{{${fileName}}}`, replaceHTML);
  });

  const originCssPath = path.join(__dirname, 'styles');
  const originCssArr = await fs.readdir(originCssPath, { withFileTypes: true });

  const bundledCss = await fs.open(path.join(projectDist, 'style.css'), 'w');
  const writebleStream = bundledCss.createWriteStream();

  originCssArr.forEach(async (file) => {
    if (file.isFile()) {
      const filePaht = path.join(originCssPath, file.name);
      if (path.extname(filePaht) === '.css') {
        const fileCss = await fs.open(filePaht, 'r');
        const readStream = fileCss.createReadStream('utf-8');
        readStream.pipe(writebleStream);
      }
    }
  });
  const indexHTML = await fs.open(path.join(projectDist, 'index.html'), 'w');
  await indexHTML.writeFile(newHTML, 'utf-8');
  
  recursiveCopy(originAssets, projectAssets);
}

async function recursiveCopy (originPath, copyPath) {

  const originArray = await fs.readdir(originPath, { withFileTypes: true });
  
  originArray.forEach(async (file) => {

    const currOriginPath = path.join(originPath, file.name);
    const currCopyPath = path.join(copyPath, file.name);

    if (file.isDirectory()) {
        
      await fs.mkdir(currCopyPath, { recursive: true });
      await recursiveCopy(currOriginPath, currCopyPath);
    } else {
      await fs.copyFile(currOriginPath, currCopyPath);
    }
  });
}

buitlHTML();
