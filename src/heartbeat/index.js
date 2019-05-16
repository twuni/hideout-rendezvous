import WebSocket from 'ws';

const STUB = () => true;

const dropFrom = (array) => (object) => {
  const index = array.indexOf(object);

  if (index >= 0) {
    array.splice(index, 1);
  }
};

const insertTo = (array) => (object) => {
  if (!array.includes(object)) {
    array.push(object);
  }
};

const Heartbeat = function Heartbeat(options = {}) {
  const {
    interval,
    listWebSockets,
    onTick = STUB,
    onTimeout = STUB
  } = options;

  const READY_STATE_OPEN = (options.WebSocket || WebSocket).OPEN;

  const state = {
    idle: [],
    seen: []
  };

  const ping = (webSocket) => {
    insertTo(state.idle)(webSocket);

    if (!state.seen.includes(webSocket)) {
      const onPong = () => dropFrom(state.idle)(webSocket);
      insertTo(state.seen)(webSocket);
      webSocket.addEventListener('pong', onPong);
    }

    webSocket.ping();
  };

  const drop = (webSocket) => {
    if (webSocket.readyState === READY_STATE_OPEN) {
      onTimeout();
      webSocket.terminate();
    }

    dropFrom(state.idle)(webSocket);
    dropFrom(state.seen)(webSocket);
  };

  this.start = () => {
    if (state.task) {
      return;
    }

    state.task = setInterval(() => {
      onTick();

      const webSockets = listWebSockets();

      for (const webSocket of webSockets) {
        if (state.idle.includes(webSocket)) {
          drop(webSocket);
        } else {
          ping(webSocket);
        }
      }

      for (const webSocket of state.seen) {
        if (!webSockets.includes(webSocket)) {
          drop(webSocket);
        }
      }
    }, interval);
  };

  this.stop = () => {
    state.idle = [];
    state.seen = [];
    clearInterval(state.task);
  };

  return this;
};

export default Heartbeat;
