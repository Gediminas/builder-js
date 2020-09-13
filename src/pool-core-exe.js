const { execFile } = require('child_process')
const kill = require('tree-kill')
const assert = require('better-assert')

const processFullLines = (origBuffer, fnDoOnFullLine) => {
  const lines = origBuffer.split(/\r?\n/)
  const newBuffer = lines.pop()
  lines.forEach(fnDoOnFullLine)
  assert(newBuffer === '' || origBuffer.slice(-1) !== '\n')
  assert(newBuffer === '')
  return newBuffer
}

class PoolExecImpl {
  startTask(task, taskOutput) {
    return new Promise((resolve, reject) => {
      const args    = [task.product.script_path]
      const options = { cwd: task.working_dir }

      const child = execFile(task.product.interpreter, args, options)
      child.bufOut = ''
      child.bufErr = ''
      task.pid = child.pid

      child.stdout.on('data', (data) => {
        child.bufOut += data
        child.bufOut = processFullLines(child.bufOut, (text) => {
          taskOutput(task, text, 'stdout')
        })
      })

      child.stderr.on('data', (data) => {
        child.bufErr += data
        child.bufErr = processFullLines(child.bufErr, (text) => {
          taskOutput(task, text, 'stderr')
        })
      })

      child.on('error', (error) => {
        reject(error)
      })

      child.on('close', (exitCode) => {
        assert(child.bufOut === '') // TODO send \n
        assert(child.bufErr === '') // TODO send \n
        delete task.pid

        switch (exitCode) {
        case 0:  task.result = 'OK'; break
        case 1:  task.result = 'WARNING'; break
        case 2:  task.result = 'ERROR'; break
        default: task.result = 'N/A'; break
        }
        resolve()
      })
    })
  }

  killTask(task) {
    return new Promise((resolve, reject) => {
      kill(task.pid, 'SIGTERM', (error) => { // SIGKILL
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  CanRun(task, activeTasks) {
    const found_active = activeTasks.find(_task => _task.product_id === task.product_id)
    return found_active ? true : false
  }
}


const pool_impl = new PoolExecImpl()
module.exports = pool_impl
