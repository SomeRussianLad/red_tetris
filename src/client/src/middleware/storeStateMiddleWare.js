import socketIOClient from 'socket.io-client';
import handleErrors from '../utils/handleErrors';
import { setGame, setList } from '../store/actions/actionGame';

const socket = socketIOClient();

export const setNewGame = () => (dispatch) => {
  socket.on('new-game', (res) => {
    if (res.status !== 200) handleErrors(res);
    dispatch(setGame(res.id));
  });
  socket.emit('new-game');
};

export const setListGame = () => (dispatch) => {
  socket.on('list-games', (res) => {
    dispatch(setList(res.data));
  });
  socket.emit('list-games');
};
