const Loki = require('lokijs')
require('colors')

class HistoryLoader {
  init(dbPath) {
    return new Promise((resolve) => {
      console.log('history-loader: Loading '.grey, dbPath)

      this.db_history = new Loki(dbPath, {
        verbose         : true,
        autosave        : true,
        autosaveInterval: 2000,
        // autoload: true,//autoupdate: true //use Object.observe to update objects automatically
      })

      this.db_history.on('error', (e) => {
        console.log('history-loader: ERROR: '.red, e)
      })

      this.db_history.loadDatabase({}, () => {
        this.tb_history = this.db_history.getCollection('history')
        if (!this.tb_history) {
          console.log('history-loader: Creating '.grey, dbPath)
          this.tb_history = this.db_history.addCollection('history', { autoupdate: true })

          console.log('history-loader: Database saving...'.grey)
          this.db_history.saveDatabase(() => {
            console.log('history-loader: Database saved...'.grey)
          })
        }

        this.tb_history.on('error', (e) => {
          console.log('history-loader: ERROR: '.red, e)
        })

        resolve()
      })
    })
  }

  add_history(data) {
    const task = this.tb_history.insert(data)
    task.id = task.$loki
  }

  get_history(limit) {
    if (limit) {
      return this.tb_history.chain().simplesort('$loki', true).limit(limit).data()
    }
    return this.tb_history.chain().simplesort('$loki', true).data()
  }

  findLast_history(query) {
    // return this.tb_history.chain().find(query).limit(1).data()
    // const res = this.tb_history.chain().find(query).limit(1).data()[0]
    // const res = this.tb_history.findOne(query)
    // const res = this.tb_history.chain().simplesort('id', false).find(query, true).data()[0]
    const res = this.tb_history.chain()
      .find(query).simplesort('$loki', { desc: true })
      .limit(1)
      .data()[0]
    return res
  }
}

const historyLoader = new HistoryLoader()
module.exports = historyLoader
