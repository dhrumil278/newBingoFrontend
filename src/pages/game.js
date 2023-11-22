import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { FaRegUserCircle } from 'react-icons/fa';

function Game({ socket }) {
  const location = useLocation();
  let { game } = location.state;
  let code;
  let admin;
  code = game.code;
  admin = game.admin;
  const navigate = useNavigate();
  const [playerCount, setPlayerCount] = useState(1);
  const [capacity, setCapacity] = useState(2);
  const [playerTurn, setPlayerTurn] = useState('');
  const [newGame, setNewGame] = useState(game);
  const [bingoWord, setBingoWord] = useState('');
  const [steps, setNewSteps] = useState({});
  const [winner, setWinner] = useState('');

  // Current Player
  const currentPlayer = JSON.parse(localStorage.getItem('userData')).id;
  const playerIndex = game.players.findIndex(
    (a) => a.player._id === currentPlayer
  );

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    socket.on('userJoinInRoom', async (res) => {
      await setNewGame(res.data.game);
      toast.success(
        `${
          res.data.game.players[res.data.game.players.length - 1].player.name
        } Joined`
      );
      if (res?.data?.game?.players?.length) {
        setPlayerCount(res?.data?.game?.players?.length);
      }
      if (res?.data?.game.capacity) {
        setCapacity(res?.data?.game.capacity);
      }
    });

    socket.on('firstPlayerTurn', async (data) => {
      setNewGame(data.data.game);
      setPlayerTurn(data.data.firstplayer.player._id);
    });

    socket.on('nextPlayerTurn', async (data) => {
      setNewGame(data.data.game);
      let lastStep = data.data.game.steps[data.data.game.steps.length - 1];
      let lastNum = lastStep.num;
      let lastNumColor = lastStep.color;
      steps[lastNum] = lastNumColor;
      setNewSteps(steps);
      await checkBingo();
      setPlayerTurn(data.data.nextPlayerTurn._id);
    });

    socket.on('winner-response', async (data) => {
      if (data.hasError === false) {
        await setWinner(data.data.userData.name);
      }
    });
  }, []);

  // start match function
  const startMatch = () => {
    socket.emit('startMatch', { code: code });
  };

  // hanfleSteps Function
  const handleClick = (e) => {
    socket.emit('userMove', {
      num: e.target.value,
      id: currentPlayer,
      code: code,
    });
  };

  /**
   * Bingo Logic Function Starts
   */
  const checkBingo = () => {
    let bingoCount = 0;

    const combination = [
      [0, 1, 2, 3, 4],
      [0, 5, 10, 15, 20],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20],
    ];

    const clickedindex = [];

    for (const key in steps) {
      const Obj = newGame.players.filter((a) => a.player._id === currentPlayer);

      const index = Obj[0].bingoBoard.findIndex(
        (a) => parseInt(a) === parseInt(key)
      );

      if (index > -1) {
        clickedindex.push(index);
      }
    }

    for (let i = 0; i < combination.length; i++) {
      let count = 0;
      for (let j = 0; j < combination[i].length; j++) {
        for (let k = 0; k < clickedindex.length; k++) {
          if (clickedindex[k] === combination[i][j]) {
            count++;
          } else {
            continue;
          }
        }
        if (count === 5) {
          bingoCount++;
        } else if (count === 0 && j > 0) {
          break;
        }
      }
    }

    switch (bingoCount) {
      case 0:
        setBingoWord('');
        break;
      case 1:
        setBingoWord('B');
        break;
      case 2:
        setBingoWord('BI');
        break;
      case 3:
        setBingoWord('BIN');
        break;
      case 4:
        setBingoWord('BING');
        break;
      case 5:
        setBingoWord('BINGO');
        break;
      default:
        break;
    }
    if (bingoCount === 5) {
      socket.emit('winner', { id: currentPlayer, code: code });
    }
  };

  const handleContinue = () => {
    navigate('/home');
  };
  /**
   * Bingo Logic Function Ends
   */
  const playerTurnCSS = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px solid #26abe2',
    borderRadius: '15px',
    padding: '7px',
    boxShadow: 'rgba(47, 43, 61, 0.1) 0px 4px 18px 0px',
    marginBottom: '7px',
    color: 'black',
  };

  // CSS for active player turn
  const activePlayerTurn = {
    backgroundColor: '#C5E898',
    ...playerTurnCSS,
  };

  // CSS for deactive player turn
  const deactivePlayerTurn = {
    backgroundColor: 'white',
    ...playerTurnCSS,
  };
  return (
    <>
      {bingoWord === 'BINGO' || winner !== '' ? (
        <>
          <div
            style={{
              width: '100%',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#87CEEB',
            }}
          >
            <p
              style={{
                textAlign: 'center',
                fontFamily: "'Marhey', sans-serif",
                textShadow: '2px 4px 3px rgba(0,0,0,0.3)',
                fontSize: '50px',
                color: 'white',
                backgroundColor: '#87CEEB',
              }}
            >
              Congratulation....
            </p>
            <div
              style={{
                fontSize: '50px',
                textAlign: 'center',
                fontFamily: "'Marhey', sans-serif",
                textShadow: '2px 4px 3px rgba(0,0,0,0.3)',
                color: 'white',
                backgroundColor: '#87CEEB',
              }}
            >
              Winner is {winner} !!
            </div>
            <div>
              <button
                type='btn'
                style={{
                  backgroundColor: '#87CEEB',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '5px',
                  fontSize: '18px',
                  padding: '5px 10px',
                }}
                onClick={() => {
                  handleContinue();
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </>
      ) : (
        <div>
          <ToastContainer />
          <div
            style={{
              backgroundColor: '#87CEEB',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{ position: 'absolute', bottom: '25px', right: '25px' }}
            >
              {admin === currentPlayer ? (
                <>
                  <Button
                    size='lg'
                    style={{
                      backgroundColor: 'white',
                      color: 'black',
                      border: 'none',
                      marginRight: '15px',
                    }}
                    onClick={() => startMatch()}
                  >
                    Start Match
                  </Button>
                  <Button
                    size='lg'
                    color='secondary'
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <span></span>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '250px',
                  marginRight: '25px',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '15px',
                    border: '2px solid #26abe2',
                    borderRadius: '15px',
                  }}
                >
                  RoomId: {code}
                </div>
                <div>
                  <h4
                    style={{
                      paddingTop: '15px',
                      textAlign: 'center',
                      fontFamily: "'Marhey', sans-serif",
                      textShadow: '2px 4px 3px rgba(0,0,0,0.3)',
                      // color: '#fff',
                    }}
                  >
                    Players {playerCount}/{capacity}
                  </h4>
                  {game.players.map((a) => {
                    return (
                      <div
                        style={
                          a.player._id === playerTurn
                            ? activePlayerTurn
                            : deactivePlayerTurn
                        }
                      >
                        <div>
                          <FaRegUserCircle size={25} />
                        </div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            fontFamily: 'cursive',
                          }}
                        >
                          {a.player.name}
                        </div>
                        <div
                          style={{
                            border: 'none',
                            borderRadius: '50%',
                            backgroundColor: `${a.color}`,
                            width: '20px',
                            height: '20px',
                            boxShadow: 'rgba(47, 43, 61, 0.1) 0px 4px 18px 0px',
                          }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  // justifyContent: 'center',
                  width: '100%',
                  maxWidth: '520px',
                  marginLeft: '25px',
                }}
              >
                <h2
                  style={{
                    fontSize: '48px',
                    color: '#fff',
                    fontFamily: "'Marhey', sans-serif",
                    textShadow: '2px 4px 3px rgba(0,0,0,0.3)',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  {bingoWord}
                  {/* BINGO */}
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto auto auto auto auto',
                    gridGap: '5px',
                    width: '100%',
                    maxWidth: '520px',
                    // marginLeft: '25px',
                  }}
                >
                  {newGame.players[playerIndex].bingoBoard.map((a, j) => {
                    if (steps[a]) {
                      return (
                        <button
                          className='btn rounded '
                          style={{
                            maxWidth: '100px',
                            backgroundColor: `${steps[a]}`,
                            minHeight: '100px',
                          }}
                          value={a}
                          onClick={(e) => handleClick(e)}
                          disabled
                        >
                          {a}
                        </button>
                      );
                    } else {
                      return (
                        <button
                          className='btn rounded '
                          style={{
                            maxWidth: '100px',
                            backgroundColor: 'white',
                            minHeight: '100px',
                          }}
                          value={a}
                          onClick={(e) => handleClick(e)}
                          disabled={
                            playerTurn === '' || playerTurn !== currentPlayer
                          }
                        >
                          {a}
                        </button>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Game;
