const fs = require('fs');
const path = require('path');

const directory = './cigars-img';

fs.readdirSync(directory).forEach(folder => {
  const folderPath = path.join(directory, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
      if (path.extname(file) === '.jpg') {
        const filePath = path.join(folderPath, file);
        const newFilePath = path.join(folderPath, 'img.png');
        fs.renameSync(filePath, newFilePath);
        console.log(`Renamed ${file} to img.png in ${folder}`);
      }
    });
  }
});