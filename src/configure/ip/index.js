const DEFAULT_ADDRESS = '127.0.0.1';

export default (env = {}) => ({
  address: env.IP_ADDRESS || DEFAULT_ADDRESS
});
