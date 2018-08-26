module.exports = class Schedule {
  constructor (rates) {
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
    this.forEach(element => {
      if (testFunction(element)) {
        result.push(element)
      }
    })
    return result
  }
}

// FIXME
class ResultData {
  constructor () {
    this.schedule = {}
    this.consumedEnergy = {
      value: 0,
      devices: {}
    }
  }
}
