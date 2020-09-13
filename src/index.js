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
console.note('----------------------------------------------------------'.blue);
console.note('> CONFIG:', JSON.stringify(cfg, null, 2));
console.note('----------------------------------------------------------'.blue);

const init_http = (cfg) => {
    const app = express();
    const pub = path.join(__dirname, '../pub');
    console.log('Static files folder:', pub);
    app.use('/', express.static(pub));

    // app.use((err, req, res, next) => {
    //     // Handler for global and uncaugth errors
    //     res.status(500).send(err.toString());
    //     next();
    // });

    const server = app.listen(cfg.server_port, cfg.server_access, () => {
        console.log(`HTTP server started, port ${cfg.server_port}`);
        sockets.init(server);
    });
    
};

console.log('products loading');
productLoader(cfg.script_dir, (products) => {
    console.log('products loaded');
    pool.initialize(poolExecImpl, products, cfg);
    init_http(cfg);
});
