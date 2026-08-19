const fs = require('fs');
const path = require('path');

const jsonData = fs.readFileSync('consolidated_cigars.json', 'utf8');
const cigars = JSON.parse(jsonData);

cigars.forEach((cigar) => {
  const name = cigar['Cigar Brand'] + ' ' + cigar['Cigar Name'];
  const slug = name.toLowerCase().replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '-');
  cigar.slug = slug;
});

const updatedJson = JSON.stringify(cigars, null, 2);
fs.writeFileSync('consolidated_cigars.json', updatedJson);