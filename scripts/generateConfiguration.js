#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '../config.json');

const defaultConf = {
  appId: 'YOUR_APP_ID',
  appHash: 'APP_HASH',
  appVersion: '0.0.0',
};

let newConf = defaultConf;

if (fs.existsSync(CONFIG_FILE)) {
  const currConf = JSON.parse(fs.readFileSync(CONFIG_FILE));
  newConf = Object.assign({}, defaultConf, currConf);
}
fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConf, null, 2));
