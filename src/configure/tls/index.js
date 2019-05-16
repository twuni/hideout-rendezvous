import client from './client';
import server from './server';

const DEFAULT_CIPHERS = [
  'ECDHE-ECDSA-CHACHA20-POLY1305',
  'ECDHE-ECDSA-AES128-GCM-SHA256',
  'ECDHE-RSA-CHACHA20-POLY1305',
  'ECDHE-RSA-AES128-GCM-SHA256',
  'DHE-RSA-CHACHA20-POLY1305',
  'DHE-RSA-AES128-GCM-SHA256'
].join(':');

const DEFAULT_ECDH_CURVE = 'secp384r1';

const DEFAULT_VERSION = 'TLSv1.2';

export default (env = {}) => ({
  ciphers: env.TLS_CIPHERS || DEFAULT_CIPHERS,
  client: client(env),
  dhparam: env.TLS_DHPARAM,
  ecdhCurve: env.TLS_ECDH_CURVE || DEFAULT_ECDH_CURVE,
  server: server(env),
  version: env.TLS_VERSION || DEFAULT_VERSION
});
