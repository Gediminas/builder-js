/* global Vue io */

const server = io.connect();

// let server = new WebSocket('ws://localhost:2001/echo');
//
// server.emit = (event, param) => {
//     console.log('Sending:', event, param);
//     server.send(JSON.stringify({event, param}))
// };

const vm = new Vue({
  el  : '#app',
  data: {
    connection_status: 'ok',
    connection_text  : '',
    tasks            : [],
    products         : [],
  },
  methods: {
    add_task : product_id => server.emit('add_task', { product_id }),
    drop_task: task_uid => server.emit('drop_task', { task_uid }),
  },
  mounted() {
    console.log('>> VUE mounted...');
  },
});


console.log('Socket connected');

vm.connection_status = 'ok';
vm.connection_text   = 'Connected';
setTimeout(() => {
  if (vm.connection_status === 'ok') {
    vm.connection_status = '';
    vm.connection_text   = '';
  }
}, 3000);

console.log('--> request-state');
server.emit('request-state');

server.on('data-state', (data) => {
  console.log('<-- data-state received:', data);
  vm.tasks = data.tasks;
  vm.products = data.products;
});

// server.on('task-added', (data) => {
//     console.log('task-added', data);
// });

// server.emit = (event, param) => {
//     console.log('Sending:', event, param);
//     server.send(JSON.stringify({event, param}))
// };
// 
// server.onopen = function() {
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
// server.onmessage = function (evt) {
//     const data = JSON.parse(evt.data)
//     if (!data.event) {
//         console.log('>> UNKNOWN EVENT RECEIVED:', data);
//         return;
//     }
//     switch (data.event) {
//     case 'state':
//         console.log('RECEIVED', 'state', data);
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
// server.onerror = function(err) {
//     console.error('server error:', err)
//     vm.connection_status = 'error';
//     vm.connection_text = `Error: ${JSON.stringify(err)}`;
//     server.close();
// };
// 
// server.onclose = function(e) {
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
