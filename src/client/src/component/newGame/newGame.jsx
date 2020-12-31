import React, { useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import styles from './newGame.module.scss';

const NewGame = () => {
  const socket = socketIOClient('ws://127.0.0.1:5000', { transports: ['websocket'] });
  // eslint-disable-next-line no-undef
  // const [response, setResponse] = useState('');
  useEffect(() => {
    socket.on('new-game', (response) => { console.log(response); }); // { id: '...', message: '...', status: 200 | 400 }
  }, []);

  return (
    <div className={styles.container}>
      <p>{}</p>
    </div>
  );
};

export default NewGame;
