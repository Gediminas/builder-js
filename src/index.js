const express = require('express');
const path = require('path');
const pool = require('./pool.js');
const poolExecImpl = require('./pool-core-exe.js');
require('./pool-core-sys.js');
require('./pool-tty.js');
require('./pool-log.js');
// require('./pool-gui.js');
require('colors');
const sockets = require('./sockets.js');
const log = require('./utils/log.js');

const productLoader = require('./loaders/product_loader.js');
const configLoader = require('./loaders/config_loader.js');

log.init();

const cfg = configLoader.data.appConfig;
console.note('----------------------------------------------------------');
console.note('> CONFIG:', JSON.stringify(cfg, null, 2));
console.note('----------------------------------------------------------');

console.info('products loading');
productLoader(cfg.script_dir, (products) => {
    console.info('products loaded');
    const app = express();
    const pub = path.join(__dirname, '../pub');
    app.use('/', express.static(pub));
    console.info('Static files folder:', pub);

    const server = app.listen(cfg.server_port, cfg.server_access, () => {
        console.network(`HTTP server started, port ${cfg.server_port}`);
        cfg.http_server = server;
        pool.initialize(poolExecImpl, products, cfg);
    });
});
