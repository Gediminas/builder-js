const fs = require('fs');
const glob = require('glob');
const path = require('path');
const merge = require('merge');
const configLoader = require('./config_loader.js');

const cfgDef = configLoader.data.script_defaults;

// const load_cfg = (script_dir, product_id) => {
//   const cfgPath = path.normalize(script_dir + product_id + '/script.cfg');
//   const srvPath = path.normalize(script_dir + product_id + '/server.cfg');
//   const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
//   const srv = JSON.parse(fs.readFileSync(srvPath, 'utf8'));
//   const mrg = merge.recursive(true, cfgDef, cfg, srv);
//   if (!mrg.product_name) {
//     mrg.product_name = product_id;
//   }
//   return mrg;
// };

const loadProducts = (script_dir, on_loaded) => {
  glob('*', { cwd: script_dir, nodir: 1 }, (err, files) => {
    if (err) {
      return;
    }
    const products = files.map((file) => {
      console.note(file);
      const product_id = file;
      console.log(product_id);
      // const cfg = load_cfg(script_dir, product_id);
      return {
        product_id,
        product_name: product_id, // cfg.product_name,
        // cfg,
        script_path : path.resolve(script_dir, file),
      };
    });
    on_loaded(products);
  });
};

module.exports = loadProducts;
