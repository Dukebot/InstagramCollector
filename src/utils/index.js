const dotenv = require('dotenv');
const fs = require('fs');

function loadDotenv() {
  dotenv.config();
}

function saveDataAsJson(path, data) {
  if (!path.endsWith('.json')) path += '.json';
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = { loadDotenv, saveDataAsJson };
