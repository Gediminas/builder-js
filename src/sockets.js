const io = require('socket.io');
const pool = require('./pool.js');

let server_io = null;

pool.on('initialized', (param) => {
    server_io = io(param.cfg.http_server);
    console.network('Socket server started');

    server_io.on('connection', (socket) => {
        console.network(`Client connected: ${socket.conn.remoteAddress}`)
        //socket.emit('task-added', {test: 'test'});

        socket.on('request-products', (data) => {
            console.log('request-products', data);
            socket.emit('update-products', { products: pool.getProducts() });
        });

        socket.on('request-tasks', (data) => {
            console.log('request-tasks', data);
            socket.emit('update-tasks', { tasks: pool.allTasks() });
        });

        socket.on('add_task', (data) => {
            console.log('add_task', data);
            pool.addTask(data.product_id);
            socket.emit('update-tasks', { tasks: pool.allTasks() });
            socket.emit('update-products', { products: pool.getProducts() });
        });

        socket.on('drop_task', (data) => {
            console.log('drop_task', data);
            pool.dropTask(data.task_uid);
            socket.emit('update-tasks', { tasks: pool.allTasks() });
            socket.emit('update-products', { products: pool.getProducts() });
        });

        pool.on('task-completed', (param) => {
            socket.emit('update-tasks', { tasks: pool.allTasks() });
            socket.emit('update-products', { products: pool.getProducts() });
        })

        pool.on('task-started', (param) => {
            socket.emit('update-tasks', { tasks: pool.allTasks() });
            socket.emit('update-products', { products: pool.getProducts() });
        })
    });
})

// const sendOnProjectUpdate = async (action, param) => {
//     if (server_io) {
//         if (param && param.project && param.cfg && param.cfg.db) {
//             const data = await toClientData(param.project, action, param.cfg.db, true);
//             server_io.sockets.emit(action, data);
//         } else {
//             server_io.sockets.emit(action);
//         }
//     }
// };

// pool.on('task-added', (param) => {
//     sendOnProjectUpdate('project-added', param);
// });
// pool.on('task-changed', (param) => {
//     sendOnProjectUpdate('project-added', param);
// });

