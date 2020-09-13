const events = require('events')
const assert = require('better-assert')
const sys = require('./sys_util')

class Pool extends events {
  initialize(impl, products, cfg) {
    this.products = products
    this.waitingTasks = []
    this.activeTasks = []
    this.maxWorkers = cfg.maxWorkers
    this.impl = impl
    console.log('init started')
    this.emit('initialized', { cfg })
    console.log('init finished')
  }

  addTask(productId, taskData) {
    const task = {
      uid       : sys.generateUid(),
      product_id: productId,
      data      : taskData,
    }
    this.waitingTasks.push(task)
    this.emit('task-added', { task, taskData })
    setImmediate(() => this._processQueue())
  }

  dropTask(taskUid) {
    for (const i in this.waitingTasks) {
      if (this.waitingTasks[i].uid === taskUid) {
        const task = this.waitingTasks.splice(i, 1)[0]
        this.emit('task-removed', { task })
        return
      }
    }
    for (const task of this.activeTasks) {
      if (task.uid === taskUid) {
        this.emit('task-killing', { task })
        this.impl.killTask(task).then(() => {
          this.emit('task-killed', { task })
        }).catch((error) => {
          this.emit('error', { task, error, from: 'dropTask' })
        })

        return
      }
    }
    this.emit('task-kill-failed', { taskUid })
  }

  getProducts() {
    return this.products
  }

  activeTasks() {
    return this.activeTasks
  }

  allTasks() {
    return this.activeTasks.concat(this.waitingTasks)
  }

  _processQueue() {
    if (this.activeTasks.length >= this.maxWorkers) {
      return
    }
    for (const i1 in this.waitingTasks) {
      const check_task = this.waitingTasks[i1]
      if (this.impl.CanRun(check_task, this.activeTasks)) {
        continue
      }
      const task = this.waitingTasks.splice(i1, 1)[0]
      assert(task === check_task)
      this.activeTasks.push(task)
      this.emit('task-starting', { task })
      this.impl.startTask(task, this._taskOutput.bind(this))
        .then(() => {
          this._taskCompleted(task)
        })
        .catch((error) => {
          this.emit('error', { task, error, from: '_processQueue' })
        })
      this.emit('task-started', { task })
      return
    }
    if (!this.activeTasks) {
      this.emit('error', {
        task : false,
        error: false,
        msg  : 'Cannot start any task',
        from : '_processQueue',
      })
    }
  }

  _taskCompleted(task) {
    const i = this.activeTasks.indexOf(task)
    assert(i !== -1)
    const closedTask = this.activeTasks.splice(i, 1)[0]
    assert(closedTask === task)
    setImmediate(() => this._processQueue())
    this.emit('task-completed', { task })
  }

  _taskOutput(task, text, std) {
    this.emit('task-output', { task, text, std })
  }
}

const pool = new Pool()
module.exports = pool
