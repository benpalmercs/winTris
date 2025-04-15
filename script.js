
const cellSize = 30; // Size of each cell in pixels
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let board = [[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0]];

function displayBoard(board){
	let string = "";
	for(var y = 0;y<board.length;y++){
		let string = "";
		for(var x = 0;x<board[y].length;x++){
			string += board[y][x];
			string+= "  ";
		}
		console.log(string);
	}
	console.log(" ");
}

function fancyDisplay(board) {
	const filled = "■"; // You could also try "⬜" or "🟦" for more color
	const empty = " ";
	const topBorder = "┌" + "──".repeat(board[0].length) + "┐";
	const bottomBorder = "└" + "──".repeat(board[0].length) + "┘";
	
	console.log(topBorder);
	for (let y = 0; y < board.length; y++) {
		let rowStr = "│";
		for (let x = 0; x < board[y].length; x++) {
			rowStr += board[y][x] ? filled + " " : empty + " ";
		}
		rowStr += "│";
		console.log(rowStr);
	}
	console.log(bottomBorder);
	console.log("\n");
}

function displayToCanvas(board) {
	ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawing

	for (let y = 0; y < board.length; y++) {
		for (let x = 0; x < board[y].length; x++) {
			// Draw the background
			ctx.fillStyle = board[y][x] === 1 ? "#007bff" : "#ffffff"; // Color for filled or empty
			ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

			// Draw grid lines (optional)
			ctx.strokeStyle = "#000000"; // Grid line color
			ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
		}
	}

}

function lineClear(board,row){
	let rowU = 20-row;
	for(var y = rowU;y>0;y--){
		for(var x = 0;x<board[rowU].length;x++){
			board[y][x]=board[y-1][x];
		}
	}
	for(var x = 0;x<board[0].length;x++){
		board[0][x] = 0;
	}
}

function isCleared(board,row){
	let rowU = 20-row;
	for(var x = 0;x<board[rowU].length;x++){
			if(board[rowU][x]==0){
				return false;
			}
	}
	return true;
}

class pieceTile {
	constructor(myBoard,x,y){
		this.y = y;
		this.x = x;
		this.board = myBoard;
		myBoard[this.y][this.x] = 1;
	}
	project(){
		this.board[this.y][this.x] = 1;
	}
	remove(){
		this.board[this.y][this.x] = 0;
	}
	moveLeft(){
		this.x = this.x-1;
	}
	moveRight(){
		this.x = this.x+1;
	}
	moveDown(){
		this.y = this.y+1;
	}
}

class Piece {
	constructor(myBoard,x,y){
		this.board = myBoard;
		this.x = x;
		this.y = y;
	}
	isInBlock(y,x){
		for(var i = 0;i<this.pieces.length;i++){
			if(this.pieces[i].x == x && this.pieces[i].y == y){
				return true;
			}
		}
		return false;
	}
	
	project(){
		for(var i = 0;i<this.pieces.length;i++){
			this.pieces[i].project();
		}
	}
	
	remove(){
		for(var i = 0;i<this.pieces.length;i++){
			this.pieces[i].remove();
		}
	}
	
	canMoveLeft(){
		for(var i = 0;i<this.pieces.length;i++){
			if(this.pieces[i].x-1<0){
				return false;
			}
			if((this.board[this.pieces[i].y][this.pieces[i].x-1]==1 && 
			!this.isInBlock(this.pieces[i].y,this.pieces[i].x-1))){
				return false;
			}
		}
		return true
	}
	
	canMoveRight(){
		for(var i = 0;i<this.pieces.length;i++){
			if(this.pieces[i].x+1>9){
				return false;
			}
			if((this.board[this.pieces[i].y][this.pieces[i].x+1]==1 && 
			!this.isInBlock(this.pieces[i].y,this.pieces[i].x+1))){
				return false;
			}
		}
		return true
	}
	
	canMoveDown(){
	for(var i = 0;i<this.pieces.length;i++){
		if(this.pieces[i].y + 1 > 19){
			return false;
		}
		if((this.board[this.pieces[i].y + 1][this.pieces[i].x] == 1 && 
		    !this.isInBlock(this.pieces[i].y + 1, this.pieces[i].x))){
			return false;
		}
	}
	return true;
}
	
	moveLeft(){
		if(this.canMoveLeft()){ 
			this.x -=1;
			this.remove();
			for(var i = 0;i<this.pieces.length;i++){
				this.pieces[i].moveLeft();
			}
			this.project()
		}
		else{
			console.log("bump");
		}
	}
	
	moveRight(){
		if(this.canMoveRight()){
			this.x +=1;
			this.remove();
			for(var i = 0;i<this.pieces.length;i++){
				this.pieces[i].moveRight();
			}
			this.project()
		}
		else{
			console.log("bump");
		}
	}
	
	moveDown(){
		if(this.canMoveDown()){
			this.y += 1;
			this.remove();
			for(var i = 0;i<this.pieces.length;i++){
				this.pieces[i].moveDown();
			}
			this.project();
		}
		else{
			console.log("bump");
		}
	}
}

class oPiece extends Piece{
	constructor(myBoard,x,y){
		super(myBoard,x,y);
		this.pieces = [new pieceTile(myBoard,x,y), 
					new pieceTile(myBoard,x+1,y), 
					new pieceTile(myBoard,x,y-1),
					new pieceTile(myBoard,x+1,y-1)]
	}
}

class tPiece extends Piece{
	constructor(myBoard,x,y){
		super(myBoard,x,y);
		this.state = 0;
		this.pieces = [new pieceTile(myBoard,x,y), 
					new pieceTile(myBoard,x+1,y), 
					new pieceTile(myBoard,x,y-1),
					new pieceTile(myBoard,x-1,y)];
	}
	
	flipA(){
		this.remove();
		for(var i = 0;i<this.pieces.length;i++){
			let tX = this.x-this.pieces[i].x;
			let tY = this.y-this.pieces[i].y;
			if(tX !=0){
				tY = tX;
				tX = 0;
			}
			else{
				tX = tY;
				tY = 0;
			}
			this.pieces[i].x = x-tX;
			this.pieces[i].y = y-tY;
		}
		this.project();
	}

	flipB(){
		this.remove();
		for(var i = 0;i<this.pieces.length;i++){
			let tX = this.x-this.pieces[i].x;
			let tY = this.y-this.pieces[i].y;
			if(tX !=0){
				tY = -tX;
				tX = 0;
			}
			else{
				tX = -tY;
				tY = 0;
			}
			this.pieces[i].x = this.x-tX;
			this.pieces[i].y = this.y-tY;
		}
		this.project();
	}
}

class zPiece extends Piece{
	constructor(myBoard,x,y){
		super(myBoard,x,y);
		this.pieces = [new pieceTile(myBoard,x,y), 
					new pieceTile(myBoard,x+1,y), 
					new pieceTile(myBoard,x,y-1),
					new pieceTile(myBoard,x-1,y-1)];
	}
}

class sPiece extends Piece{
	constructor(myBoard,x,y){
		super(myBoard,x,y);
		this.pieces = [new pieceTile(myBoard,x,y), 
					new pieceTile(myBoard,x+1,y-1), 
					new pieceTile(myBoard,x,y-1),
					new pieceTile(myBoard,x-1,y)];
	}
}

class lPiece extends Piece{
	constructor(myBoard,x,y){
		super(myBoard,x,y);
		this.state = 0;
		this.pieces = [new pieceTile(myBoard,x,y), 
					new pieceTile(myBoard,x-1,y), 
					new pieceTile(myBoard,x+1,y),
					new pieceTile(myBoard,x+1,y-1)];
	}
}

class jPiece extends Piece{
	constructor(myBoard,x,y){
		super(myBoard,x,y);
		this.pieces = [new pieceTile(myBoard,x,y), 
					new pieceTile(myBoard,x-1,y), 
					new pieceTile(myBoard,x+1,y),
					new pieceTile(myBoard,x-1,y-1)];
	}
}

class iPiece extends Piece{
	constructor(myBoard,x,y){
		super(myBoard,x,y);
		this.pieces = [new pieceTile(myBoard,x,y), 
					new pieceTile(myBoard,x-1,y), 
					new pieceTile(myBoard,x+1,y),
					new pieceTile(myBoard,x+2,y)];
	}
}


displayToCanvas(board);

let currentPiece = new tPiece(board, 4, 1); // Start with an O piece

function handleKeyDown(event) {
	if (event.key === "ArrowLeft") {
		currentPiece.moveLeft(); // Move piece left
	} else if (event.key === "ArrowRight") {
		currentPiece.moveRight(); // Move piece right
	} else if (event.key === "ArrowDown") {
		currentPiece.moveDown();
	} else if (event.key === "x") {
		currentPiece.flipA();
	} else if (event.key === "z") {
		currentPiece.flipB();
	}

	displayToCanvas(board); // Redraw the board after the move
}

// Add event listener for keydown
window.addEventListener("keydown", handleKeyDown);



function gameLoop() {
	// Try to move down
	if (currentPiece.canMoveDown()) {
		currentPiece.moveDown();
	} else {
		// Lock the piece in place (it's already projected on the board)
		// Check for cleared lines
		for (let row = 0; row < board.length; row++) {
			if (isCleared(board, 20 - row)) {
				lineClear(board, 20 - row);
			}
		}
		// Spawn a new piece (you can randomize this later)
		// let rand = Math.floor(Math.random() * (7 - 1 + 1)) + 1;
		let rand = 2;
		switch(rand){
			case(1):currentPiece = new oPiece(board, 4, 1);break;
			case(2):currentPiece = new tPiece(board, 4, 1);break;
			case(3):currentPiece = new sPiece(board, 4, 1);break;
			case(4):currentPiece = new zPiece(board, 4, 1);break;
			case(5):currentPiece = new lPiece(board, 4, 1);break;
			case(6):currentPiece = new jPiece(board, 4, 1);break;
			case(7):currentPiece = new iPiece(board, 4, 1);break;
		}
		
	}
	displayToCanvas(board);
}

// Run the loop every 500ms (or faster for more difficulty)
setInterval(gameLoop, 500);



							