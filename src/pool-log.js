const fs = require('fs');
const assert = require('better-assert')
const pool = require('./pool.js')
require('colors')

// let titleRenamed = ''
// const logCombi = []
// let logCombiLastSub = 0
// let sub = 0
// let subNr = 0

const generateLogName = (task) => {
  if (!task.temp || task.temp.namingStack.length === 0) {
    return task.working_dir + '_main.log'
  }
  const name = task.temp.namingStack.reduce((accumulated, sub) => {
    return (accumulated ? ('.' + accumulated) : '') + sub.toString().padStart(3, '0')
  }, '')
  return task.working_dir + name + '.log'
}

const flog = (file, text) =>
  fs.appendFileSync(file, text+'\n', {encoding: "utf8"}, (err) => {
    if (err) console.error(err)
  });

pool.on('initialized', (param) => {
})

pool.on('error', (param) => {
  // log(param, `ERROR: ${param.msg}`.bgWhite.red)
})

pool.on('task-starting', (param) => {
  if (!param.task.temp) {
    param.task.temp = {}
  }
  param.task.temp.namingStack = []
  param.task.temp.lastSubNr = 0
})

pool.on('task-completed', (param) => {
  delete param.task.temp.namingStack
  delete param.task.temp.stSubNr

})

