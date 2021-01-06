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
  server.close();
  done();
});

beforeEach((done) => {
  clientSocket = clientIO('ws://127.0.0.1:5000', {
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

// describe('On list-games', () => {
//   it('should return an empty list when no games initialized', (done) => {
//     clientSocket.on('list-games', (message) => {
//       expect(message).toEqual({ data: [], status: 200 });
//       // console.log(message);
//       done();
//     });
//     clientSocket.emit('list-games');
//   });

//   it('should return a list with a single item when only one game initialized', (done) => {
//     clientSocket.emit('new-game');
//     clientSocket.on('list-games', (message) => {
//       expect(message.data.length).toBe(1);
//       expect(message.data[0]).toMatch(/game-(.*?)/);
//       done();
//     });
//     clientSocket.emit('list-games');
//   });

//   it('should return a list with a single item when only one game initialized and one game terminated at previous point', (done) => {
//     clientSocket.emit('new-game');
//     clientSocket.on('list-games', (message) => {
//       expect(message.data.length).toBe(1);
//       expect(message.data[0]).toMatch(/game-(.*?)/);
//       done();
//     });

//     clientSocket.emit('list-games');
//   });

//   it('should return a list with N items when N games initialized', (done) => {
//     const N = Math.floor(Math.random() * 100);

//     let tempClients = [];
//     for (let i = 0; i < N; i += 1) {
//       const tempClientSocket = clientIO('ws://0.0.0.0:5000', {
//         transports: ['websocket'],
//       });
//       tempClients = tempClients.concat(tempClientSocket);
//     }

//     clientSocket.emit('new-game');
//     clientSocket.on('list-games', (message) => {
//       expect(message.data.length).toBe(1);
//       expect(message.data[0]).toMatch(/game-(.*?)/);
//       done();
//     });

//     clientSocket.emit('list-games');
//   });
// });

//  Должно быть ниже всех тестов
describe('On disconnect', () => {
  it('should remove INACTIVE game WITH NO other players if current player IS HOST', (done) => {
    let gameId;

    function callbackDisconnect() {
      clientSocket.disconnect();
      setTimeout(() => {
        expect(server.games[gameId]).toBeUndefined();
        expect(server.games).toEqual({});
        done();
      }, 25);
    }

    clientSocket.on('new-game', (message) => {
      gameId = message.id;
      expect(message.id).toMatch(/game-(.*?)/);
      expect(message.message).toBe('Game created successfully');
      expect(message.status).toBe(200);
      callbackDisconnect();
    });

    clientSocket.emit('new-game');
  });

  it('should remove ACTIVE game WITH NO other players if current player IS HOST', (done) => {
    let gameId;

    function callbackDisconnect() {
      clientSocket.disconnect();
      setTimeout(() => {
        expect(server.games[gameId]).toBeUndefined();
        expect(server.games).toEqual({});
        done();
      }, 25);
    }

    clientSocket.on('new-game', (message) => {
      gameId = message.id;
      expect(message.id).toMatch(/game-(.*?)/);
      expect(message.message).toBe('Game created successfully');
      expect(message.status).toBe(200);
      clientSocket.emit('start-game', { id: gameId });
    });

    clientSocket.on('start-game', () => {
      callbackDisconnect();
    });

    clientSocket.emit('new-game');
  });

  it('should remove INACTIVE game WITH other players if current player IS HOST', (done) => {
    let gameId;
    let otherClients = [];

    for (let i = 0; i < Math.floor(Math.random() * 3 + 1); i += 1) {
      otherClients.push(clientIO('ws://127.0.0.1:5000', { transports: ['websocket'] }));
    }

    function callbackDisconnect() {
      clientSocket.disconnect();
      setTimeout(() => {
        expect(server.games[gameId]).toBeUndefined();
        expect(server.games).toEqual({});
        done();
      }, 25);
    }

    function callbackJoin() {
      otherClients.forEach((client) => client.emit('join-game', { id: gameId }));
      setTimeout(() => {
        callbackDisconnect();
      }, 25);
    }

    clientSocket.on('new-game', (message) => {
      gameId = message.id;
      expect(message.id).toMatch(/game-(.*?)/);
      expect(message.message).toBe('Game created successfully');
      expect(message.status).toBe(200);
      callbackJoin();
    });

    clientSocket.emit('new-game');
  });

  it('should NOT remove ACTIVE game WITH other players if current player IS HOST', (done) => {
    let gameId;
    const otherClients = [];

    for (let i = 0; i < Math.floor(Math.random() * 3 + 1); i += 1) {
      otherClients.push(clientIO('ws://127.0.0.1:5000', { transports: ['websocket'] }));
    }

    function callbackDisconnect() {
      clientSocket.disconnect();
      setTimeout(() => {
        expect(server.games[gameId]).not.toBeUndefined();
        expect(server.games).not.toEqual({});
        expect(Object.entries(server.games).length).toBe(1);
        otherClients.forEach((client) => client.disconnect());
        done();
      }, 25);
    }

    function callbackJoin() {
      otherClients.forEach((client) => client.emit('join-game', { id: gameId }));
      setTimeout(() => {
        callbackDisconnect();
      }, 25);
    }

    clientSocket.on('new-game', (message) => {
      gameId = message.id;
      expect(message.id).toMatch(/game-(.*?)/);
      expect(message.message).toBe('Game created successfully');
      expect(message.status).toBe(200);
      clientSocket.emit('start-game', { id: gameId });
    });

    clientSocket.on('start-game', () => {
      callbackJoin();
    });

    clientSocket.emit('new-game');
  });
});
