var socket = io.connect();

// let socket = new WebSocket('ws://localhost:2001/echo');
// 
// socket.emit = (event, param) => {
//     console.log('Sending:', event, param);
//     socket.send(JSON.stringify({event, param}))
// };

const vm = new Vue({
    el: '#app',
    data: {
        connection_status: 'ok',
        connection_text: '',
        tasks: [],
        products: []
    },
    methods: {
        add_task: (product_id) => socket.emit('add_task', { product_id }),
        drop_task: (task_uid) => socket.emit('drop_task', { task_uid })
    },
    mounted() {
        console.log(">> VUE mounted..."); 
    }
});


console.log('Socket connected');

vm.connection_status = 'ok';
vm.connection_text   = 'Connected';
setTimeout(function() {
    vm.connection_status = '';
    vm.connection_text   = '';
}, 3000);

console.log('--> request-update-state');
socket.emit('request-update-state');

socket.on('update-state', (data) => {
    console.log('<-- update-state', data);
    vm.tasks = data.tasks;
    vm.products = data.products;
});

// socket.on('task-added', (data) => {
//     console.log('task-added', data);
// });

// socket.emit = (event, param) => {
//     console.log('Sending:', event, param);
//     socket.send(JSON.stringify({event, param}))
// };
// 
// socket.onopen = function() {
//     console.log('>> Connected to server');
//     //if (reconnect) {
//         vm.connection_status = 'ok';
//         vm.connection_text   = 'Connected';
//         setTimeout(function() {
//             vm.connection_status = '';
//             vm.connection_text   = '';
//         }, 3000);
//     //}
// };
// 
// socket.onmessage = function (evt) { 
//     const data = JSON.parse(evt.data)
//     if (!data.event) {
//         console.log('>> UNKNOWN EVENT RECEIVED:', data);
//         return;
//     }
//     switch (data.event) {
//     case 'update_state':
//         console.log('RECEIVED', 'update_state', data);
//         vm.tasks    = data.tasks;
//         vm.products = data.products;
//         break;
//     case 'products-initialized':
//         console.log('RECEIVED', 'products-initialized');
//         vm.tasks    = data.tasks;
//         vm.products = data.products;
//         break;
//     case 'task-queued':
//         console.log('RECEIVED', 'task-queued');
//         vm.tasks    = data.tasks;
//         vm.products = data.products;
//         break;
//     case 'task-removed':
//         console.log('RECEIVED', 'task-remove');
//         vm.tasks    = data.tasks;
//         vm.products = data.products;
//         break;
//     case 'task-starting':
//         console.log('RECEIVED', 'task-starting');
//         vm.tasks    = data.tasks;
//         vm.products = data.products;
//         break;
//     default:
//         console.log('>> TODO EVENT:', data.event, data.param);
//         break;
//     }
// };
// 
// socket.onerror = function(err) {
//     console.error('Socket error:', err)
//     vm.connection_status = 'error';
//     vm.connection_text = `Error: ${JSON.stringify(err)}`;
//     socket.close();
// };
// 
// socket.onclose = function(e) {
//     console.error('Disconnected:', e)
//     vm.connection_status = 'warn';
//     vm.connection_text   = 'Reconnecting...';
//     setTimeout(function() {
//         console.log('Reconnecting...')
//         connect(true);
//     }, 500);
// };

function shutdown () {
    alert('shutdown');
}
