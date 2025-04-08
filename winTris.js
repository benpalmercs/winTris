const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let x = 0;
let y = 300;
let w = 30;
let h = 30;
const button = document.getElementById('myButton1');
const button2 = document.getElementById('myButton2')

ctx.fillStyle = "red"; // Set fill color
ctx.fillRect(x, y, w, h); // Filled rectangle
function blockdown(){
	ctx.clearRect(0, 0, canvas.width, canvas.height); 
  y+=1;
  ctx.fillRect(x,y,w,h);
}
