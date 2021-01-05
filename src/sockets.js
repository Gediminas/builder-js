const pool = require('./pool.js');

pool.on('initialized', (param) => {
  param.cfg.socket_server.on('connection', (socket) => {
    console.network(`Client connected: ${socket.conn.remoteAddress}`)

    socket.on('request-state', (data) => {
      console.log('request-state', data);
      socket.emit('state', { tasks: pool.allTasks(), products: pool.getProducts() });
    });

    socket.on('add_task', (data) => {
      console.log('add_task', data);
      pool.addTask(data.product_id);
      socket.emit('state', { tasks: pool.allTasks(), products: pool.getProducts() });
    });

    socket.on('drop_task', (data) => {
      console.log('drop_task', data);
      pool.dropTask(data.task_uid);
      socket.emit('state', { tasks: pool.allTasks(), products: pool.getProducts() });
    });

    pool.on('task-completed', (param) => {
      socket.emit('state', { tasks: pool.allTasks(), products: pool.getProducts() });
    });

    pool.on('task-started', (param) => {
      socket.emit('state', { tasks: pool.allTasks(), products: pool.getProducts() });
    });
  });
});
