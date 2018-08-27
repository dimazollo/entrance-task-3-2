module.exports  = class ResultData {
  constructor (schedule) {
    this.schedule = {}
    for (let i = 0; i < 24; i++) {
      this.schedule[i] = []
    }
    this.consumedEnergy = {
      value: 0,
      devices: {}
    }

    if (schedule) {
      this.load(schedule)
    }
  }

  load (schedule) {
    schedule.forEach((element, i) => {
      element.devices.forEach(device => {
        this.schedule[i].push(device.id)
        // Init field of device if it is not presented yet
        if (!this.consumedEnergy.devices[device.id]) {
          this.consumedEnergy.devices[device.id] = 0
        }
        const cost = element.rate * device.power / 1000
        this.consumedEnergy.devices[device.id] += cost
        this.consumedEnergy.value += cost
      })
    })
  }
}