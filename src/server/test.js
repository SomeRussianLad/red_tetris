const clientIO = require('socket.io-client');

const clientSocket = clientIO('ws://127.0.0.1:5000', {
    transports: ['websocket'],
});

clientSocket.on('connect', () => {
  clientSocket.on('new-game', (message) => {
    console.log(message);
    setTimeout(() => { clientSocket.disconnect() }, 1000)
  });
  clientSocket.emit('new-game');
});

