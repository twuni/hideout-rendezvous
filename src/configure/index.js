import heartbeat from './heartbeat';
import ip from './ip';
import peer from './peer';
import tcp from './tcp';
import tls from './tls';

export default (env = {}) => ({
  heartbeat: heartbeat(env),
  ip: ip(env),
  peer: peer(env),
  tcp: tcp(env),
  tls: tls(env)
});
