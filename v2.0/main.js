
var currentPos = 0,
  canvas = document.getElementById('canvas'),
  scoreTable = document.getElementById('score'),
  difficultyEl = document.getElementById('difficulty'),
  ctx = canvas.getContext('2d'),
  canWidth = canvas.clientWidth,
  canHeight = canvas.clientHeight,
  rectsWidth = 20,
  rectsHeight = 20,
  rectsArr = [],
  maxRectCount = 4,
  gameState = false,
  catchSignal = new Audio('catch.wav'),
  lossSignal = new Audio('gameover.wav'),
  score = 0,
  difficulty = '[-KID-]',
  rectSpawnInterval = 1000,
  scoreIncrement = 10,
  spawn;

document.querySelector('#start').addEventListener('click',startGame,true);
document.querySelector('#stop').addEventListener('click',stopGame,true);
canvas.addEventListener('mousedown',onCanvаsClick,true);
spawn = setInterval(spawnRects,rectSpawnInterval);

var levels = {
  "0":{
    difficult: '[-KID-]',
    maxRectCount:5,
    rectSpawnInterval:1500
  },
  "100":{
    difficult: '[-EASY-]',
    maxRectCount:10,
    rectSpawnInterval:1000
  },
  "200":{
    difficult: '[-MEDIUM-]',
    maxRectCount:15,
    rectSpawnInterval: 750
  },
  "300":{
    difficult: '[-HARD-]',
    maxRectCount:25,
    rectSpawnInterval: 500
  }
}

function startGame() {
  score = 0;
  changeLevel();
  renderScore();
  renderDifficulty();
  gameState = true;
}

function stopGame() {
  gameState = false;
  ctx.clearRect(0, 0, canWidth, canHeight);
  score = 0;
  rectsArr =[];
}

function renderScore() {
  scoreTable.innerHTML = score;
}

function renderDifficulty() {
  difficultyEl.innerHTML = difficulty;
}

function addScore() {
  score+=scoreIncrement;
  renderScore();
  changeLevel();
}

function changeLevel() {
  if (levels[score]) {
    maxRectCount = levels[score].maxRectCount;
    rectSpawnInterval = levels[score].rectSpawnInterval;
    difficulty = levels[score].difficult;
    clearInterval(spawn);
    spawn = setInterval(spawnRects,rectSpawnInterval);
    renderDifficulty();
  }
}

function removeScore() {
  score-=scoreIncrement;
  renderScore();
  if (score<=0) {
    lossSignal.play();
    stopGame();
  }
}

function onCanvаsClick(evt) {
  var e = evt.target;
    var dim = e.getBoundingClientRect();
    var x = evt.clientX - dim.left;
    var y = evt.clientY - dim.top;
  var clickCoords = {
    x: x,
    y: y
  }
  collisionDetect(clickCoords);
}

function collisionDetect(coords) {
  for (var i = 0; i < rectsArr.length; i++) {
    currentRect = rectsArr[i];
    var rectX = currentRect.posX,
      rectY = currentRect.posY - currentRect.fallSpeed*2, 
      width = currentRect.width,
      height = currentRect.height,
      mouseX = coords.x,
      mouseY = coords.y;
    if (mouseX < rectX + width && mouseX > rectX && mouseY < rectY + height && mouseY > rectY){
      rectsArr.splice(i,1)
      catchSignal.play();
      addScore();
      ctx.clearRect(rectX,rectY,width, height+currentRect.fallSpeed*2)
    }
  }
}

function spawnRects() {
  if (!gameState) {
    return
  }
  if (rectsArr.length >= maxRectCount) {
    return
  }
  var rect = createRect();
  rectsArr.push(rect);
}

function createRect() {
  var newRect =  new Rectangle(
      getRandomInt(0,canWidth-rectsWidth),
      0,
      getRandomInt(1,3),
      rectsWidth,
      rectsHeight,
      getRandomColor()
    )
  return newRect;
}

function rectDrawDrop (){
  if (!gameState) {
    return
  }
  for (var i = 0; i < rectsArr.length; i++) {
    var rect = rectsArr[i];
    ctx.clearRect(rect.posX, rect.posY, rect.width, rect.height); 
    rect.posY += rect.fallSpeed;
    ctx.fillStyle=rect.color;
    ctx.fill();
    ctx.fillRect(rect.posX, rect.posY, rect.width, rect.height);
    if(rect.posY >= canHeight) {
      removeScore();
      rectsArr.splice(i,1);
    }
  }
}

function Rectangle(posX, posY, fallSpeed, width, height, color){
  this.posX = posX;
  this.posY = posY;
  this.fallSpeed = fallSpeed;
  this.width = width;
  this.height = height;
  this.color = color;
}  

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';

    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
  return color;
}

function animate() {  
  rectDrawDrop();
  requestAnimationFrame(animate);
}

document.body.onload = animate;
