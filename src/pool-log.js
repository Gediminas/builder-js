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

pool.on('task-output', (param) => {
  let text = param.text
  if (text.indexOf('@title') === 0) {
  //   titleRenamed = text.substr(7)
  }
  else if (text.indexOf('@sub') === 0) {

    let file =  generateLogName(param.task)
    flog(file, text)

    param.task.temp.namingStack.push(++param.task.temp.lastSubNr)

    file = generateLogName(param.task)
    flog(file, text)

  //   sub++
  //   let title_orig = text.substr(5)
  //   if (!title_orig) {
  //     title_orig = '<no-name>'
  //   }
  //   let title = titleRenamed !== '' ? titleRenamed : title_orig

  //   let log_name_main = generateLogName()
  //   console.log(log_name_main);
  //   let log_file_main = param.task.working_dir + log_name_main
  //   logCombi.push(logCombiLastSub+1)
  //   logCombiLastSub = 0
  //   let log_name_sub = generateLogName()
  //   let log_file_sub = param.task.working_dir + log_name_sub
  //   console.log(log_file_sub);

  //   flog(log_file_main, `LOGGER> * [${title}] (${log_name_sub})\n`)

  //   if (titleRenamed) {
  //     flog(log_file_sub,  `LOGGER> ${titleRenamed}`)
  //   }
  //   flog(log_file_sub,  `LOGGER> ${title_orig}\n`)
  //   flog(log_file_sub,  `LOGGER> [back] (${log_name_main})\n`)
  //   flog(log_file_sub,  'LOGGER> ----------\n')
  }
  else if (text.indexOf('@end') === 0) {

    file = generateLogName(param.task.working_dir)
    flog(file, text)

    assert(param.task.temp.namingStack.length)
    param.task.temp.lastSubNr = param.task.temp.namingStack.pop()

    // sub--
    // if (logCombi.length) {
    //   logCombiLastSub = logCombi.pop()
    // }
  }
  else {
    // titleRenamed = '';
    // let file = param.task.working_dir + generateLogName()

    file = generateLogName(param.task)
    flog(file, text)

    //flog(file, `OUT-> ${text}\n`)
    // //console.log(`>> log: ${file}`)
  }
  // let spaces = ''
  // for (let i=0; i<sub; i++) {
  //   spaces = spaces + '  '
  // }
  ////console.log(`${param.task.product_id}> `.bgBlue, spaces, param.text.blue)
})

