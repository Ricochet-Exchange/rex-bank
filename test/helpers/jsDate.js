module.exports = {
  // Should be standard functions?
  addSeconds: (date, seconds) => {
    let result = new Date(date.valueOf());
    result.setSeconds(result.getSeconds() + seconds);
    return result;
  },
  addDays : (date, days) =>  {
    let result = new Date(date.valueOf());
    result.setDate(result.getDate() + days);
    return result;
  }
}
