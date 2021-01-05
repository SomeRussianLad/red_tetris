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

describe('On list-games', () => {
  // it('should return an empty list when no games initialized', (done) => {
  //   clientSocket.on('list-games', (message) => {
  //     expect(message).toEqual({ data: [], status: 200 });
  //     // console.log(message);
  //     done();
  //   });
  //   clientSocket.emit('list-games');
  // });

  // it('should return a list with a single item when only one game initialized', (done) => {
  //   clientSocket.emit('new-game');
  //   clientSocket.on('list-games', (message) => {
  //     expect(message.data.length).toBe(1);
  //     expect(message.data[0]).toMatch(/game-(.*?)/);
  //     done();
  //   });
  //   clientSocket.emit('list-games');
  // });

  // it('should return a list with a single item when only one game initialized and one game terminated at previous point', (done) => {
  //   clientSocket.emit('new-game');
  //   clientSocket.on('list-games', (message) => {
  //     expect(message.data.length).toBe(1);
  //     expect(message.data[0]).toMatch(/game-(.*?)/);
  //     done();
  //   });
  //   clientSocket.emit('list-games');
  // });

  // it('should return a list with N items when N games initialized', (done) => {
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

//  Должно быть ниже всех тестов
describe('On disconnect', () => {
  it('should remove INACTIVE game WITH NO other players if current player IS HOST', (done) => {
    let gameId;

    function callback() {
      clientSocket.disconnect();
      setTimeout(() => {
        expect(server.games[gameId]).toBeUndefined();
        done();
      }, 100);
    }
    
    clientSocket.on('new-game', (message) => {
      gameId = message.id
      expect(message.id).toMatch(/game-(.*?)/);
      expect(message.message).toBe('Game created successfully');
      expect(message.status).toBe(200);
      callback();
    })
    clientSocket.emit('new-game');
  });

  // it('should remove ACTIVE game WITH NO other players if current player IS HOST', (done) => {
  //   let gameId;
    
  //   function callback() {
  //     clientSocket.emit('start-game', { id: gameId });
  //     clientSocket.disconnect();
  //     expect(server.games[gameId]).toBeUndefined();
  //     done();
  //   }

  //   clientSocket.on('new-game', (message) => {
  //     gameId = message.id;
  //     expect(message.id).toMatch(/game-(.*?)/);
  //     expect(message.message).toBe('Game created successfully');
  //     expect(message.status).toBe(200);
  //     callback();
  //   })
  //   clientSocket.emit('new-game');
  // });

  // it('should remove INACTIVE game WITH other players if current player IS HOST', (done) => {
  //   let gameId;
    
  //   clientSocket.on('new-game', (message) => { gameId = message.id })
  //   clientSocket.emit('new-game');

  //   let otherPlayers = [
  //     clientIO('ws://0.0.0.0:5000', { transports: ['websocket'] }),
  //     clientIO('ws://0.0.0.0:5000', { transports: ['websocket'] }),
  //   ]
  //   otherPlayers.forEach((player) => player.emit('join-game', { id: gameId }));

  //   // clientSocket.emit('start-game', { id: gameId });
  //   clientSocket.disconnect();

  //   expect(server.games[gameId]).toBeUndefined();

  //   otherPlayers.forEach((player) => player.disconnect())
  //   done();
  // });

  // it('should NOT remove ACTIVE game WITH other players if current player IS HOST', (done) => {
  //   let gameId;
    
  //   clientSocket.on('new-game', (message) => { 
  //     console.log(message);
  //     gameId = message.id
  //   })
  //   clientSocket.emit('new-game');

  //   console.log(gameId);
  //   console.log(server.games);

  //   let otherPlayers = [
  //     clientIO('ws://0.0.0.0:5000', { transports: ['websocket'] }),
  //     clientIO('ws://0.0.0.0:5000', { transports: ['websocket'] }),
  //   ]
  //   otherPlayers.forEach((player) => player.emit('join-game', { id: gameId }));

  //   clientSocket.emit('start-game', { id: gameId });
  //   clientSocket.disconnect();

  //   expect(server.games[gameId]).not.toBeUndefined();

  //   otherPlayers.forEach((player) => player.disconnect())
  //   done();
  // });
});
