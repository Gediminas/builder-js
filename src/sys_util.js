const fs = require('fs');
const moment = require('moment');

exports.getTimeStamp = () => new Date().valueOf()

exports.timeToString = timestamp => moment(timestamp)
  .format('YYYY-MM-DD HH:mm:ss')

exports.timeToDir = timestamp => moment(timestamp)
  .format('YYYY-MM-DD_HH-mm-ss_SSS')

//exports.uidToDir = (uid) => {
  //const timestamp = Math.floor(uid / 1000) * 1000
  //const nr = uid % 1000
  //let dir = moment(timestamp).format('YYYY-MM-DD_HH.mm.ss_')
  //dir += nr.toString().padStart(3, "0")
  //const dir = uid.toString()
  //return dir
//}

var uidTail = 0;
exports.generateUid = () =>
  Math.floor(new Date().valueOf() / 1000) * 1000 + (++uidTail) % 1000

exports.ensureDir = (dirPath) => {
  try {
    fs.mkdirSync(dirPath)
    console.log(`Folder created: ${dirPath}`)
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err
    }
  }
}
