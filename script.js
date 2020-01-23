let ticBoard;
const player = '0';
const bot = 'X';
const winPos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,4,8],
	[2,4,6],
	[0,3,6],
	[1,4,7],
	[2,5,8]
];

const cells = document.querySelectorAll('.cell');


const startGame = () => {

	document.querySelector('.endgame').style.display = "none";
	ticBoard = Array.from(Array(9).keys());

	for(let i = 0; i < cells.length; i++){
		cells[i].innerHTML = "";
		cells[i].addEventListener('click', makeChoice);
		cells[i].style.backgroundColor =  '#fff';
	}
}
startGame();

function makeChoice(event) {
	if(typeof ticBoard[event.target.id] == 'number'){
	choose(event.target.id, player);
	if (!draw())
		choose(bestCell(), bot);
	}
}

function choose(cellId, playerType){
	ticBoard[cellId] = playerType;
	document.getElementById(cellId).innerHTML = playerType;
	let gameWon = checkWinner(ticBoard, playerType);
		if(gameWon)
			gameOver(gameWon);
}

function checkWinner(board, player) {
	let plays = board.reduce((accumulator,element,index) => {
		return (element === player ) ? accumulator.concat(index) : accumulator;
	}, [] );
	let gameWon = null;
	for (let [index, win] of winPos.entries()){
		if(win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = { index: index, player: player };
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winPos[gameWon.index]){
		document.getElementById(index).style.color = "#171733";
		document.getElementById(index).style.backgroundColor = gameWon.player == player ? "#737373": "#990066";
	}
	for(let i = 0; i < cells.length; i++){
		cells[i].removeEventListener('click', makeChoice);
	}

	declareWinner(gameWon.player == bot ? "You Loose!" : "You won.");

}

function bestCell() {
	return minimax(ticBoard, bot).index;
}

function emptyCells() {
	return ticBoard.filter(s => typeof s == 'number');
}

function draw() {
	if(emptyCells().length == 0){
		for (let i = 0; i < cells.length; i++){
			cells[i].style.backgroundColor = "#990066";
			cells[i].removeEventListener('click', makeChoice);
		}
		declareWinner("Tie Game! ");
		return true;
	}
	return false;
}

function declareWinner(str) {
	document.querySelector('.endgame').style.display = "flex";
	document.querySelector(".endgame .text").innerText = str;
}

function minimax(newBoard, player){
	let availSpots= emptyCells(newBoard);

	if (checkWinner(newBoard, player)){
		return {score: -10};
	} else if (checkWinner(newBoard, bot)){
		return {score: 10};
	} else if (availSpots.length === 0){
		return {score : 0};
	}
	let moves = [];
	for (let i = 0; i < availSpots.length; i++){
		let move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == bot) {
			let result = minimax(newBoard, player);
			move.score = result.score;
		} else {
			let result = minimax(newBoard, bot);
			move.score = result.score;
		}
		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}
 
	let bestMove;
	if (player == bot){
		let bestScore = -10000;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = 10000;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}

