const socketio = require('socket.io')
const path = require('path')
const assert = require('better-assert')
const pool = require('./pool.js')
require('colors')

//???
const db = require('./loaders/history_loader.js')
const sys = require('./sys_util');
const fs = require('fs')


const emitProducts = emitter =>
  emitter.emit('state', { products: pool.getProducts() })

const emitTasks = emitter =>
  emitter.emit('state', { tasks: pool.allTasks() })

const emitHistory = (emitter, show_history_limit)  =>
  emitter.emit('state', { htasks: db.get_history(show_history_limit) })

// const updateProducts = (db, products, product_id) => {
//  for (const product of products) {
//    if (!product_id || product.product_id === product_id) {
//      product.last_task = db.findLast_history({ product_id: product.product_id })
//    }
//  }
// }


pool.on('initialized', (param) => {
  console.log('>> gui: Init start')

  const dbPath            = `${param.cfg.working_dir}history.json`
  const server_port       = param.cfg.server_port
  this.working_dir        = param.cfg.working_dir
  this.show_history_limit = param.cfg.show_history_limit

  console.log('>> gui: DB loading:', dbPath)
  db.init(dbPath).then(() => {
    console.log('>> gui: DB loaded')
    // Update stats for products
    console.log('>> gui: Updating stats for all products from DB')
    const products = pool.getProducts()
    for (const product of products) {
      const last_task = db.findLast_history({ product_id: product.product_id })
      product.stats = {
        status       : last_task ? last_task.data.status : 'N/A',
        last_task_uid: last_task ? last_task.uid : '',
      }
    }
    console.log(`>> gui: Socket server starting on port: ${server_port}`.magenta)
    this.io = socketio(server_port)
    this.io.on('connection', (socket) => {
      console.log(`>>>> gui: Client connected: ${socket.conn.remoteAddress}`.yellow)
      pool.emit('client-connected', { socket, io: this.io })
    });
  })
  console.log('>> gui: Init end')
})

pool.on('client-connected', (param) => {
  this.io = param.io
  emitHistory(param.socket, this.show_history_limit)
  emitProducts(param.socket)
  emitTasks(param.socket)

  param.socket.on('task_add', data =>
    pool.addTask(data.product_id, { user_comment: 'user comment' }))

  param.socket.on('task_kill', data =>
    pool.dropTask(data.task_uid))

  param.socket.on('request_log', (data) => {
    console.log('>>>> gui: request_log: Request for logs received: ', data.product_id, data.task_uid)

    let task_uid = data.task_uid

    if (!task_uid) {
      const products = pool.getProducts()
      const product = products.find(_product => _product.product_id === data.product_id)
      task_uid = product.stats.last_task_uid
      console.log('>>>> gui: request_log: found', task_uid)
    }

    const task = db.findLast_history({ uid: task_uid })
    const task_dir = this.working_dir + data.product_id +
          '/' + sys.timeToDir(task.time_start)

    fs.readFile(task_dir + '/_main.log', 'utf8', (error, content) => {
      if (error) {
        console.log('ERROR', error)
        return
      }

      const key = data.task_uid || data.product_id
      const logs = {}
      logs[key] = content.split('\n')

      console.log('>> gui: request_log: Sending logs to client: ', logs)
      param.socket.emit('state', { logs })

      // subscribe the client and send only updates
      // if log is 'active'
    })
  })

  param.socket.on('sys_shutdown', (param) => {
    // sys.log("Stoping cron tasks...")
    // script.destroy_all()

    setTimeout(() => {
      console.log("Exit.")
      process.exit(0)
    }, 100)
  });
})

pool.on('error', (param) => {
  emitTasks(this.io) // activeTasks refresh if cannot start any
})

pool.on('task-added', (param) => {
  emitTasks(this.io)
  /*
  let product_id = param.task.product_id
  let last_task  = db.findLast_history({"$and": [{ "product_id" : product_id},{"param.status": "OK"}]})
  if (!last_task) {
    last_task = db.findLast_history({"$and": [{ "product_id" : product_id},{"param.status": "WARNING"}]})
  }
  if (!last_task) {
    last_task = db.findLast_history({ "product_id" : product_id})
  }
  */
})

pool.on('task-started', (param) => {
  param.task.data.status = 'WORKING'
})

pool.on('task-completed', (param) => {
  db.add_history(param.task)

  const products = pool.getProducts()
  for (let product of products) {
    if (product.product_id != param.task.product_id) {
      continue
    }

    product.stats.status = param.task.status
    product.stats.last_task_uid = param.task.uid
    product.stats.last_start_time = param.task.time_start

    console.log('history db stats updated for product ' + product.product_id)
    break
  }

  emitTasks(this.io)
  emitProducts(this.io)
  emitHistory(this.io, this.show_history_limit)
})

pool.on('task-output', () => {
  emitTasks(this.io)
})
