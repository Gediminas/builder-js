const colors = require('colors');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const get_date_time = () => moment().format('Y-MM-DD HH:mm:ss');

const sid2colorfn = [
  colors.black.bgBrightCyan,
  colors.black.bgBrightMagenta,
  colors.black.bgBrightGreen,
  colors.black.bgBrightYellow,
  colors.black.bgBrightRed,
  colors.black.bgBrightWhite,

  colors.black.bgCyan,
  colors.black.bgMagenta,
  colors.black.bgGreen,
  colors.black.bgYellow,
  colors.black.bgRed,
  colors.black.bgWhite,

];

const colorize = (args, color, prefix) => {
  const nargs = [];
  nargs.push(get_date_time().grey);
  for (const arg of args) {
    if (arg[0] === '#') {
      if (arg[1] === '#') {
        if (arg.length < 25) {
          nargs.push(colors.black.bgWhite(`[${arg.substr(2)}]`));
        } else {
          const nr_txt = arg.substr(13, 9);
          const nr     = parseInt(nr_txt, 10);
          const nr_mod = (nr - 1) % sid2colorfn.length;
          const sid_color_fn = sid2colorfn[nr_mod];
          if (sid_color_fn) {
            nargs.push(sid_color_fn(`[..${nr}${arg.substr(22)}]`));
          } else {
            nargs.push(colors.black.bgBrightRed(`[${arg.substr(2)}]`));
          }
        }
      } else {
        nargs.push(colors.magenta(arg.substr(1)));
      }
    } else {
      if (typeof arg !== 'string') {
        if (prefix) {
          nargs.push(color(`${prefix}:`));
          prefix = null;
        }
        nargs.push(color(arg));
      } else {
        if (prefix) {
          nargs.push(color(`${prefix}: ${arg}`));
          prefix = null;
        } else {
          nargs.push(color(arg));
        }
      }
    }
  }
  return nargs;
};

const log = (args) => console.log(args);

// const html_start = '<body style="background-color: #222222">\n';

log.start = (log_dir) => {
  const orig_log   = console.log;
  // const orig_debug = console.debug;
  // const orig_info  = console.info;
  const orig_warn  = console.warn;
  const orig_error = console.error;

  console.orig = orig_log;

  // const log_name = `${moment().format('Y-MM-DD_HH-mm-ss')}.log`;
  // const log_name = 'log.html';
  // this.log_pth = path.join(log_dir, log_name);
  // fs.writeFileSync(this.log_pth, html_start + '\n');

  console.log = (...args) => {
    const colored_args = colorize(args, colors.grey);
    orig_log.apply(this, colored_args);
    // log.put(...colored_args);
  };

  console.debug = (...args) => {
    const colored_args = colorize(args, colors.magenta, 'DEBUG');
    orig_log.apply(this, colored_args);
    // log.put(...colored_args);
  };

  console.warn = (...args) => {
    const colored_args = colorize(args, colors.black.bgBrightYellow, 'WARNING');
    orig_warn.apply(this, colored_args);
    // log.put(...colored_args);
  };

  console.error = (...args) => {
    const colored_args = colorize(args, colors.bgRed, 'ERROR');
    orig_error.apply(this, colored_args);
    // log.put(...colored_args);
  };

  console.note = (...args) => {
    const colored_args = colorize(args, colors.brightYellow);
    orig_log.apply(this, colored_args);
    // log.put(...colored_args);
  };

  console.ok = (...args) => {
    const colored_args = colorize(args, colors.bgGreen);
    orig_log.apply(this, colored_args);
    // log.put(...colored_args);
  };
  console.network = (...args) => {
    const colored_args = colorize(args, colors.bgBrightBlue);
    orig_log.apply(this, colored_args);
    // log.put(...colored_args);
  };
  console.network2 = (...args) => {
    const colored_args = colorize(args, colors.bgBlue);
    orig_log.apply(this, colored_args);
    // log.put(...colored_args);
  };
  console.network3 = (...args) => {
    const colored_args = colorize(args, colors.bgMagenta);
    orig_log.apply(this, colored_args);
    // log.put(...colored_args);
  };
  console.network_debug = (...args) => {
    const colored_args = colorize(args, colors.bgBlue);
    orig_log.apply(this, colored_args);
    // log.put(...colored_args);
  };

  console.event = (...args) => {
    const colored_args = colorize(args, colors.brightCyan);
    orig_log.apply(this, colored_args);
    // log.put(...colored_args);
  };
};

module.exports = log;
