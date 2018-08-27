const Schedule = require('./schedule');
const dataio = require('./dataio');
const deviceUtils = require('./devices');

(
  function () {
    const data = dataio.readData('./data/input.json')
    const { devices, rates, maxPower } = data

    const devicesSet = new Set(devices)

    const resultData = {
      schedule: {},
      consumedEnergy: {
        value: 0,
        devices: {}
      }
    }

    // Init schedule object
    const schedule = new Schedule(rates, maxPower)
    // посмотреть устройства с наименьшим количеством вариантов размещения
    const staticDevices = deviceUtils.getStaticDevices(devicesSet)
    // console.log(staticDevices)

    // добавить в расписание все устройства с 1 вариантом размещения
    staticDevices.forEach(device => {
      schedule.addDeviceToZone(0, 24, device)
    })
    staticDevices.forEach(device => {
      devicesSet.delete(device)
    })
    console.log(schedule)

    // найти устройства с максимальным энергопотреблением
    while (devicesSet.size > 0) {
      let device = deviceUtils.getMostGreedyDevice([...devicesSet])
      // найти наиболее дешевую зону для устройства
      let zone = schedule.getMostEfficientZone(device.duration, device.power, device.mode)
      // добавить устройство с максимальным энергопотреблением в самую дешевую зоны
      schedule.addDeviceToZone(zone.from, zone.to, device)
      devicesSet.delete(device)
    }
    // TODO поиск самой дешевой зоны по критериям - длительность, остаточная вместимость
    //
    // console.log(schedule)
    // dataio.writeData('./data/output.json', resultData)
    dataio.writeData('./data/output.json', schedule)
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
