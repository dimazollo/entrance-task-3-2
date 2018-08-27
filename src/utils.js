function modeOfHour (value) {
  if (value >= 7 && value < 21) {
    return 'day'
  } else {
    return 'night'
  }
}

module.exports.modeOfHour = modeOfHour