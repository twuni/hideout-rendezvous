import WebSocket from 'ws';

import https from 'https';

const STUB = () => true;

class WebSocketServer {
  constructor(options = {}) {
    const {
      ip,
      onConnect = STUB,
      onDisconnect = STUB,
      onMessage = STUB,
      onStart = STUB,
      onStop = STUB,
      tcp,
      tls
    } = options;

    const webSocketServer = new WebSocket.Server({ clientTracking: false, noServer: true });

    webSocketServer.on('connection', (webSocket) => {
      onConnect(webSocket);

      webSocket.on('close', () => {
        onDisconnect(webSocket);
      });

      webSocket.on('message', (message) => {
        onMessage(message, webSocket);
      });
    });

    const server = https.createServer({
      ca: [tls.client.certificateAuthority].filter(Boolean),
      cert: tls.server.certificate,
      ciphers: tls.ciphers,
      dhparam: tls.dhparam,
      ecdhCurve: tls.ecdhCurve,
      honorCipherOrder: true,
      key: tls.server.key,
      minVersion: tls.version,
      rejectUnauthorized: Boolean(tls.client.certificateAuthority),
      requestCert: Boolean(tls.client.certificateAuthority),
      servername: tls.server.domain
    });

    server.on('upgrade', (request, socket, head) => {
      webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
        webSocketServer.emit('connection', webSocket);
      });
    });

    server.on('listening', () => {
      onStart();
    });

    server.on('close', () => {
      onStop();
    });

    this.start = () => {
      server.listen(tcp.port, ip.address);
    };

    this.stop = () => {
      server.close();
    };
  }
}

export default WebSocketServer;
