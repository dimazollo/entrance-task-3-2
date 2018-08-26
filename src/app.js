const fs = require('fs');
const Schedule = require('./schedule')

function readData (inputFilePath) {
  const fileContent = fs.readFileSync(inputFilePath, 'utf-8');
  return JSON.parse(fileContent)
}

function writeData (outputFilePath, dataObject) {
  const dataJson = JSON.stringify(dataObject)
  fs.writeFileSync(outputFilePath, dataJson)
}


(
  function main() {
    const data = readData('./data/input.json')
    const { devices, rates, maxPower } = data

    const resultData = {
      schedule: {},
      consumedEnergy: {
        value: 0,
        devices: {}
      }
    }

    const schedule = new Schedule(rates)

    // writeData('./data/output.json', resultData)
  }
)()


// There are only two modes: 'day' and 'night'
function modeOfHour (value) {
  if (value >= 7 && value < 21) {
    return 'day'
  } else {
    return 'night'
  }
}

function getFreeMinimalRate (schedule, maxPower, mode) {

  schedule.forEach(element => {

  })
}
