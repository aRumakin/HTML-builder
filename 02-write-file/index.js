const path = require('path');
const fs = require('fs');
const process = require('node:process');

console.log('Hello there!');

const writeFile = fs.createWriteStream(path.join(__dirname, 'text.txt'));

process.stdin.on('data', data => {
  const typedText = data.toString().trim();
  if (typedText.match(/exit/)) {
    console.log('Have a good day!');
    process.exit();
  }
  writeFile.write(typedText);
});

console.log('Enter text:');

process.on('exit', () => {
  console.log('Process is done.');
});

process.on('SIGINT', () => {
  console.log('\nHave a good day, you!');
  process.exit();
});
