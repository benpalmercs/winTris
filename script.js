

//Canvases
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const nextCanvases = [
    document.getElementById("next1").getContext("2d"),
    document.getElementById("next2").getContext("2d"),
    document.getElementById("next3").getContext("2d"),
    document.getElementById("next4").getContext("2d"),
    document.getElementById("next5").getContext("2d")
];
const holdCanvas = document.getElementById("holdBox").getContext("2d");


//Text
const lineCountDisplay = document.getElementById("lineCount");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");




//Values
let lines = 0;
let level = 0;
let score = 0;
// let levelSpeeds = new Map([[0, 48],[1, 43],[2, 38],[3, 33],[4, 28],[5, 23],[6, 18],[7, 13],[8, 8],[9, 6],[10,5],[13,4][16,3][19,2][29,1]]);


//Colorboards
const colorBoard = Array.from({ length: 20 }, () => Array(10).fill(null));
let nextColorBoards = [];
for (let i = 0; i < 5; i++) {
  // 4x4 board filled with 0 (no color)
  let colorB = Array.from({ length: 2 }, () =>
    Array(4).fill(null)
  );
  nextColorBoards.push(colorB);
}
let holdColorBoard = Array.from({length: 2}, () => Array(4).fill(null));


//Board Arrays
let board = Array.from({ length: 20 }, () => Array(10).fill(0));
let nextBoxes = Array.from({ length: 5 }, () =>
    Array.from({ length: 2 }, () => Array(4).fill(0))
);
let holdBox = Array.from({length: 2}, () => Array(4).fill(0));


//Miscallaneous Standard Variables
let holdUsed = false;
let heldPiece = null;
let nextPieces = [null,null,null,null,null];




//Displaying to Canvases
function displayToCanvas(board, colorBoard, ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    const cellSize = 30; // or whatever size you're using


    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x]) {
                ctx.fillStyle = colorBoard?.[y]?.[x] ?? "#999";
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                ctx.strokeStyle = "#000";
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}




function lineClear(board,row){
    let rowU = 20-row;
    for(var y = rowU;y>0;y--){
        for(var x = 0;x<board[rowU].length;x++){
            board[y][x]=board[y-1][x];
            colorBoard[y][x]=colorBoard[y-1][x];
        }
    }
    for(var x = 0;x<board[0].length;x++){
        board[0][x] = 0;
        colorBoard[0][x] = null;
    }
    lines++;
    lineCountDisplay.textContent = "Lines: " +lines;
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


//Code for Individual tiles on boards
class pieceTile {
    constructor(myBoard,x,y,colorBoard,color){
        this.y = y;
        this.x = x;
        this.board = myBoard;
        this.color = color;
        this.colorBoard = colorBoard;
        myBoard[this.y][this.x] = 1;
        colorBoard[this.y][this.x] = this.color;
    }
    project(){
        this.board[this.y][this.x] = 1;
        this.colorBoard[this.y][this.x] = this.color;
    }
    remove(){
        this.board[this.y][this.x] = 0;
        this.colorBoard[this.y][this.x] = null;
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


//Piece class holds tiles and transforms them
class Piece {
    constructor(myBoard,x,y,colorBoard,color){
        this.board = myBoard;
        this.x = x;
        this.y = y;
        this.colorBoard = colorBoard;
        this.color = color;
        this.pieces = [];
        this.locked = false;
        this.id = 0;
        this.project();
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
        if(this.canMoveLeft() && !this.locked){
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
        if(this.canMoveRight() && !this.locked){
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
        this.locked = true;
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
        if(this.canFlip(d) && !this.locked){
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


//Pieces each with unique organization of tiles
class oPiece extends Piece{
    constructor(myBoard,x,y,colorBoard){
        super(myBoard,x,y,colorBoard,"#e0e036");
        this.pieces = [new pieceTile(myBoard,x,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x+1,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x,y-1,this.colorBoard,this.color),
                    new pieceTile(myBoard,x+1,y-1,this.colorBoard,this.color)];
        this.id = 1;
       
    }
    flip(i){
    }
}


class tPiece extends Piece{
    constructor(myBoard,x,y,colorBoard){
        super(myBoard,x,y,colorBoard,"#b036e0");
        this.state = 0;
        this.pieces = [new pieceTile(myBoard,x,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x+1,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x,y-1,this.colorBoard,this.color),
                    new pieceTile(myBoard,x-1,y,this.colorBoard,this.color)];
        this.id=2;
    }
}
   
class zPiece extends Piece{
    constructor(myBoard,x,y,colorBoard){
        super(myBoard,x,y,colorBoard,"#e03e36");
        this.pieces = [new pieceTile(myBoard,x,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x+1,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x,y-1,this.colorBoard,this.color),
                    new pieceTile(myBoard,x-1,y-1,this.colorBoard,this.color)];
        this.id = 4;
    }
}


class sPiece extends Piece{
    constructor(myBoard,x,y,colorBoard){
        super(myBoard,x,y,colorBoard,"#36e04f");
        this.pieces = [new pieceTile(myBoard,x,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x+1,y-1,this.colorBoard,this.color),
                    new pieceTile(myBoard,x,y-1,this.colorBoard,this.color),
                    new pieceTile(myBoard,x-1,y,this.colorBoard,this.color)];
        this.id = 3;
    }
}


class lPiece extends Piece{
    constructor(myBoard,x,y,colorBoard){
        super(myBoard,x,y,colorBoard,"#e0a236");
        this.state = 0;
        this.pieces = [new pieceTile(myBoard,x,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x-1,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x+1,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x+1,y-1,this.colorBoard,this.color)];
        this.id = 5;
    }
}


class jPiece extends Piece{
    constructor(myBoard,x,y,colorBoard){
        super(myBoard,x,y,colorBoard,"#5836e0");
        this.pieces = [new pieceTile(myBoard,x,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x-1,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x+1,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x-1,y-1,this.colorBoard,this.color)];
        this.id = 6;
    }
}


class iPiece extends Piece{
    constructor(myBoard,x,y,colorBoard){
        super(myBoard,x,y,colorBoard,"#36e0de");
        this.x += 0.5;
        this.y += 0.5;
        this.pieces = [new pieceTile(myBoard,x,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x-1,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x+1,y,this.colorBoard,this.color),
                    new pieceTile(myBoard,x+2,y,this.colorBoard,this.color)];
        this.id = 7;
    }  
}


//Holds next pieces
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


//Generates a piece based on a number 1-7
function generatePiece(myBoard,x,y,colorBoard,rand){


        switch(rand){
            case(1):return new oPiece(myBoard, x, y, colorBoard);break;
            case(2):return new tPiece(myBoard, x, y, colorBoard);break;
            case(3):return new sPiece(myBoard, x, y, colorBoard);break;
            case(4):return new zPiece(myBoard, x, y, colorBoard);break;
            case(5):return new lPiece(myBoard, x, y, colorBoard);break;
            case(6):return new jPiece(myBoard, x, y, colorBoard);break;
            case(7):return new iPiece(myBoard, x, y, colorBoard);break;
        }
}


function renderNextPieces() {
    for (let i = 0; i < 5; i++) {
        // Clear each board and color board
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 4; x++) {
                nextBoxes[i][y][x] = 0;
                nextColorBoards[i][y][x] = null;
            }
        }
        // Create new piece on its board (centered)
        generatePiece(nextBoxes[i], 1, 1, nextColorBoards[i], queue.next[i]);
        // Display to canvas
        displayToCanvas(nextBoxes[i], nextColorBoards[i], nextCanvases[i]);
    }
}




function holdPiece() {
    if (holdUsed) return; // Prevent multiple holds in one turn


    // Clear hold box
    for (let y = 0; y < 2; y++) {
        for (let x = 0; x < 4; x++) {
            holdBox[y][x] = 0;
            holdColorBoard[y][x] = null;
        }
    }


    currentPiece.remove(); // Remove from main board


    if (!heldPiece) {
        // First time holding
        heldPiece = generatePiece(holdBox, 1, 1, holdColorBoard, currentPiece.id);
        currentPiece = generatePiece(board, 4, 1, colorBoard, queue.next[0]);
        queue.increment();
        renderNextPieces();
    } else {
        let tempId = currentPiece.id;
        currentPiece = generatePiece(board, 4, 1, colorBoard, heldPiece.id);
        heldPiece = generatePiece(holdBox, 1, 1, holdColorBoard, tempId);
    }


    holdUsed = true;


    displayToCanvas(holdBox, holdColorBoard, holdCanvas);
}




function moveKey(key) {
    if (key === "ArrowLeft") {
        currentPiece.moveLeft();
    } else if (key === "ArrowRight") {
        currentPiece.moveRight();
    } else if (key === "ArrowDown") {
        currentPiece.moveDown();
    }


    displayToCanvas(board, colorBoard, ctx);
}










displayToCanvas(board,colorBoard,ctx);




// Creating board and piece
let queue = new nextQ();
queue.populate();


let currentPiece = generatePiece(board,4,1,colorBoard,queue.next[0]);
queue.increment();
renderNextPieces();


// DAS/ARR Stuff
let keyStates = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowDown: false,
};


let dasDelay = 100; // milliseconds
let arrInterval = 20;


let dasTimeouts = {};
let arrIntervals = {};




// Handling inputs for pieces
function handleKeyDown(event) {
    const key = event.key;


    if (!keyStates[key]) {
        keyStates[key] = true;


        if (key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowDown") {
            moveKey(key); // Do one immediate move
            dasTimeouts[key] = setTimeout(() => {
                arrIntervals[key] = setInterval(() => moveKey(key), arrInterval);
            }, dasDelay);
        }
    }


    if (key === "x" || key === "ArrowUp") {
        currentPiece.flip(1);
    } else if (key === "z") {
        currentPiece.flip(-1);
    } else if (event.code === "Space") {
        currentPiece.hardDrop();
    } else if (key ==="c") {
            holdPiece();
           
        }


    displayToCanvas(board, colorBoard,ctx);
}


function handleKeyUp(event) {
    const key = event.key;
    keyStates[key] = false;


    if (dasTimeouts[key]) {
        clearTimeout(dasTimeouts[key]);
        dasTimeouts[key] = null;
    }


    if (arrIntervals[key]) {
        clearInterval(arrIntervals[key]);
        arrIntervals[key] = null;
    }
}




// Add event listener for keydown
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);


let dropDelay = 48;
let topOut = false;
let gameCount = 1;
let lockDelay = 48;
let lockCount = 0;




// Game looop
function gameLoop() {
    if(!topOut){
        if (currentPiece.canMoveDown()) {
            if(gameCount%dropDelay === 0){
                currentPiece.moveDown();
            }
        }
        else {
            if(currentPiece.locked){
                //Line Clear Check
                let linesOnClear = 0;
                for (let row = 0; row < board.length; row++) {
                    if (isCleared(board, 20 - row)) {
                        lineClear(board, 20 - row);
                       
                        linesOnClear++;
                    }
                }
                switch(linesOnClear){
                    case(0):score+=0;break;
                    case(1):score+=(40*(level+1));break;
                    case(2):score+=(100*(level+1));break;
                    case(3):score+=(300*(level+1));break;
                    case(4):score+=(1200*(level+1));break;
                }
                level = Math.floor(lines/10);
                dropDelay = 48-5*(level);
                if(dropDelay<3){
                    dropDelay=3;
                }
                scoreDisplay.textContent = "Score: " +score;
                levelDisplay.textContent = "Level: " +level;
                //Check for top out
                if(currentPiece.y === 1){
                    topOut = true;
                }
                //Create new Piece
                currentPiece = generatePiece(board,4,1,colorBoard,queue.next[0]);
                holdUsed = false;
                gameCount = 1;
                queue.increment();
                renderNextPieces();
                lockCount = 0;
            }
            lockCount++;
            if(lockCount === lockDelay){
                currentPiece.locked = true;
            }
        }
        gameCount++;
    }
    displayToCanvas(board,colorBoard,ctx);
   
}
// Running game ata bout 60 fps
setInterval(gameLoop, 17);          




