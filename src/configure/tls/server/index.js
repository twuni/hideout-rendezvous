const DEFAULT_DOMAIN = 'localhost';

export default (env = {}) => ({
  certificate: env.TLS_SERVER_CERTIFICATE,
  certificateAuthority: env.TLS_SERVER_CERTIFICATE_AUTHORITY,
  domain: env.TLS_SERVER_DOMAIN || DEFAULT_DOMAIN,
  key: env.TLS_SERVER_KEY
});
