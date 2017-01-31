
	var currentPos = 0,
		scoreTable = document.querySelector('#score'),
		canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		canWidth = canvas.clientWidth,
		canHeight = canvas.clientHeight,
		rectsWidth = 20,
		rectsHeight = 20,
		rectsArr = [],
		currentScore = 0,
		maxRectCount = 8,
		gameState = false,
		score = 0,
		rectSpawnInterval,
		spawn;

	document.getElementById('start').addEventListener('click',startGame,true);
	document.getElementById('stop').addEventListener('click',stopGame,true);
	canvas.addEventListener('mousedown',onCanvаsClick,true);
	spawn = setInterval(spawnRects,rectSpawnInterval);

	function startGame() {
		score = 0;
		renderScore();
		gameState = true;
	}

	function stopGame() {
		gameState = false;
		ctx.clearRect(0, 0, canWidth, canHeight);
		score = 0;
		rectsArr = [];
	}

	function renderScore() {
		scoreTable.innerHTML = score;
	}

	function addScore() {
		score++;
		renderScore();
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
			var currentRect = rectsArr[i],
			    rectX = currentRect.posX,
				rectY = currentRect.posY - currentRect.fallSpeed*2, 
				width = currentRect.width,
				height = currentRect.height,
				mouseX = coords.x,
				mouseY = coords.y;
			if (mouseX < rectX + width && mouseX > rectX && mouseY < rectY + height && mouseY > rectY){
				rectsArr.splice(i,1);
				addScore();
				ctx.clearRect(rectX,rectY,width, height+currentRect.fallSpeed*2)
			}
		}
	}

	function spawnRects() {
		if (!gameState) {
			return;
		}
		if (rectsArr.length >= maxRectCount) {
			return;
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
			return;
		}
		for (var i = 0; i < rectsArr.length; i++) {
			var rect = rectsArr[i];
			ctx.clearRect(rect.posX, rect.posY, rect.width, rect.height); 
			rect.posY += rect.fallSpeed;
			ctx.fillStyle = rect.color;
			ctx.fillRect(rect.posX, rect.posY, rect.width, rect.height);
			ctx.fill();
			rectSpawnInterval = getRandomInt(20, 800);
			if(rect.posY >= canHeight) {
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

