export default (env = {}) => ({
  certificateAuthority: env.PEER_CERTIFICATE_AUTHORITY,
  domain: env.PEER_DOMAIN,
  url: env.PEER_URL
});
