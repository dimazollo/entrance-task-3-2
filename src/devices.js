// get devices with only one variant of allocation in schedule
function getStaticDevices (devices) {
  const staticDevices = []
  devices.forEach(device => {
    if (calculateDeviceAllocationVariations(device.duration, device.mode) === 1) {
      staticDevices.push(device)
    }
  })
  return staticDevices
}

// Calculate the number of allocation variants of the device in the schedule
function calculateDeviceAllocationVariations (duration, mode) {
  if (mode === 'night') {
    const nightDuration = 10
    if (duration <= nightDuration) {
      return nightDuration - duration + 1
    }
  } else if (mode === 'day') {
    const dayDuration = 14
    if (duration <= dayDuration) {
      return dayDuration - duration + 1
    }
  } else if (mode === undefined) {
    return duration < 24 ? 24 : 1
  }
}

// find the device which consume the most amount of energy (power * duration)
function getMostGreedyDevice (devices) {
  if (devices.length > 0) {
    let mostGreedyDevice = devices[0]
    devices.forEach(device => {
      if (mostGreedyDevice.power * mostGreedyDevice.duration < device.power * device.duration) {
        mostGreedyDevice = device
      }
    })
    return mostGreedyDevice
  } else {
    return false
  }
}


module.exports.getStaticDevices = getStaticDevices
module.exports.calculateVariations = calculateDeviceAllocationVariations
module.exports.getMostGreedyDevice = getMostGreedyDevice
