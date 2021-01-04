import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NavLink } from 'react-router-dom';
import styles from './newGame.module.scss';
import Copy from '../../common/copy.png';

const NewGame = () => {
  const [response, setResponse] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (!response) {
      const socket = socketIOClient();
      socket.on('new-game', (res) => {
        setResponse(`http://127.0.0.1:5000/game/${res.id}`);
        setLink(`game/${res.id}`);
      });
      socket.emit('new-game');
    }
  }, [response]);

  return (
    <div className={styles.container}>
      <div>
        <input className={styles.input} value={response} />
        <CopyToClipboard text={response}>
          <img className={styles.copy} src={Copy} alt="copy" />
        </CopyToClipboard>
      </div>
      <NavLink clasName={styles.link} to={link}>Go to the Game</NavLink>
    </div>
  );
};

export default NewGame;
