const path = require('path')
const config = require('../../cfg/config.json')
const script_defaults = require('../../cfg/script_defaults.json')

class ConfigLoader {
  init() {
    this.data = {}
    this.data.appConfig = config
    this.data.script_defaults = script_defaults

    if (!path.isAbsolute(this.data.appConfig.script_dir)) {
      this.data.appConfig.script_dir =
        path.normalize(__dirname + '/../../' + this.data.appConfig.script_dir)
    }
    if (!path.isAbsolute(this.data.appConfig.working_dir)) {
      this.data.appConfig.working_dir =
        path.normalize(__dirname + '/../../' + this.data.appConfig.working_dir)
    }
  }
}

const configLoader = new ConfigLoader()
configLoader.init()
module.exports = configLoader
