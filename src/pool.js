const events = require('events');
const assert = require('better-assert');
const sys = require('./sys_util');
const { startTask, killTask, CanRun } = require('./core-fnc');

class Pool extends events {
  initialize(products, cfg) {
    console.log('pool: Initializing');
    this.products = products;
    this.waitingTasks = [];
    this.activeTasks = [];
    this.maxWorkers = cfg.maxWorkers;
    this.emit('initialized', { cfg });
    console.log('pool: Initialized');
  }

  addTask(productId, taskData) {
    const task = {
      uid       : sys.generateUid(),
      product_id: productId,
      data      : taskData,
    };
    this.waitingTasks.push(task);
    this.emit('task-added', { task, taskData });
    setImmediate(() => this._processQueue());
  }

  dropTask(taskUid) {
    for (const i in this.waitingTasks) {
      if (this.waitingTasks[i].uid === taskUid) {
        const task = this.waitingTasks.splice(i, 1)[0];
        this.emit('task-removed', { task });
        return;
      }
    }
    for (const task of this.activeTasks) {
      if (task.uid === taskUid) {
        this.emit('task-killing', { task });
        killTask(task).then(() => {
          this.emit('task-killed', { task });
        }).catch((error) => {
          this.emit('error', { task, error, from: 'dropTask' });
        });

        return;
      }
    }
    this.emit('task-kill-failed', { taskUid });
  }

  getProducts() {
    return this.products;
  }

  activeTasks() {
    return this.activeTasks;
  }

  allTasks() {
    return this.activeTasks.concat(this.waitingTasks);
  }

  _processQueue() {
    if (this.activeTasks.length >= this.maxWorkers) {
      return;
    }
    for (const i1 in this.waitingTasks) {
      const check_task = this.waitingTasks[i1];
      if (CanRun(check_task, this.activeTasks)) {
        continue;
      }
      const task = this.waitingTasks.splice(i1, 1)[0];
      assert(task === check_task);
      this.activeTasks.push(task);
      console.log(`#id-${task.uid}`, 'Starting');
      this.emit('task-starting', { task });
      startTask(task)
        .then(() => {
          this._taskCompleted(task);
        })
        .catch((error) => {
          this.emit('error', { task, error, from: '_processQueue' });
        });
      this.emit('task-started', { task });
      return;
    }
    if (!this.activeTasks) {
      this.emit('error', {
        task : false,
        error: false,
        msg  : 'Cannot start any task',
        from : '_processQueue',
      });
    }
  }

  _taskCompleted(task) {
    const i = this.activeTasks.indexOf(task);
    assert(i !== -1);
    const closedTask = this.activeTasks.splice(i, 1)[0];
    assert(closedTask === task);
    setImmediate(() => this._processQueue());
    this.emit('task-completed', { task });
  }
}

const pool = new Pool();
module.exports = pool;
