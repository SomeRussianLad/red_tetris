import React from 'react';
import { Router, Route } from 'react-router-dom';
import Game from './component/game/game';
import styles from './App.module.scss';
import history from './utils/history';
import Start from './component/start/start';
import NewGame from './component/newGame/newGame';
import JoinGame from './component/joinGame/joinGame';

const paths = {
  game: '/game',
  index: '/',
  join: '/joingame',
  new: '/newgame',
};

const App = () => (
  <Router history={history}>
    <div className={styles.container}>
      <Route
        exact
        path={paths.game}
        component={() => (
          <Game />
        )}
      />
      <Route
        exact
        path={paths.index}
        component={() => (
          <Start />
        )}
      />
      <Route
        exact
        path={paths.new}
        component={() => (
          <NewGame />
        )}
      />
      <Route
        exact
        path={paths.join}
        component={() => (
          <JoinGame />
        )}
      />
    </div>
  </Router>
);

export default App;
