const fs = require('fs');

function readData (inputFilePath) {
  const fileContent = fs.readFileSync(inputFilePath, 'utf-8');
  return JSON.parse(fileContent)
}

function writeData (outputFilePath, dataObject) {
  const dataJson = JSON.stringify(dataObject)
  fs.writeFileSync(outputFilePath, dataJson)
}

module.exports.readData = readData
module.exports.writeData = writeData
