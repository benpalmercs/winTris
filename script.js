

const cellSize = 30; // Size of each cell in pixels
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const nextCanvas = document.getElementById("nextBox");
const nextCtx = nextCanvas.getContext("2d");

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

let nextBox = [[0,0,0,0],
							[0,0,0,0],
							[0,0,0,0],
							[0,0,0,0]]





function displayToCanvas(board,canvas) {
	canvas.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawing

	for (let y = 0; y < board.length; y++) {
		for (let x = 0; x < board[y].length; x++) {
			// Draw the background
			canvas.fillStyle = board[y][x] === 1 ? "#007bff" : "#ffffff"; // Color for filled or empty
			canvas.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

			// Draw grid lines (optional)
			canvas.strokeStyle = "#000000"; // Grid line color
			canvas.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
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
	
	hardDrop(){
		while(this.canMoveDown()){
			this.moveDown();
		}
	}
	
	canFlip(d){
		for(var i = 0;i<this.pieces.length;i++){
				let tX = this.x-this.pieces[i].x;
				let tY = this.y-this.pieces[i].y;
				let newX,newY = 0;
				newX= (tX*0)+tY*d;
				newY = (tX*-d)+tY*0;
				if(this.board[this.y+newY][this.x+newX]===undefined || 
					(this.board[this.y+newY][this.x+newX] === 1 && 
					!this.isInBlock(this.y+newY,this.x+newX))){
					return false;
				}
		}
		return true;
	}
	
	flip(d){
		if(this.canFlip(d)){
			for(var i = 0;i<this.pieces.length;i++){
				this.remove();
				let tX = this.x-this.pieces[i].x;
				let tY = this.y-this.pieces[i].y;
				let newX,newY = 0;
				newX= (tX*0)+(tY*d);
				newY = (tX*-d)+(tY*0);
				this.pieces[i].x = this.x+newX;
				this.pieces[i].y = this.y+newY;
				this.project();
			}
		}
		else{console.log("bump");}
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
	flip(i){
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

class nextQ{
	constructor(){
		this.next = [0,0,0,0,0,0];
	}
	populate(){
		for(var i = 0; i<this.next.length;i++){
			this.next[i] = Math.floor(Math.random() * (7 - 1 + 1)) + 1;
		}
	}
	increment(){
		for(var i = 0; i<5;i++){
			this.next[i] = this.next[i+1];
		}
		this.next[4] = Math.floor(Math.random() * (7 - 1 + 1)) + 1;
	}
	
}

function generatePiece(myBoard,x,y,rand){

		switch(rand){
			case(1):return new oPiece(myBoard, x, y);break;
			case(2):return new tPiece(myBoard, x, y);break;
			case(3):return new sPiece(myBoard, x, y);break;
			case(4):return new zPiece(myBoard, x, y);break;
			case(5):return new lPiece(myBoard, x, y);break;
			case(6):return new jPiece(myBoard, x, y);break;
			case(7):return new iPiece(myBoard, x, y);break;
		}
}



displayToCanvas(board,ctx);

// Creating baord and piece
let queue = new nextQ();
queue.populate();
let currentPiece = generatePiece(board,4,1,queue.next[0])
let nextPiece = generatePiece(nextBox,1,1,queue.next[1]);

// Handling inputs for pieces
function handleKeyDown(event) {
	if (event.key === "ArrowLeft") {
		currentPiece.moveLeft(); // Move piece left
	} else if (event.key === "ArrowRight") {
		currentPiece.moveRight(); // Move piece right
	} else if (event.key === "ArrowDown") {
		currentPiece.moveDown();
	} else if (event.key === "x" || event.key === "ArrowUp") {
		currentPiece.flip(1);
	} else if (event.key === "z") {
		currentPiece.flip(-1);
	} else if (event.code === "Space"){
		currentPiece.hardDrop();
		console.log("big drop");
	}

	displayToCanvas(board,ctx); // Redraw the board after the move
}

// Add event listener for keydown
window.addEventListener("keydown", handleKeyDown);


// Game looop
function gameLoop() {

	if (currentPiece.canMoveDown()) {
		currentPiece.moveDown();
	} else {

		for (let row = 0; row < board.length; row++) {
			if (isCleared(board, 20 - row)) {
				lineClear(board, 20 - row);
			}
		}
		if(currentPiece.y === 1){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			return;
		}
		queue.increment();
		currentPiece = generatePiece(board,4,1,queue.next[0]);
		nextPiece.remove();
		nextPiece = generatePiece(nextBox,1,1,queue.next[1]);
		nextBox.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
		
		
		
	}
	displayToCanvas(board,ctx);
	displayToCanvas(nextBox,nextCtx);
}

// Run the loop every 500ms (or faster for more difficulty)
setInterval(gameLoop, 200);	
