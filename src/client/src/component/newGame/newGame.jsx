import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './newGame.module.scss';
import Copy from '../../common/copy.png';
import { setNewGame } from '../../middleware/storeStateMiddleWare';

// eslint-disable-next-line react/prop-types
const NewGame = ({ dispatchNewGame, game }) => {
  const [response, setResponse] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    dispatchNewGame();
  }, []);

  useEffect(() => {
    if (game !== '') {
      setResponse(`http://127.0.0.1:5000/game/${game}`);
      setLink(`game/${game}`);
    }
  }, [game]);

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
const mapDispatchToProps = {
  dispatchNewGame: setNewGame,
};

const mapStateToProps = (state) => ({
  game: state.game.game,
});

export default connect(mapStateToProps, mapDispatchToProps)(NewGame);
