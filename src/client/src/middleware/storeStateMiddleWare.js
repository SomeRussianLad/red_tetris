import socketIOClient from 'socket.io-client';
import handleErrors from '../utils/handleErrors';
import { setGame } from '../store/actions/actionGame';

export const setNewGame = () => (dispatch) => {
  const socket = socketIOClient();
  socket.on('new-game', (res) => {
    if (res.status !== 200) handleErrors(res);
    dispatch(setGame(res.id));
  });
  socket.emit('new-game');
};
export default setNewGame;
