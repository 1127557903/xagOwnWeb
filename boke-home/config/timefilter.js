const moment = require('moment')
function timeChange(value) {
    let day = moment(value);
    let bol = day.isSame(moment(), "day");
    let yearBool = day.isSame(moment().endOf("year"), "year");
    if (bol) {
      moment.locale("zh-cn");
      let res = moment(value).fromNow();
      return res;
    }
    if (yearBool) {
      return moment(value).format("MM-DD");
    }
    return moment(value).format("YYYY-MM-DD");
}

module.exports = timeChange