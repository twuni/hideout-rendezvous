const log = ({
  category = 'default',
  context = {},
  level = 'INFO',
  timestamp = new Date().toISOString(),
  type
}) => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ category, context, level, timestamp, type }));
};

const Logger = function Logger(defaults = {}) {
  this.log = (event, error) => {
    const parameters = { ...defaults, ...event };

    if (error) {
      parameters.context = {
        ...parameters.context || {},
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack
        }
      };
    }

    log(parameters);
  };
  return this;
};

Object.assign(Logger.prototype, {
  debug(event) {
    return this.log({ ...event, level: 'DEBUG' });
  },

  error(event, error) {
    return this.log({ ...event, level: 'ERROR' }, error);
  },

  info(event) {
    return this.log({ ...event, level: 'INFO' });
  },

  warn(event, warning) {
    return this.log({ ...event, level: 'WARN' }, warning);
  }
});

export default Logger;
