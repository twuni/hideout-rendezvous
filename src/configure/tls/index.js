import client from './client';
import server from './server';

const DEFAULT_ECDH_CURVE = 'secp384r1';

const DEFAULT_VERSION = 'TLSv1.2';

export default (env = {}) => ({
  ciphers: env.TLS_CIPHERS,
  client: client(env),
  dhparam: env.TLS_DHPARAM,
  ecdhCurve: env.TLS_ECDH_CURVE || DEFAULT_ECDH_CURVE,
  server: server(env),
  version: env.TLS_VERSION || DEFAULT_VERSION
});
