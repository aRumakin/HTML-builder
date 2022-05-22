const fs = require('fs');
const path = require('path');
// const { readFile } = require('fs');

const pathToText = path.join(__dirname, '/text.txt');
// readFile(pathToText, 'utf-8', (err, data) => {
//   if (err) throw err(`Error while reading file ${pathToText}`);
//   console.log(data);
// });

const stream = new fs.ReadStream(pathToText, 'utf-8');
stream.on('readable', () => {
  const data = stream.read();
  data === null
    ? ''
    : console.log(data);
});

stream.on('end', () => {
  console.log('Done.');
});
