import React from "react";
import PropTypes from "prop-types";

function Square(props) {
	//funcion que recibe los click del usuario
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	//Board se encarga de decidir el turno del jugador, quien gana o pierde, ademas de dibujar los cuadros en el DOM
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		return (
			<div>
				<div className="status">{status}</div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

export class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					square: Array(9).fill(null)
				}
			],
			stepNumber: 0, //para saber en cual paso del historial estamos
			xISNext: true
		};
	}
	handleClick(i) {
		//se dispara cuando hacemos click en un cuadro y el decide turno del jugador
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = this.state.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xISNext ? "X" : "O";
		this.setState({
			history: history.concat([
				{
					squares: squares
				}
			]),
			stepNumber: history.length,
			xISNext: !this.state.xISNext
		});
	}
	jumpTo(step) {
		//actualiza stepNumber para llevar el historial
		this.setState({
			stepNumber: step,
			xISNext: step % 2 === 0
		});
	}
	render() {
		// renderiza el ultimo componente para mantener el historial, tambien decide el ganador y el donde esta todo el juego
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const moves = history.map((step, move) => {
			const desc = move ? "Go to move #" + move : "Go to game start";
			return (
				<li key={move}>
					<button onClick={() => this.jump(move)}>{desc}</button>
				</li>
			);
		});

		let status;
		if (winner) {
			status = "Winner" + winner;
		} else {
			status = "Next player: " + (this.state.xISNext ? "X" : "O");
		}
		return (
			<div className="game">
				<div className="game-board">
					<Board />
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================
function calculateWinner(squares) {
	// calcula quien es el ganador basado en si todas las lineas coinciden
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[a] === squares[c]
		) {
			return squares[a];
		}
	}
	return null;
}

Square.propTypes = {
	value: PropTypes.number,
	onClick: PropTypes.func
};

Board.propTypes = {
	value: PropTypes.arrayOf(PropTypes.number),
	onClick: PropTypes.func
};
