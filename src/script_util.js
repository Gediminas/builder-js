"use strict";

//const execFile = require('child_process').execFile;
// const sys      = require('./sys_util.js');
// const db       = require('./builder_db_utils.js');
// const path     = require('path');
// const pool    = require('./pool.js');


// //Init cron:
//
// const CronJob  = require('cron').CronJob;
//
// var cron_tasks = [];
//
// exports.init = function(product_id)
// {
// 	try {
// 		let gcfg = exports.load_app_cfg();
// 		let scfg = exports.load_cfg(product_id);
// 		let cron_time = scfg["cron"];
// 		//sys.script_log(product_id, JSON.stringify(scfg))
// 		if (cron_time) {
// 			let cron_task = new CronJob(cron_time, function() {
// 				exports.add_task(product_id, scfg["cron_comment"]);
// 			}, null, true, gcfg["time_zone"]);
// 			cron_tasks.push(cron_task);
// 		}
// 	}
// 	catch (e) {
// 		sys.script_log(product_id, 'ERROR: ' + e);
// 	}
// }
//
// exports.init_all = function()
// {
//   get_scripts().then((scripts) => {
//     for (let i in scripts) {
//       exports.init(scripts[i]);
//     }
//   });
// };
// exports.destroy_all = function() {for (let i in cron_tasks) {cron_tasks[i].stop();}}



