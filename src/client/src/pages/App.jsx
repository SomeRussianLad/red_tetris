import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Game from '../component/game/game';
import styles from './App.module.scss';

import Start from '../component/start/start';
import JoinGame from '../component/joinGame/joinGame';
import NewGame from '../component/newGame/newGame';

const paths = {
  game: '/game/:id',
  index: '/',
  join: '/joingame',
  new: '/newgame',
};

const App = () => (
  <div className={styles.container}>
    <Switch>
      <Route
        exact
        path={paths.game}
        component={Game}
      />
      <Route
        path={paths.new}
        exact
        component={NewGame}
      />
      <Route
        path={paths.index}
        exact
        component={Start}
      />
      <Route
        path={paths.join}
        exact
        component={() => (
          <JoinGame />
        )}
      />
    </Switch>
  </div>
);

export default App;
