const io = require('socket.io');

let server_io = null;

const init = (server) => {
    server_io = io(server);
    console.log('Socket server started');

    server_io.on('connection', (socket) => {
        console.log(`>>>> gui: Client connected: ${socket.conn.remoteAddress}`.yellow)
        socket.emit('task-added', {test: 'test'});

        socket.on('back', (data) => {
            console.log('back', data);
        });
    });
};

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

// core.on('task-added', (param) => {
//     sendOnProjectUpdate('project-added', param);
// });
// core.on('task-changed', (param) => {
//     sendOnProjectUpdate('project-added', param);
// });

module.exports = {
    init,
};
