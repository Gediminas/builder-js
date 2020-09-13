const pool = require('./pool.js')
const poolExecImpl = require('./pool-core-exe.js')
require('./pool-core-sys.js')
//require('./pool-history.js')
require('./pool-tty.js')
require('./pool-log.js')
require('./pool-gui.js')
require('colors')

const productLoader = require('./loaders/product_loader.js')
const configLoader = require('./loaders/config_loader.js')

const cfgApp = configLoader.data.appConfig

console.log('')
console.log('')
console.log('----------------------------------------------------------'.blue)
console.log('----------------------------------------------------------'.blue)
console.log('> CONFIG:'.blue, JSON.stringify(cfgApp, null, 2).blue)
console.log('----------------------------------------------------------'.blue)

console.log('products loading')
productLoader(cfgApp.script_dir, (products) => {
  console.log('products loaded')
  pool.initialize(poolExecImpl, products, cfgApp)
})
