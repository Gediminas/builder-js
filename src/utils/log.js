const colors = require('colors');
const moment = require('moment');

let g_silent = false;

const get_date_time = () => moment().format('Y-MM-DD HH:mm:ss').grey;
//const get_date_time = () => new Date().toLocaleString();

const colorize = (args, color) => args.map((arg) => color(arg));

const log = (...args) => {
    console.log(...args);
};

log.init = () => {
    const orig_log   = console.log;
    const orig_debug = console.debug;
    const orig_info  = console.info;
    const orig_warn  = console.warn;
    const orig_error = console.error;

    console.log = (...args) => {
        args.unshift(get_date_time().grey);
        orig_log.apply(this, args);
    };

    console.debug = (...args) => {
        const colored_args = colorize(args, colors.magenta);
        colored_args.unshift(get_date_time().grey);
        orig_debug.apply(this, colored_args);
    };
    console.info = (...args) => {
        const colored_args = colorize(args, colors.grey);
        colored_args.unshift(get_date_time().grey);
        orig_info.apply(this, colored_args);
    };
    console.warn = (...args) => {
        args.unshift('WARNING:');
        const colored_args = colorize(args, colors.bgYellow);
        colored_args.unshift(get_date_time().grey);
        orig_warn.apply(this, colored_args);
    };
    console.error = (...args) => {
        args.unshift('ERROR:');
        const colored_args = colorize(args, colors.bgBrightRed);
        colored_args.unshift(get_date_time().grey);
        orig_error.apply(this, colored_args);
    };

    console.note = (...args) => {
        const colored_args = colorize(args, colors.brightYellow);
        colored_args.unshift(get_date_time().grey);
        orig_log.apply(this, colored_args);
    };
    console.ok = (...args) => {
        const colored_args = colorize(args, colors.bgGreen);
        colored_args.unshift(get_date_time().grey);
        orig_log.apply(this, colored_args);
    };
    console.network = (...args) => {
        const colored_args = colorize(args, colors.bgBrightBlue);
        colored_args.unshift(get_date_time().grey);
        orig_log.apply(this, colored_args);
    };
};

module.exports = log;
