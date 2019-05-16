const DEFAULT_HEARTBEAT_INTERVAL = '30';

const TimeUnit = {
  SECOND: 1000
};

export default (env = {}) => ({
  interval: Number(env.HEARTBEAT_INTERVAL || DEFAULT_HEARTBEAT_INTERVAL) * TimeUnit.SECOND
});
