export default (env = {}) => ({
  certificate: env.TLS_CLIENT_CERTIFICATE,
  certificateAuthority: env.TLS_CLIENT_CERTIFICATE_AUTHORITY,
  key: env.TLS_CLIENT_KEY
});
