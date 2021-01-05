const pool = require('./pool.js');

pool.on('initialized', (param) => {
  param.cfg.socket_server.on('connect', (client) => {
    console.network(`Client connected: ${client.conn.remoteAddress}`);

    console.log(param.cfg.socket_server.engine.clientsCount);

    client.on('add_task', (data) => {
      console.log('add_task', data);
      pool.addTask(data.product_id);
    });

    client.on('drop_task', (data) => {
      console.log('drop_task', data);
      pool.dropTask(data.task_uid);
    });

    client.on('request-state', (data) => {
      console.log('<== request-state', data);
      console.log('==> data-state');
      client.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts() });
    });


    pool.once('task-added', (param) => {
      console.log('task-added: ==> data-state');
      client.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts(), debug: 'task added to the pool'});
    });

    pool.once('task-started', (param) => {
      console.log('task-started: ==> data-state');
      client.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts(), debug: 'task started'});
    });

    pool.once('task-removed', (param) => {
      console.log('task-removed: ==> data-state');
      client.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts(), debug: 'task removed from the pool'});
    });

    pool.once('task-killing', (param) => {
      console.log('task-killing: ==> data-state');
      client.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts(), debug: 'task will be killed'});
    });

    pool.once('task-killed', (param) => {
      console.log('task-killed: ==> data-state');
      client.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts(), debug: 'task was killed'});
    });

    pool.once('task-completed', (param) => {
      console.log('task-completed: ==> data-state');
      client.emit('data-state', { tasks: pool.allTasks(), products: pool.getProducts(), debug: 'task completed'});
    });

  });

  param.cfg.socket_server.on('disconnect', (client) => {
    client.removeAllEventListeners();
  });

});
