const fs = require('fs');
const path = require('path');
const moment = require('moment');

exports.getTimeStamp = () => new Date().valueOf();

exports.timeToString = timestamp => moment(timestamp)
  .format('YYYY-MM-DD HH:mm:ss');

exports.timeToDir = timestamp => moment(timestamp)
  .format('YYYY-MM-DD_HH-mm-ss_SSS');

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

exports.ensureDir = (dir) => {
    if (typeof dir !== 'string') {
        console.error('BAD DIR:', dir);
        return dir;
    }
    return path
        .resolve(dir)
        .split(path.sep)
        .reduce((acc, cur) => {
            if (cur.includes(':')) {
                return cur; // disk on windows
            }
            const currentPath = path.normalize(acc + path.sep + cur);
            try {
                fs.statSync(currentPath);
            } catch (e) {
                if (e.code === 'ENOENT') {
                    console.log(`Creating folder ${currentPath}`);
                    fs.mkdirSync(currentPath);
                } else {
                    console.error(`Cannot create folder ${dir}`, e);
                }
            }
            return currentPath;
        }, '');
};
