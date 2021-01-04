const clientIO = require('socket.io-client');
const Server = require('../server');

let clientSocket;
// let serverSocket;
let server;

beforeAll((done) => {
  server = new Server().createHttp().createSocketRoutes();
  // serverSocket = server.io;
  server.listen();
  done();
});

afterAll((done) => {
  done();
});

beforeEach((done) => {
  clientSocket = clientIO('ws://0.0.0.0:5000', {
    transports: ['websocket'],
  });
  clientSocket.on('connect', () => {
    done();
  });
});

afterEach((done) => {
  if (clientSocket.connected) {
    clientSocket.disconnect();
  }
  done();
});

describe('On list-games', () => {
  test('should return an empty list when no games initialized', (done) => {
    clientSocket.on('list-games', (message) => {
      expect(message).toEqual({ data: [] });
      done();
    });
    clientSocket.emit('list-games');
  });

  test('should return a list with a single item when only one game initialized', (done) => {
    clientSocket.emit('new-game');
    clientSocket.on('list-games', (message) => {
      expect(message.data.length).toBe(1);
      expect(message.data[0]).toMatch(/game-(.*?)/);
      done();
    });
    clientSocket.emit('list-games');
  });

  // test('should return a list with a single item when only one game initialized after disconnecting at previous point', (done) => {
  //   clientSocket.emit('new-game');
  //   clientSocket.on('list-games', (message) => {
  //     expect(message.data.length).toBe(1);
  //     expect(message.data[0]).toMatch(/game-(.*?)/);
  //     done();
  //   });
  //   clientSocket.emit('list-games');
  // });

  // test('should return a list with N items when N games initialized', (done) => {
  //   const N = Math.floor(Math.random() * 100);

  //   let tempClients = [];
  //   for (let i = 0; i < N; i += 1) {
  //     const tempClientSocket = clientIO('ws://0.0.0.0:5000', {
  //       transports: ['websocket'],
  //     });
  //     tempClients = tempClients.concat(tempClientSocket);
  //   }

  //   clientSocket.emit('new-game');
  //   clientSocket.on('list-games', (message) => {
  //     expect(message.data.length).toBe(1);
  //     expect(message.data[0]).toMatch(/game-(.*?)/);
  //     done();
  //   });
  //   clientSocket.emit('list-games');
  // });
});
