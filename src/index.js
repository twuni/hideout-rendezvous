import Heartbeat from './heartbeat';
import Logger from './logger';
import ShapeMatcher from './shape-matcher';
import WebSocket from 'ws';
import WebSocketEventEngine from './web-socket-event-engine';
import WebSocketServer from './web-socket-server';

import configure from './configure';

const configuration = configure(process.env);

const logger = new Logger();

const state = {
  webSockets: []
};

const heartbeat = new Heartbeat({
  ...configuration.heartbeat,
  listWebSockets: () => state.webSockets.map((it) => it.webSocket),
  onTick() {
    logger.info({ type: 'heartbeat' });
  },
  onTimeout() {
    logger.info({ type: 'timeout' });
  }
});

const onConnect = (webSocket) => {
  const webSocketState = {
    shapeKeys: [],
    subscriptions: {},
    webSocket
  };

  state.webSockets.push(webSocketState);

  logger.info({ context: { connected: state.webSockets.length }, type: 'connect' });

  const engine = new WebSocketEventEngine({
    onError(error, message) {
      logger.error({ message, type: 'message' }, error);
    },

    // eslint-disable-next-line complexity
    onPublish(event) {
      logger.info({ event, type: 'publish' });
      // Forward this message to peers that have subscribed to a matching shape.

      const messageToForward = JSON.stringify({ publish: event });

      for (const { shapeKeys, subscriptions, webSocket: peerWebSocket } of state.webSockets) {
        if (peerWebSocket !== webSocket) {
          for (const shapeKey of shapeKeys) {
            const { [shapeKey]: shapeMatcher } = subscriptions;

            if (shapeMatcher && shapeMatcher.isMatch(event)) {
              peerWebSocket.send(messageToForward);
            }
          }
        }
      }
    },

    onSubscribe(shape) {
      logger.info({ shape, type: 'subscribe' });
      // Subscribe to this shape, so when matching events are published by a peer, they will be forwarded to this web socket.

      const shapeKey = JSON.stringify(shape);

      if (!webSocketState.subscriptions[shapeKey]) {
        webSocketState.shapeKeys.push(shapeKey);
        webSocketState.subscriptions[shapeKey] = new ShapeMatcher(shape);
      }
    },

    onUnsubscribe(shape) {
      logger.info({ shape, type: 'unsubscribe' });
      // Stop subscribing to this shape, if already subscribed to an identical shape.

      const shapeKey = JSON.stringify(shape);

      if (webSocketState.subscriptions[shapeKey]) {
        delete webSocketState.subscriptions[shapeKey];
        webSocketState.shapeKeys.splice(webSocketState.shapeKeys.indexOf(shapeKey), 1);
      }
    },

    webSocket
  });

  engine.subscribe({});

  return engine;
};

const removeWebSocketFromState = (webSocket) => {
  let index = state.webSockets.findIndex((it) => it.webSocket === webSocket);

  while (index >= 0) {
    state.webSockets.splice(index, 1);
    index = state.webSockets.findIndex((it) => it.webSocket === webSocket);
  }
};

const onDisconnect = (webSocket) => {
  removeWebSocketFromState(webSocket);
  logger.info({ context: { connected: state.webSockets.length }, type: 'disconnect' });
};

if (configuration.peer.url) {
  const webSocket = new WebSocket(configuration.peer.url, {
    ca: [configuration.peer.certificateAuthority].filter(Boolean),
    servername: configuration.peer.domain
  });

  webSocket.on('open', () => onConnect(webSocket));
  webSocket.on('close', () => onDisconnect(webSocket));
}

const onStart = () => {
  logger.info({ context: { ip: configuration.ip, tcp: configuration.tcp }, type: 'start' });
  heartbeat.start();
};

const onStop = () => {
  logger.info({ type: 'stop' });

  heartbeat.stop();

  const webSockets = state.webSockets.map((it) => it.webSocket);

  for (const webSocket of webSockets) {
    webSocket.terminate();
  }

  process.exit(0);
};

const server = new WebSocketServer({
  ...configuration,
  onConnect,
  onDisconnect,
  onStart,
  onStop
});

server.start();

process.on('SIGTERM', () => {
  server.stop();
});
