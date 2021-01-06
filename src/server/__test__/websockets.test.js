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

describe('On new game', () => {
  it('should return ID of a newly created session if player has NO OTHER SESSIONS', (done) => {
    clientSocket.on('new-game', (message) => {
      expect(message.id).toMatch(/game-(.*?)/);
      expect(message.message).toBe('Game created successfully');
      expect(message.status).toBe(200);
      done();
    });

    clientSocket.emit('new-game');
  });

  it('should PROHIBIT creating new game if previous session not closed', (done) => {
    let count = 0;

    clientSocket.on('new-game', (message) => {
      count += 1;

      if (count === 2) {
        expect(message.id).toBe(null);
        expect(message.message).toBe('Previous session not closed');
        expect(message.status).toBe(400);
        done();
      }
    });
    clientSocket.emit('new-game');
    clientSocket.emit('new-game');
  });
});

describe('On list games', () => {
  it('should return an EMPTY LIST when NO ONE initializes the game', (done) => {
    clientSocket.on('list-games', (message) => {
      expect(message.data.length).toBe(0);
      expect(message.status).toBe(200);
      done();
    });

    clientSocket.emit('list-games');
  });

  it('should return a list with a SINGLE ITEM when ONE PLAYER initializes the game', (done) => {
    clientSocket.on('list-games', (message) => {
      expect(message.data.length).toBe(1);
      expect(message.data[0]).toMatch(/game-(.*?)/);
      expect(message.status).toBe(200);
      done();
    });

    clientSocket.on('new-game', () => {
      clientSocket.emit('list-games');
    });

    clientSocket.emit('new-game');
  });

  it('should return a list with SEVERAL ITEMS when SEVERAL PLAYERS initialize the game', (done) => {
    const otherClients = [];

    for (let i = 0; i < Math.floor(Math.random() * 3 + 1); i += 1) {
      otherClients.push(clientIO('ws://127.0.0.1:5000', { transports: ['websocket'] }));
    }

    function callbackDisconnect() {
      clientSocket.disconnect();
      otherClients.forEach((otherClientSocket) => otherClientSocket.disconnect());
      setTimeout(() => {
        done();
      }, 250);
    }

    clientSocket.on('list-games', (message) => {
      expect(message.data.length).toBe(otherClients.length + 1);
      message.data.forEach((game) => {
        expect(game).toMatch(/game-(.*?)/);
      });
      expect(message.status).toBe(200);

      callbackDisconnect();
    });

    clientSocket.on('new-game', () => {
      clientSocket.emit('list-games');
    });

    otherClients.forEach((otherClientSocket, i) => {
      otherClientSocket.emit('new-game');
      if (i === otherClients.length - 1) {
        setTimeout(() => {
          clientSocket.emit('new-game');
        }, 250);
      }
    });
  });
});

//  Должно быть ниже всех тестов
describe('On disconnecting', () => {
  it('should remove INACTIVE game WITH NO other players if current player IS HOST', (done) => {
    let gameId;

    function callbackDisconnect() {
      clientSocket.disconnect();
      setTimeout(() => {
        expect(server.games[gameId]).toBeUndefined();
        expect(Object.entries(server.games).length).toBe(0);
        done();
      }, 250);
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
        expect(Object.entries(server.games).length).toBe(0);
        done();
      }, 250);
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
        expect(Object.entries(server.games).length).toBe(0);
        done();
      }, 250);
    }

    function callbackJoin() {
      otherClients.forEach((otherClientSocket) => otherClientSocket.emit('join-game', { id: gameId }));
      setTimeout(() => {
        callbackDisconnect();
      }, 250);
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
        expect(Object.entries(server.games).length).toBe(1);
        otherClients.forEach((otherClientSocket) => otherClientSocket.disconnect());
        done();
      }, 250);
    }

    function callbackJoin() {
      otherClients.forEach((otherClientSocket) => otherClientSocket.emit('join-game', { id: gameId }));
      setTimeout(() => {
        callbackDisconnect();
      }, 250);
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
