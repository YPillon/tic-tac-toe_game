import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./responsive.css";

function Square(props) {
  return (
    <button
      className={"square " + props.className}
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        className={
          this.props.winnerIndexes.indexOf(i) !== -1 ? "highlight" : ""
        }
        key={"square " + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderSquares(n) {
    let squares = [];
    for (let i = n; i < n + 3; i++) {
      squares.push(this.renderSquare(i));
    }
    return squares;
  }

  renderRows(i) {
    return <div className="board-row">{this.renderSquares(i)}</div>;
  }

  render() {
    return (
      <div>
        {this.renderRows(0)}
        {this.renderRows(3)}
        {this.renderRows(6)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isOrderDescending: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    let lastMove = {};
    if (i === 0 || i === 3 || i === 6) {
      lastMove.col = 1;
    }
    if (i === 1 || i === 4 || i === 7) {
      lastMove.col = 2;
    }
    if (i === 2 || i === 5 || i === 8) {
      lastMove.col = 3;
    }

    if (i === 0 || i === 1 || i === 2) {
      lastMove.row = 1;
    }
    if (i === 3 || i === 4 || i === 5) {
      lastMove.row = 2;
    }
    if (i === 6 || i === 7 || i === 8) {
      lastMove.row = 3;
    }

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat({
        squares: squares,
        lastMove: lastMove,
      }),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  switchHistoryOrder() {
    this.setState({
      isOrderDescending: !this.state.isOrderDescending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          ` (col : ${step.lastMove.col}, row : ${step.lastMove.row})`
        : "Go to game start";

      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={
              "fontSize button " +
              (move === this.state.stepNumber ? "highlight" : "")
            }
          >
            {desc}
          </button>
        </li>
      );
    });

    const reversedMoves = moves.slice().reverse();

    let status;
    if (winner) {
      status = `The winner is ${winner.name}!`;
    } else if (!winner && this.state.stepNumber === 9) {
      status = "This is a draw!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winnerIndexes={winner ? winner.indexes : ""}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div
            className={
              "fontSize status " +
              ((!winner && this.state.stepNumber === 9) || winner
                ? "highlight"
                : "")
            }
            style={{ width: 'fit-content' }}
          >
            {status}
          </div>
          {this.state.isOrderDescending ? (
            <ol reversed>{reversedMoves}</ol>
          ) : (
            <ol>{moves}</ol>
          )}
          <button
            onClick={() => this.switchHistoryOrder()}
            className="fontSize button"
          >
            Switch history order
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { name: squares[a], indexes: [a, b, c] };
    }
  }
  return null;
}
