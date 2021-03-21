#!/bin/node
const fs = require('fs');
const env = process.argv[2];
const envPath = `./${env}.json`;
let envContent;

if (env === 'local' && !fs.existsSync(envPath)) {
  envContent = require('./local-default.json');
  fs.writeFileSync('./src/env/local.json', JSON.stringify(envContent, undefined, 2));
} else {
  envContent = require(envPath);
}

fs.writeFileSync('./src/env/env.json', JSON.stringify(envContent, undefined, 2));
