const modeOfHour = require('./utils').modeOfHour

module.exports = class Schedule {
  constructor (rates, maxPower) {
    for (let i = 0; i < 24; i++) {
      this[i] = {
        devices: [],
        rate: 0
      }
    }

    if (rates) {
      rates.forEach(rate => {
        this.applyToRange(rate.from, rate.to, (element) => {
          element.rate = rate.value
        })
      })
    }

    if (maxPower) {
      this.maxPower = maxPower
    }
  }

  forEach (callback) {
    for (let i = 0; i < 24; i++) {
      callback(this[i], i, this)
    }
  }

  applyToRange(from, to, callback) {
    if (from > to) {
      // From bigger value to 00:00
      for (let i = from; i < 24; i++) {
        callback(this[i], i, this)
      }
      // From 00:00 to lower value
      for (let i = 0; i < to; i++) {
        callback(this[i], i, this)
      }
    } else {
      for (let i = from; i < to; i++) {
        callback(this[i], i, this)
      }
    }
  }

  findByCriteria (testFunction) {
    const result = []
    this.forEach((element, i) => {
      if (testFunction(element)) {
        result.push({key: i, value: element})
      }
    })
    return result
  }

  getMostEfficientZone (duration, minRemainingCapacity, mode) {
    const availableZones = this.getAvailableZones(duration, minRemainingCapacity, mode)
    if (availableZones.length > 0) {
      let mostEfficientZone = availableZones[0]
      availableZones.forEach(element => {
        if (element.sumOfRates < mostEfficientZone.sumOfRates) {
          mostEfficientZone = element
        }
      })
      return mostEfficientZone
    } else {
      return false
    }
  }

  getAvailableZones (duration, minRemainingCapacity, mode) {
    const availableZones = []
    this.forEach((element, i) => {
      const upperBoundary = i + duration < 24 ? i + duration : i + duration - 24
      // check if zone belongs to specified mode
      const matchesMode = modeOfHour(i) === mode && modeOfHour(upperBoundary - 1) === mode || !mode
      // check if zone has enough remaining capacity
      const zoneInfo = this.checkZoneForCapacity(i, upperBoundary, minRemainingCapacity)
      // if both to add zone info to result list
      // zone info looks like {from, to, sumOfRates}
      if (zoneInfo && matchesMode) {
        availableZones.push(zoneInfo)
      }
    })
    return availableZones
  }

  // TODO поиск самой дешевой зоны по критериям - длительность, остаточная вместимость, режим работы
  checkZoneForCapacity (from, to, minRemainingCapacity) {
    let isZoneValid = true
    let sumOfRates = 0
    this.applyToRange(from, to, el => {
      sumOfRates += el.rate

      let totalPower = 0
      el.devices.forEach(device => {
        totalPower += device.power
      })

      if (this.maxPower - totalPower < minRemainingCapacity) {
        isZoneValid = false
      }
    })

    if (isZoneValid) {
      return {from, to, sumOfRates}
    } else {
      return false
    }
  }

  addDeviceToZone (from, to, device) {
    this.applyToRange(from, to, element => {
      element.devices.push(device)
    })
  }
}
