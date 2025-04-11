// Custom client script that doesn't include WebSocket functionality
module.exports = {
  log: {
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {},
  },
  onMessage: () => {},
  send: () => {},
}; 