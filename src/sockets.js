const pool = require('./pool.js');

let server_io = null;

pool.on('initialized', (param) => {
    param.cfg.socket_server.on('connection', (socket) => {
        console.network(`Client connected: ${socket.conn.remoteAddress}`)

        socket.on('request-update-state', (data) => {
            console.log('request-update-state', data);
            socket.emit('update-state', { tasks: pool.allTasks(), products: pool.getProducts() });
        });

        socket.on('add_task', (data) => {
            console.log('add_task', data);
            pool.addTask(data.product_id);
            socket.emit('update-state', { tasks: pool.allTasks(), products: pool.getProducts() });
        });

        socket.on('drop_task', (data) => {
            console.log('drop_task', data);
            pool.dropTask(data.task_uid);
            socket.emit('update-state', { tasks: pool.allTasks(), products: pool.getProducts() });
        });

        pool.on('task-completed', (param) => {
            socket.emit('update-state', { tasks: pool.allTasks(), products: pool.getProducts() });
        });

        pool.on('task-started', (param) => {
            socket.emit('update-state', { tasks: pool.allTasks(), products: pool.getProducts() });
        });
    });
});
