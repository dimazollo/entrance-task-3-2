const Schedule = require('./schedule')
const dataio = require('./dataio')
const deviceUtils = require('./devices')
const ResultData = require('./resultData')

module.exports = function smartHome (inputFilePath, outputFilePath) {
  const data = dataio.readData(inputFilePath)
  const { devices, rates, maxPower } = data

  const devicesSet = new Set(devices)

  // Init schedule object
  const schedule = new Schedule(rates, maxPower)
  // Find all devices with only one variant of allocation in schedule
  const staticDevices = deviceUtils.getStaticDevices(devicesSet)

  // Add them to the schedule
  staticDevices.forEach(device => {
    schedule.addDeviceToZone(0, 24, device)
  })
  staticDevices.forEach(device => {
    devicesSet.delete(device)
  })

  // While there are not scheduled devices
  while (devicesSet.size > 0) {
    // Find the most greedy device
    let device = deviceUtils.getMostGreedyDevice([...devicesSet])
    // Find the cheapest zone for device
    let zone = schedule.getMostEfficientZone(device.duration, device.power, device.mode)
    // Schedule the device to the zone
    schedule.addDeviceToZone(zone.from, zone.to, device)
    devicesSet.delete(device)
  }

  // Prepare data and write to output file
  const resultData = new ResultData(schedule)
  dataio.writeData(outputFilePath, resultData)
}
