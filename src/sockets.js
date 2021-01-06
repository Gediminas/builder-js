const pool = require('./pool.js');

pool.on('initialized', (param) => {
  const server = param.cfg.socket_server;

  server.on('connect', (client) => {
    console.network(`Client connected: ${client.conn.remoteAddress}`);
    console.network('client count:', server.engine.clientsCount);

    client.on('add_task', (data) => {
      console.log('add_task', data);
      pool.addTask(data.product_id);
    });

    client.on('drop_task', (data) => {
      console.log('drop_task', data);
      pool.dropTask(data.task_uid);
    });

    client.on('request-state', () => {
      console.log('<== request-state');
      console.log('==> data-state');
      client.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts() });
    });
  });

  pool.on('task-added', (param) => {
    console.log('task-added: ==> data-state');
    server.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts(), debug: 'task added to the pool'});
  });

  pool.on('task-started', (param) => {
    console.log('task-started: ==> data-state');
    server.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts(), debug: 'task started'});
  });

  pool.on('task-removed', (param) => {
    console.log('task-removed: ==> data-state');
    server.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts(), debug: 'task removed from the pool'});
  });

  pool.on('task-killing', (param) => {
    console.log('task-killing: ==> data-state');
    server.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts(), debug: 'task will be killed'});
  });

  pool.on('task-killed', (param) => {
    console.log('task-killed: ==> data-state');
    server.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts(), debug: 'task was killed'});
  });

  pool.on('task-completed', (param) => {
    console.log('task-completed: ==> data-state');
    server.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts(), debug: 'task completed'});
  });
});
