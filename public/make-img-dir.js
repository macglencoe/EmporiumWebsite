// script.js
const fs = require('fs');
const path = require('path');

const jsonData = fs.readFileSync('data/consolidated_cigars.json', 'utf8');
const cigars = JSON.parse(jsonData);

cigars.forEach((cigar) => {
  const slug = cigar.slug;
  const folderPath = path.join('cigars-img', slug);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
});