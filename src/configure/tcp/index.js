const DEFAULT_PORT = '8975';

export default (env = {}) => ({
  port: Number(env.TCP_PORT || DEFAULT_PORT)
});
