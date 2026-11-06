const fs = require('fs');
const path = require('path');

const jsonData = fs.readFileSync('pipe-example.json', 'utf8');
const pipes = JSON.parse(jsonData);

pipes.forEach((pipe) => {
  const name = pipe['Pipe Brand'] + ' ' + pipe['Pipe Name'];
  const slug = name.toLowerCase().replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '-');
  pipe.slug = slug;
});

const updatedJson = JSON.stringify(pipes, null, 2);
fs.writeFileSync('pipe-example.json', updatedJson);