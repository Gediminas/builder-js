const { execFile } = require('child_process');
const kill = require('tree-kill');
const assert = require('better-assert');

const processFullLines = (origBuffer, fnDoOnFullLine) => {
  const lines = origBuffer.replace(/\r/g, '\n').split(/\n?\n/);
  const newBuffer = lines.pop();
  lines.forEach(fnDoOnFullLine);
  assert(newBuffer === '' || origBuffer.slice(-1) !== '\n');
  return newBuffer;
};

const startTask = task => new Promise((resolve, reject) => {
  const args    = [task.product.script_path];
  const options = { cwd: task.working_dir };

  console.note('STARING: ', task.product.interpreter, args.join(' '));
  console.debug(JSON.stringify({ options }));

  const child = execFile(task.product.interpreter, args, options);
  child.bufOut = '';
  child.bufErr = '';
  task.pid = child.pid;

  child.stdout.on('data', (data) => {
    child.bufOut += data;
    child.bufOut = processFullLines(child.bufOut, (text) => {
      console.log(`#id-${task.uid}`, `${text}`);
    });
  });

  child.stderr.on('data', (data) => {
    child.bufErr += data;
    child.bufErr = processFullLines(child.bufErr, (text) => {
      console.warn(`#id-${task.uid}`, `!! ERROR: ${text}`);
    });
  });

  child.on('error', (error) => {
    reject(error);
  });

  child.on('close', (exitCode) => {
    assert(child.bufOut === ''); // TODO send \n
    assert(child.bufErr === ''); // TODO send \n
    delete task.pid;

    switch (exitCode) {
    case 0:  task.result = 'OK'; break;
    case 1:  task.result = 'WARNING'; break;
    case 2:  task.result = 'ERROR'; break;
    default: task.result = 'N/A'; break;
    }
    resolve();
  });
});

const killTask = task => new Promise((resolve, reject) => {
  kill(task.pid, 'SIGTERM', (error) => { // SIGKILL
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
});

const CanRun = (task, activeTasks) => {
  const found_active = activeTasks.find(_task => _task.product_id === task.product_id);
  return found_active;
};


module.exports = {
  startTask,
  killTask,
  CanRun,
};
