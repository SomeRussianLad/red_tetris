import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './game.module.scss';
import {
  actionGame, getMap, joinGame, startGame,
} from '../../middleware/storeStateMiddleWare';

// eslint-disable-next-line react/prop-types
const Pixel = ({ color }) => (
  <div className={color === 0 ? styles.wrapperPixel : styles.wrapperPixelBlack}>
    <div className={color === 0 ? styles.pixel : styles.pixelBlack} />
  </div>
);

// eslint-disable-next-line react/prop-types
const Game = ({
  // eslint-disable-next-line react/prop-types
  dispatchJoinGame, dispatchGetMap, dispatchStartGame, game, map,
  // eslint-disable-next-line no-unused-vars,react/prop-types
  dispatchAction, otherMap,
}) => {
  /* eslint-disable */
  const [startGame,setStartGame] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if(id)
    dispatchJoinGame(id);
  },[]);

  useEffect(() => {
    if(startGame)
      dispatchGetMap();
  },[map, startGame]);

  useEffect(() =>{
    document.addEventListener("keydown",handleKeyPress);
  },[])

  const handleKeyPress = ({code}) => {
    const ACTION = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'rotate',
      ArrowDown: 'down',
      Space: 'drop',
    }
     dispatchAction({id: game, action: ACTION[code]})
  }

  const start = () => {
    dispatchStartGame();
    setStartGame(true);
  }

  return (
    <div className={styles.container}>
      {id === game && !startGame && (<button onClick={start}>START</button>)}
      {map && map.isAlive &&
        <div className={styles.map}>
        <div className={styles.containerMap}>
        { map.field && map.field.length && map.field.map((str) => (
          <div className={styles.containerStr}>
            {str.map((color) => <Pixel color={color} />)}
          </div>
        ))}
      </div>
      <div className={styles.containerMap}>
        {map && map.nextPiece && map.nextPiece.map((str) => (
          <div className={styles.containerStr}>
            {str.map((color) => <Pixel color={color} />)}
          </div>
        ))}
      </div>
          <div>
            {console.log('otherMap',otherMap)}
            {otherMap && otherMap.map((itemMap) => (<div className={styles.containerMap}>
                { itemMap && itemMap.field && itemMap.field.length && itemMap.field.map((str) => (
                  <div className={styles.containerStr}>
                    {str.map((color) => <Pixel color={color} />)}
                  </div>
                ))}
              </div>))}
          </div>
    </div>}
    </div>
  );
};

 const mapDispatchToProps = {
  dispatchJoinGame: joinGame,
   dispatchStartGame: startGame,
   dispatchGetMap: getMap,
   dispatchAction: actionGame,
};

const mapStateToProps = (state) => ({
  game: state.game.game,
  map: state.game.myMap,
  otherMap: state.game.otherMap,
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo
(Game));
