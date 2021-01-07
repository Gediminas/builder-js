/* global Vue io window alert */

let force_refresh = false;

const server = io.connect();

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

server.on('connect', () => {
  if (force_refresh) {
    window.location.reload();
    return;
  }
  console.log('>> Socket connected');
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

  server.on('disconnect', function(data2) {
    console.log('>> Socket disconnected', data2);
    vm.connection_status = 'error';
    vm.connection_text   = 'Disconnected';
    force_refresh = true;
  });
});

function shutdown () {
  alert('shutdown');
}
