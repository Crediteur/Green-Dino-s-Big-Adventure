var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting = false;
var isJumping = false; //isFalling
var jump_y = 0;
var jumpHeight =  3; //lower to increase height
var isSit = false;
var sitCount = 0;

var Cspeed = 0.5;
var lastDir = 1; //lastdirection of chara, 0 = left, 1 = right;

var clouds;
var mountains;
var trees_x;
var collectables;

//game mechanics
var flagpole;
var game_score;
var lives;
var gameComplete;

//variables for background art
var numStars = 100; //number of stars to draw
var stars = [];
var bRed, bGreen, bBlue;
var sGreen,sBlue, sRed;
var sun_x, sun_y, sunAlpha;

//sound variables
var bgm;
var bgmLoop = false;
var jumpSound, ouchSound, coinSound, victorySound;
var victorySoundplay = false;
var waterSound;
var inWater = false;

function preload()
{
	//load soundfiles
	soundFormats('mp3','wav');
	bgm = loadSound('assets/adventure_music.mp3');
	bgm.setVolume(0.10);
	coinSound = loadSound('assets/pon_collect.wav');
	coinSound.setVolume(0.15);
	jumpSound = loadSound('assets/jump.wav');
	jumpSound.setVolume(0.1);
	ouchSound = loadSound('assets/ouch.mp3');
	ouchSound.setVolume(0.3);
	victorySound = loadSound('assets/victory.wav');
	victorySound.setVolume(0.2);
	waterSound = loadSound('assets/water.mp3');
	waterSound.setVolume(0.2);

	//load pictures
	sign = loadImage('assets/dinosign.png');
	cake = loadImage('assets/cakepic.png');
}

function setup()
{
	createCanvas(1024, 576);
	sun_x = -200;
	sun_y = 600;
	sunAlpha = 50;

	floorPos_y = height * 3/4;
	platforms = [{x_pos: 2220, y_pos: floorPos_y-65, width: 140, speed: 0},
				{x_pos: 2510, y_pos: floorPos_y-130, width: 160, speed: 0},
				{x_pos: 2850, y_pos: floorPos_y-150, width: 140, speed: 0.9}, //three moving platforms
				{x_pos: 3150, y_pos: floorPos_y-150, width: 140, speed: -0.9},
				{x_pos: 3450, y_pos: floorPos_y-150, width: 140, speed: 0.9},
				{x_pos: -850, y_pos: 150, width: 80, speed: 0.8},
				{x_pos: -1780, y_pos: 140, width: 900, speed: 0}]; //platform for three coins	

	collectables = [
		{x_pos: -1750, y_pos: 70, size: 1, speed: 0, isFound: false}, //286 is middle floating point
		{x_pos: -1600, y_pos: 70, size: 1, speed: 0, isFound: false},
		{x_pos: -1450, y_pos: 70, size: 1, speed: 0, isFound: false}, //three coins on platform
		{x_pos: 58, y_pos: 286, size: 1, speed: 0.5, isFound: false},
		{x_pos: 858, y_pos: 286, size: 1, speed: 0, isFound: false}, //starting coin
		{x_pos: 2135, y_pos: 270, size: 1, speed: 0, isFound: false},
		{x_pos: 2420, y_pos: 286, size: 1, speed: 1, type: "ocean", isFound: false}, //ocean coin
		{x_pos: 2745, y_pos: 286, size: 1, speed: -2, type: "ocean", isFound: false}, 
		{x_pos: 3055, y_pos: 286, size: 1, speed: 3, type: "ocean", isFound: false},
		{x_pos: 3345, y_pos: 160, size: 1, speed: 0, type: "ocean", isFound: false},
		{x_pos: 3700, y_pos: 50, size: 1, speed: 0, type: "ocean", isFound: false},  
		{x_pos: 4600, y_pos: 286, size: 1, speed: 0.5, isFound: false},
		{x_pos: 4750, y_pos: 286, size: 1, speed: -0.5, isFound: false},
	];
	//background shift colour
	bRed = 40;
	bGreen = 40;
	bBlue = 140;
	sRed = bRed;
	sGreen = bGreen;
	sBlue = bBlue;

	game_score = 0;
	lives = 3;
	gameComplete = false;
	startGame();
}

function startGame(){
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	isJumping = false;

	// Initialise arrays of scenery objects.
	trees_x = [-1900, -1300, -300, 200, 3800, 980, 1500, 1890, 4500];
	treePos_y = height/2+10; //tree y position
	
	clouds = [{x_pos: -650,y_pos: 150,size: 150,colour:color(random(0,255),random(0,255),random(0,255))},
			 {x_pos: 150,y_pos: 150,size: 70,colour:color(random(0,255),random(0,255),random(0,255))},
			 {x_pos: -1400,y_pos: 100,size: 50,colour:color(random(0,255),random(0,255),random(0,255))},
			 {x_pos: 850,y_pos: 250,size: 30,colour:color(random(0,255),random(0,255),random(0,255))},
			 {x_pos: 2850,y_pos: 120,size: 130,colour:color(random(0,255),random(0,255),random(0,255))},
			 {x_pos: 3850,y_pos: 210,size: 40,colour:color(random(0,255),random(0,255),random(0,255))},
			 {x_pos: -2250,y_pos: 20,size: 80,colour:color(random(0,255),random(0,255),random(0,255))},
			 {x_pos: 2350,y_pos: 35,size: 65,colour:color(random(0,255),random(0,255),random(0,255))},
			 {x_pos: 4450,y_pos: 50,size: 115,colour:color(random(0,255),random(0,255),random(0,255))},
			 {x_pos: 1450,y_pos: 150,size: 270,colour:color(random(0,255),random(0,255),random(0,255))}];

	mountains = [{x_pos: -800, y_pos: 150,size: 20},
				{x_pos: 4100, y_pos: 200,size: 5},
				{x_pos: 400, y_pos: 270,size: 1}];

	canyons = [{x_pos: 800, width: 150},
		      {x_pos: 2100, width: 1650},
			  {x_pos: -2100, width: -1600}];
	
	flagpole = {x_pos: 4900, y_pos: floorPos_y-100, isReached: false};

	for (let i = 0; i<numStars; i++){
		stars[i] = {x_pos: random(width), y_pos:random(floorPos_y)};
	}
	
	//background music 
	if(bgmLoop == false){
		bgm.loop();
		bgmLoop = true;
	}
}

function draw()
{
	background(bRed,bGreen,bBlue); // fill the sky blue
	bRed += random(-0.13,0.1);
	bGreen += random(-0.13,0.1);
	bBlue += random(-0.19,0.1);
	
	for (i = 0; i<numStars; i++){ //stars
		fill(sRed,sGreen,sBlue);
		ellipse(stars[i].x_pos,stars[i].y_pos,random(0,2));
	}
	sRed += random(-0.1,0.2);
	sGreen += random(-0.1,0.2);
	sBlue += random(-0.1,0.2);
	
	drawSun();

	push();
	translate(scrollPos, 0);
	//western sign
	image(sign,-2080,floorPos_y-145,150,150);
	pop();

	noStroke();
	fill(10,160,150);
	rect(0, floorPos_y, width, height/4); // draw some green ground
	fill(10,60,90);
	rect(0, floorPos_y, width, height/18);

	push();
	translate(scrollPos, 0);
		// Draw clouds.
		drawClouds();
		// Draw mountains.
		drawMountains();
		// Draw trees.
		drawTrees();
		// Draw platforms
		for (let i = 0; i < platforms.length; i++){
			drawPlatform(platforms[i]);
		}
		// Draw canyons.
		for(let i = 0; i < canyons.length; i++){
			checkCanyon(canyons[i]);
			drawCanyon(canyons[i]);
		}
		// Draw collectable items.
		for(let i = 0; i < collectables.length; i++)
		{
			if(collectables[i].isFound == false){
				checkCollectable(collectables[i]);
				drawCollectable(collectables[i]);
			}
		}
		
		//flagpole
		renderFlagpole(flagpole);
			
		//other scenery, objects
		fill(220);
		textSize(10);
		text("press ↓ to sit",-2040,floorPos_y + 130)
	pop();

	// Draw game character.
	drawGameChar();
	
	push();
	translate(scrollPos, 0);
		fill(0,0,200,150);
		for(let i = 0; i < canyons.length; i++){
			rect(canyons[i].x_pos,floorPos_y,canyons[i].width,height)
		}
	pop();
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.3)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.5)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
	gameChar_y = constrain(gameChar_y,-30,height-1);

	charJump();

	//temp hardcode solution
	if(gameChar_y > floorPos_y || checkPlatform(platforms[0]) == true || checkPlatform(platforms[1]) == true|| checkPlatform(platforms[2]) == true||checkPlatform(platforms[3]) == true||checkPlatform(platforms[4]) == true||checkPlatform(platforms[5]) == true||checkPlatform(platforms[6]) == true){
		isFalling = false;
		isJumping = false;
	}
	else if(gameChar_y <= floorPos_y){
		gameChar_y += 2;
		isFalling = true;
		inWater = false;
		isPlummeting = false;
	}
	else{
		gameChar_y = floorPos_y;
		isFalling = false;
		isPlummeting = false;
	}
	
	// Update real position of gameChar for collision detection.
	if (gameChar_world_x < -2000 || gameChar_world_x > 6000){
		gameChar_x = constrain(gameChar_x,310, 450);
	}
	gameChar_world_x = gameChar_x - scrollPos;

	//game score
	game_score = constrain(game_score,0,50000);
	textSize(20);
	fill(250);
	text("Score: "+ game_score, 20,40);

	//player lives
	checkPlayerDie();
	text("Lives", width-88,40);
	for(let i = 0; i < lives; i++){
		noStroke();
		fill(147, 227, 50);
		ellipse(width-30-i*35,65, 30,30);
		//stroke(90,20,30);
		fill(165, 0, 0);
		ellipse(width-30-i*35,65, 20,20);
	}

	//game complete
	fill(255);
	if (flagpole.isReached == true && lives > 0){
		gameComplete = true;
		textSize(25);
		text("Game Complete!", width/2-60, height/2);
		textSize(12);
		text("Press 'r' to play again", width/2-20, height/2+20);
	}

	//game over
	if (lives < 1 && gameComplete == false){
		textSize(25);
		text("Game Over",width/2-10,height/2);
		textSize(12);
		text("Press 'r' to try again", width/2, height/2+20);
	}

	//debugging true/false
	debug(true);
}

// ---------------------
// Key control functions
// ---------------------

//function written for character's jumpping mechanic
function charJump(){
	if (isJumping == true) {
		if (gameChar_y < floorPos_y+3){	
			//negative parabola formula for horizontal jump vector
			gameChar_y -= ((-1 * pow(jump_y, 2.1209) + 26) / jumpHeight);
			jump_y += 0.2;
		}
		//special jump in canyon
		else if (gameChar_y > floorPos_y+3)
		{
			gameChar_y -= 50;
		}
	}
}

function keyPressed(){

	//left arrow
	if (keyCode == 37) {
		isLeft = true;
		isSit = false;
	}
	//up arrow or spacebar
	if (keyCode == 38 || keyCode == 32) {
		if(!isFalling){
			isJumping = true;
			isSit = false;
			//gameChar_y -= 120; //failsafe
			jumpSound.play();
			jump_y = 0;
		}
	}
	//right arrow
	if (keyCode == 39) {
		isRight = true;
		isSit = false;
	}
	//down arrow
	if (keyCode == 40) {
		isSit = !isSit;
		sitCount ++;
		if(sitCount == 1){
			game_score += 10;
		}
		else if (sitCount %10 == 0){
			game_score += 10;
		}
	}
}

function keyReleased()
{

	if (keyCode == 37) {
		isLeft = false;
		lastDir = 0;
	}
	if (keyCode == 39) {
		isRight = false;
		lastDir = 1;
	}
	//when r is pressed, reset the objects 
	if (keyCode == 82) {
		game_score = 0;
		setup();
	}
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{
	//the game character
	if (isLeft && isJumping) {
		// add your jumping-left code
		noStroke();
		//crown
		fill(165, 0, 0);
		rect(gameChar_x + 16, gameChar_y - 49, 4, 10, 1);
		rect(gameChar_x + 16, gameChar_y - 36, 3, 8, 1);

		fill(147, 227, 50);
		//head & body
		rect(gameChar_x - 23, gameChar_y - 51, 39, 26, 1);
		rect(gameChar_x - 11, gameChar_y - 30, 21, 27, 1);
		//legs            2							3							4							1
		quad(gameChar_x + 10, gameChar_y - 6, gameChar_x + 10, gameChar_y + 1, gameChar_x + 7, gameChar_y + 1, gameChar_x + 1, gameChar_y - 6); //jump y-2
		quad(gameChar_x - 4, gameChar_y - 6, gameChar_x - 4, gameChar_y + 1, gameChar_x - 7, gameChar_y + 1, gameChar_x - 13, gameChar_y - 6);//x-2,
		//thigh
		rect(gameChar_x - 13, gameChar_y - 10, 4, 4);
		rect(gameChar_x - 12, gameChar_y - 11, 4, 4);

		//tail
		quad(gameChar_x + 16, gameChar_y - 11, gameChar_x + 16, gameChar_y - 10, gameChar_x + 9, gameChar_y - 6.5, gameChar_x + 9, gameChar_y - 11);

		//eyes
		fill(255);
		rect(gameChar_x - 2, gameChar_y - 43, 11, 11, 3);
		fill(0);
		rect(gameChar_x - 2, gameChar_y - 40, 4, 5, .5);
		//eyelid
		fill(147, 227, 50);
		rect(gameChar_x - 5, gameChar_y - 47, 15, 3.5);

		//stomach
		fill(255, 251, 130);
		rect(gameChar_x - 11, gameChar_y - 22, 15, 13);

		//nose
		fill(50);
		rect(gameChar_x - 10.5, gameChar_y - 42, 2.5, 2.5);
		rect(gameChar_x - 21.5, gameChar_y - 42, 2.5, 2.5);

	}
	else if (isRight && isJumping) {
		// add your jumping-right code
		noStroke();
		//crown
		fill(165, 0, 0);
		rect(gameChar_x - 19, gameChar_y - 49, 4, 10, 1);
		rect(gameChar_x - 18, gameChar_y - 36, 3, 8, 1);

		fill(147, 227, 50);

		//head & body
		rect(gameChar_x - 15, gameChar_y - 51, 39, 26, 1);
		rect(gameChar_x - 9, gameChar_y - 30, 21, 27, 1);

		//legs            2							3							4							1
		quad(gameChar_x - 9, gameChar_y - 6, gameChar_x - 9, gameChar_y + 1, gameChar_x - 6, gameChar_y + 1, gameChar_x, gameChar_y - 6); //jump y-2
		quad(gameChar_x + 5, gameChar_y - 6, gameChar_x + 6, gameChar_y + 1, gameChar_x + 9, gameChar_y + 1, gameChar_x + 14, gameChar_y - 6);// x+2, x pos+1
		rect(gameChar_x + 10, gameChar_y - 10, 4, 4);//thigh
		rect(gameChar_x + 9, gameChar_y - 11, 4, 4);

		//tail
		quad(gameChar_x - 15, gameChar_y - 11, gameChar_x - 15, gameChar_y - 10, gameChar_x - 9, gameChar_y - 6.5, gameChar_x - 9, gameChar_y - 11); //jump y-1

		//eyes
		fill(255);
		rect(gameChar_x - 8, gameChar_y - 43, 11, 11, 3);
		fill(0);
		rect(gameChar_x - 1, gameChar_y - 40, 4, 5, .5);
		//eyelid
		fill(147, 227, 50);
		rect(gameChar_x - 10, gameChar_y - 47, 15, 3.5);

		//stomach
		fill(255, 251, 130);
		rect(gameChar_x - 3, gameChar_y - 22, 15, 13);

		//nose
		fill(50);
		rect(gameChar_x + 9, gameChar_y - 42, 2.5, 2.5);
		rect(gameChar_x + 20, gameChar_y - 42, 2.5, 2.5);


	}
	else if (isLeft) {
		// add your walking left code
		noStroke();
		//crown
		fill(165, 0, 0);
		rect(gameChar_x + 16, gameChar_y - 49, 4, 10, 1);
		rect(gameChar_x + 16, gameChar_y - 36, 3, 8, 1);

		fill(147, 227, 50);
		//head & body
		rect(gameChar_x - 23, gameChar_y - 51, 39, 26, 1);
		rect(gameChar_x - 11, gameChar_y - 30, 21, 27, 1);
		if (frameCount % 10 == 0) {
			//legs            2							3							4							1
			quad(gameChar_x + 10, gameChar_y - 4, gameChar_x + 10, gameChar_y + 3, gameChar_x + 7, gameChar_y + 3, gameChar_x + 1, gameChar_y - 4);
			quad(gameChar_x - 2, gameChar_y - 4, gameChar_x - 8, gameChar_y + 3, gameChar_x - 11, gameChar_y + 3, gameChar_x - 11, gameChar_y - 4);
			//tail
			quad(gameChar_x + 16, gameChar_y - 10, gameChar_x + 16, gameChar_y - 9, gameChar_x + 9, gameChar_y - 5.5, gameChar_x + 9, gameChar_y - 10);
		}
		else {
			quad(gameChar_x + 10, gameChar_y - 8, gameChar_x + 14, gameChar_y + 1, gameChar_x + 11, gameChar_y + 2, gameChar_x + 1, gameChar_y - 4);//right leg
			quad(gameChar_x - 2, gameChar_y - 4, gameChar_x - 14, gameChar_y, gameChar_x - 16, gameChar_y - 2, gameChar_x - 11, gameChar_y - 9);//left leg
			//tail
			quad(gameChar_x + 16, gameChar_y - 11, gameChar_x + 16, gameChar_y - 10, gameChar_x + 9, gameChar_y - 6.5, gameChar_x + 9, gameChar_y - 11);
		}

		//eyes
		fill(255);
		rect(gameChar_x - 2, gameChar_y - 43, 11, 11, 3);
		fill(0);
		rect(gameChar_x - 2, gameChar_y - 40, 4, 5, .5);
		//eyelid
		fill(147, 227, 50);
		rect(gameChar_x - 5, gameChar_y - 45, 15, 3.5);

		//stomach
		fill(255, 251, 130);
		rect(gameChar_x - 11, gameChar_y - 22, 15, 13);

		//nose
		fill(50);
		rect(gameChar_x - 10.5, gameChar_y - 42, 2.5, 2.5);
		rect(gameChar_x - 21.5, gameChar_y - 42, 2.5, 2.5);

	}
	else if (isRight) {

		// add your walking right code
		noStroke();
		//crown
		fill(165, 0, 0);
		rect(gameChar_x - 19, gameChar_y - 49, 4, 10, 1);
		rect(gameChar_x - 18, gameChar_y - 36, 3, 8, 1);

		fill(147, 227, 50);
		//head & body
		rect(gameChar_x - 15, gameChar_y - 51, 39, 26, 1);
		rect(gameChar_x - 9, gameChar_y - 30, 21, 27, 1);
		if (frameCount % 10 == 0) {
			//legs            2							3							4							1
			quad(gameChar_x - 9, gameChar_y - 6, gameChar_x - 9, gameChar_y + 1, gameChar_x - 6, gameChar_y + 1, gameChar_x, gameChar_y - 6); //jump y-2
			quad(gameChar_x + 5, gameChar_y - 6, gameChar_x + 6, gameChar_y + 1, gameChar_x + 9, gameChar_y + 1, gameChar_x + 14, gameChar_y - 6);// x+2, x pos+1
			rect(gameChar_x + 10, gameChar_y - 10, 4, 4);//thigh
			rect(gameChar_x + 9, gameChar_y - 11, 4, 4);
			//tail
			quad(gameChar_x - 15, gameChar_y - 10, gameChar_x - 15, gameChar_y - 9, gameChar_x - 9, gameChar_y - 5.5, gameChar_x - 9, gameChar_y - 10);
		}
		else {
			//legs            2							3							4							1
			quad(gameChar_x - 9, gameChar_y - 4, gameChar_x - 6, gameChar_y, gameChar_x - 3, gameChar_y, gameChar_x + 1, gameChar_y - 4);//left leg
			quad(gameChar_x - 10, gameChar_y - 1, gameChar_x - 10, gameChar_y + 2, gameChar_x - 4, gameChar_y + 2.5, gameChar_x, gameChar_y - 4);
			quad(gameChar_x + 3, gameChar_y - 4, gameChar_x + 15, gameChar_y, gameChar_x + 17, gameChar_y - 2, gameChar_x + 12, gameChar_y - 9);//right leg
			//tail
			quad(gameChar_x - 15, gameChar_y - 11, gameChar_x - 15, gameChar_y - 10, gameChar_x - 9, gameChar_y - 6.5, gameChar_x - 9, gameChar_y - 11);
		}

		//eyes
		fill(255);
		rect(gameChar_x - 8, gameChar_y - 43, 11, 11, 3);
		fill(0);
		rect(gameChar_x - 1, gameChar_y - 40, 4, 5, .5);
		//eyelid
		fill(147, 227, 50);
		rect(gameChar_x - 10, gameChar_y - 45, 15, 3.5);

		//stomach
		fill(255, 251, 130);
		rect(gameChar_x - 3, gameChar_y - 22, 15, 13);

		//nose
		fill(50);
		rect(gameChar_x + 9, gameChar_y - 42, 2.5, 2.5);
		rect(gameChar_x + 20, gameChar_y - 42, 2.5, 2.5);

	}
	else if (isJumping || isPlummeting) {
		// add your jumping facing forwards code
		if (lastDir == 1) {
			noStroke();
			//crown
			fill(165, 0, 0);
			rect(gameChar_x - 19, gameChar_y - 49, 4, 10, 1);
			rect(gameChar_x - 18, gameChar_y - 36, 3, 8, 1);

			fill(147, 227, 50);

			//head & body
			rect(gameChar_x - 15, gameChar_y - 51, 39, 26, 1);
			rect(gameChar_x - 9, gameChar_y - 30, 21, 27, 1);

			//legs            2							3							4							1
			quad(gameChar_x - 9, gameChar_y - 6, gameChar_x - 9, gameChar_y + 1, gameChar_x - 6, gameChar_y + 1, gameChar_x, gameChar_y - 6); //jump y-2
			quad(gameChar_x + 5, gameChar_y - 6, gameChar_x + 6, gameChar_y + 1, gameChar_x + 9, gameChar_y + 1, gameChar_x + 14, gameChar_y - 6);// x+2, x pos+1
			//stroke(1);
			rect(gameChar_x + 10, gameChar_y - 10, 4, 4);//thigh
			rect(gameChar_x + 9, gameChar_y - 11, 4, 4);
			//tail
			quad(gameChar_x - 15, gameChar_y - 11, gameChar_x - 15, gameChar_y - 10, gameChar_x - 9, gameChar_y - 6.5, gameChar_x - 9, gameChar_y - 11); //jump y-1

			//eyes
			fill(255);
			rect(gameChar_x - 8, gameChar_y - 43, 11, 11, 3);
			fill(0);
			rect(gameChar_x - 4.5, gameChar_y - 43, 4, 5, .5); //eyes up

			//eyelid
			fill(147, 227, 50);
			rect(gameChar_x - 10, gameChar_y - 47, 15, 3.5);

			//stomach
			fill(255, 251, 130);
			rect(gameChar_x - 3, gameChar_y - 22, 15, 13);

			//nose
			fill(50);
			rect(gameChar_x + 9, gameChar_y - 42, 2.5, 2.5);
			rect(gameChar_x + 20, gameChar_y - 42, 2.5, 2.5);
		}
		else {
			noStroke();
			//crown
			fill(165, 0, 0);
			rect(gameChar_x + 16, gameChar_y - 49, 4, 10, 1);
			rect(gameChar_x + 16, gameChar_y - 36, 3, 8, 1);

			fill(147, 227, 50);
			//head & body
			rect(gameChar_x - 23, gameChar_y - 51, 39, 26, 1);
			rect(gameChar_x - 11, gameChar_y - 30, 21, 27, 1);
			//legs            2							3							4							1
			quad(gameChar_x + 10, gameChar_y - 6, gameChar_x + 10, gameChar_y + 1, gameChar_x + 7, gameChar_y + 1, gameChar_x + 1, gameChar_y - 6); //jump y-2
			quad(gameChar_x - 4, gameChar_y - 6, gameChar_x - 4, gameChar_y + 1, gameChar_x - 7, gameChar_y + 1, gameChar_x - 13, gameChar_y - 6);//x-2,
			//thigh
			rect(gameChar_x - 13, gameChar_y - 10, 4, 4);
			rect(gameChar_x - 12, gameChar_y - 11, 4, 4);

			//tail
			quad(gameChar_x + 16, gameChar_y - 11, gameChar_x + 16, gameChar_y - 10, gameChar_x + 9, gameChar_y - 6.5, gameChar_x + 9, gameChar_y - 11);

			//eyes
			fill(255);
			rect(gameChar_x - 2, gameChar_y - 43, 11, 11, 3);
			fill(0);
			rect(gameChar_x + 1.5, gameChar_y - 37, 4, 5, .5);
			//eyelid
			fill(147, 227, 50);
			rect(gameChar_x - 5, gameChar_y - 47, 15, 3.5);

			//stomach
			fill(255, 251, 130);
			rect(gameChar_x - 11, gameChar_y - 22, 15, 13);

			//nose
			fill(50);
			rect(gameChar_x - 10.5, gameChar_y - 42, 2.5, 2.5);
			rect(gameChar_x - 21.5, gameChar_y - 42, 2.5, 2.5);
		}
	}
	else if (isSit) {
		//sitting position
		noStroke();
		//crown
		fill(165, 0, 0);
		rect(gameChar_x - 19, gameChar_y - 43, 4, 10, 1);
		rect(gameChar_x - 18, gameChar_y - 30, 3, 8, 1);

		fill(147, 227, 50);
		//head & body
		rect(gameChar_x - 15, gameChar_y - 45, 39, 26, 1);
		rect(gameChar_x - 9, gameChar_y - 24, 21, 27, 1);
		//legs            2							3							4							1
		quad(gameChar_x - 9, gameChar_y - 4, gameChar_x - 9, gameChar_y + 3, gameChar_x - 6, gameChar_y + 3, gameChar_x, gameChar_y - 4);
		quad(gameChar_x + 3, gameChar_y - 5.5, gameChar_x + 17.5, gameChar_y, gameChar_x + 18, gameChar_y + 3, gameChar_x + 3, gameChar_y + 3);//right leg
		//tail
		quad(gameChar_x - 15, gameChar_y + 1, gameChar_x - 15, gameChar_y + 2, gameChar_x - 9, gameChar_y + 1, gameChar_x - 9, gameChar_y - 4);

		//eyes
		fill(255);
		rect(gameChar_x - 8, gameChar_y - 37, 11, 11, 3);
		fill(0);
		rect(gameChar_x - 4.5, gameChar_y - 35, 4, 7);
		//eyelid
		fill(147, 227, 50);
		rect(gameChar_x - 10, gameChar_y - 39, 15, 6);

		//stomach
		fill(255, 251, 130);
		rect(gameChar_x - 3, gameChar_y - 16, 15, 13);

		//nose
		fill(50);
		rect(gameChar_x + 9, gameChar_y - 36, 2.5, 2.5);
		rect(gameChar_x + 20, gameChar_y - 36, 2.5, 2.5);
	}
	else {
		// add your standing front facing code
		if (lastDir == 1) {
			//char facing right
			noStroke();
			//crown
			fill(165, 0, 0);
			rect(gameChar_x - 19, gameChar_y - 49, 4, 10, 1);
			rect(gameChar_x - 18, gameChar_y - 36, 3, 8, 1);
			//head & body	
			fill(147, 227, 50);
			rect(gameChar_x - 15, gameChar_y - 51, 39, 26, 1);
			rect(gameChar_x - 9, gameChar_y - 30, 21, 27, 1);
			//legs            2							3							4							1
			quad(gameChar_x - 9, gameChar_y - 4, gameChar_x - 9, gameChar_y + 3, gameChar_x - 6, gameChar_y + 3, gameChar_x, gameChar_y - 4);
			quad(gameChar_x + 3, gameChar_y - 4, gameChar_x + 3, gameChar_y + 3, gameChar_x + 6, gameChar_y + 3, gameChar_x + 12, gameChar_y - 4);
			//tail
			quad(gameChar_x - 15, gameChar_y - 10, gameChar_x - 15, gameChar_y - 9, gameChar_x - 9, gameChar_y - 5.5, gameChar_x - 9, gameChar_y - 10);
			//eyes
			fill(255);
			rect(gameChar_x - 8, gameChar_y - 43, 11, 11, 3);
			fill(0);
			rect(gameChar_x - 4.5, gameChar_y - 43, 4, 7);
			//eyelid
			fill(147, 227, 50);
			rect(gameChar_x - 10, gameChar_y - 45, 15, 4);
			//stomach
			fill(255, 251, 130);
			rect(gameChar_x - 3, gameChar_y - 22, 15, 13);
			//nose
			fill(50);
			rect(gameChar_x + 9, gameChar_y - 42, 2.5, 2.5);
			rect(gameChar_x + 20, gameChar_y - 42, 2.5, 2.5);
		}
		else {
			//left
			noStroke();
			//crown
			fill(165, 0, 0);
			rect(gameChar_x + 16, gameChar_y - 49, 4, 10, 1);
			rect(gameChar_x + 16, gameChar_y - 36, 3, 8, 1);

			fill(147, 227, 50);
			//head & body
			rect(gameChar_x - 23, gameChar_y - 51, 39, 26, 1);
			rect(gameChar_x - 11, gameChar_y - 30, 21, 27, 1);
			//legs            2							3							4							1
			quad(gameChar_x + 10, gameChar_y - 4, gameChar_x + 10, gameChar_y + 3, gameChar_x + 7, gameChar_y + 3, gameChar_x + 1, gameChar_y - 4);
			quad(gameChar_x - 2, gameChar_y - 4, gameChar_x - 2, gameChar_y + 3, gameChar_x - 5, gameChar_y + 3, gameChar_x - 11, gameChar_y - 4);
			//tail
			quad(gameChar_x + 16, gameChar_y - 10, gameChar_x + 16, gameChar_y - 9, gameChar_x + 9, gameChar_y - 5.5, gameChar_x + 9, gameChar_y - 10);

			//eyes
			fill(255);
			rect(gameChar_x - 2, gameChar_y - 43, 11, 11, 3);
			fill(0);
			rect(gameChar_x + 1.5, gameChar_y - 43.5, 4, 7);
			//eyelid
			fill(147, 227, 50);
			rect(gameChar_x - 5, gameChar_y - 45, 15, 3.5);

			//stomach
			fill(255, 251, 130);
			rect(gameChar_x - 11, gameChar_y - 22, 15, 13);

			//nose
			fill(50);
			rect(gameChar_x - 10.5, gameChar_y - 42, 2.5, 2.5);
			rect(gameChar_x - 21.5, gameChar_y - 42, 2.5, 2.5);
		}

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud *planets* objects.
function drawClouds(){
	push();
	translate(scrollPos *-0.2, 0)
	for(let i = 0; i < clouds.length; i++){
		noStroke();
	fill(clouds[i].colour);
		ellipse(clouds[i].x_pos, clouds[i].y_pos,clouds[i].size); //anchor point
	noFill();
	strokeWeight(2);
	stroke(250,235,215);
		//     x1, y1,  x2,y2,  x3,y3,   x4,y4
		bezier(clouds[i].x_pos+clouds[i].size/2,clouds[i].y_pos-21/2, clouds[i].x_pos+142+clouds[i].size,clouds[i].y_pos-42, clouds[i].x_pos-114-clouds[i].size,clouds[i].y_pos+87, clouds[i].x_pos-clouds[i].size/2,clouds[i].y_pos+19/2);
	stroke(250,205,205);
		bezier(clouds[i].x_pos+clouds[i].size/2,clouds[i].y_pos-21/2, clouds[i].x_pos+160+clouds[i].size,clouds[i].y_pos-52, clouds[i].x_pos-134-clouds[i].size,clouds[i].y_pos+77, clouds[i].x_pos-clouds[i].size/2,clouds[i].y_pos+19/2);
	stroke(120,125,225);
		bezier(clouds[i].x_pos+clouds[i].size/2,clouds[i].y_pos-21/2, clouds[i].x_pos+131+clouds[i].size,clouds[i].y_pos-82, clouds[i].x_pos-134-clouds[i].size,clouds[i].y_pos+57, clouds[i].x_pos-clouds[i].size/2,clouds[i].y_pos+19/2);
	}
	pop();
}
// Function to draw mountains objects.
function drawMountains(){
	for (let i = 0; i < mountains.length; i++){
		noStroke();
		fill(50);
			//first (x,y) pair is anchor point
			triangle(mountains[i].x_pos,mountains[i].y_pos-mountains[i].size, mountains[i].x_pos-200-mountains[i].size,height-height/4, mountains[i].x_pos+300+mountains[i].size,height-height/4);
		fill(65);
			triangle(mountains[i].x_pos,mountains[i].y_pos-mountains[i].size, mountains[i].x_pos-200-mountains[i].size,height-height/4, mountains[i].x_pos+100+mountains[i].size,height-height/4);
		fill(80);
			triangle(mountains[i].x_pos-100,mountains[i].y_pos+80-mountains[i].size, mountains[i].x_pos-250-mountains[i].size,height-height/4, mountains[i].x_pos+100+mountains[i].size,height-height/4);
		fill(110);
			triangle(mountains[i].x_pos-100,mountains[i].y_pos+80-mountains[i].size, mountains[i].x_pos-250-mountains[i].size,height-height/4, mountains[i].x_pos+mountains[i].size,height-height/4);
		}
	
}
// Function to draw trees *cactus* objects.
function drawTrees(){
	for(let i = 0; i < trees_x.length; i++){
		noStroke();
		fill(0,100,0);
			rect(trees_x[i], treePos_y, 20, 134); //first (x,y) pair is anchor point
			rect(trees_x[i]+27,treePos_y+40,15,40,100);
			rect(trees_x[i]+2,treePos_y+60,40,20,100);
			rect(trees_x[i]-20,treePos_y+10,12,28,100);
			rect(trees_x[i]-20,treePos_y+30,24,12,100);
		strokeWeight(2);
		stroke(10,80,10);
			line(trees_x[i]+3,treePos_y+4,trees_x[i]+3,treePos_y+65);
			line(trees_x[i]+8,treePos_y+2,trees_x[i]+8,treePos_y+65);
		noStroke();
		fill(160, 12, 171);
			triangle(trees_x[i]-5,treePos_y-5,trees_x[i]+1,treePos_y+7,trees_x[i]+7,treePos_y+2.5);
			triangle(trees_x[i]+6,treePos_y-8,trees_x[i]+4,treePos_y+5,trees_x[i]+10,treePos_y+2);
			triangle(trees_x[i]+13,treePos_y-11,trees_x[i]+7,treePos_y+4,trees_x[i]+16,treePos_y+2);
			triangle(trees_x[i]+24,treePos_y-9,trees_x[i]+14,treePos_y+2,trees_x[i]+19,treePos_y+7);
	}
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
	noStroke();
	fill(0,0,180);
	rect(t_canyon.x_pos,floorPos_y,t_canyon.width,height) //anchor point
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
	//check chara is in canyon, constrain movement and sink
	if (gameChar_world_x < t_canyon.x_pos+t_canyon.width && gameChar_world_x > t_canyon.x_pos && gameChar_y < height && gameChar_y > floorPos_y-3){
		isPlummeting = true;
		isFalling = true;
		gameChar_y++;
		game_score--;
		gameChar_x = constrain(gameChar_x, t_canyon.x_pos+23 +scrollPos, t_canyon.x_pos+t_canyon.width-24 +scrollPos);
		if(inWater == false && waterSound.isPlaying() == false){
			inWater = true;
			waterSound.play();
		}
	}
	else{
		//isPlummeting = false;
		//gameChar_world_x = constrain(gameChar_world_x,-200,width+200);
		if (gameChar_y > floorPos_y+300){
			gameChar_y = floorPos_y;
		}
	}
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
	var initialSpeed = t_collectable.speed;
	noStroke();
	fill(139,69,19);
		rect(t_collectable.x_pos-3*t_collectable.size, t_collectable.y_pos+3*t_collectable.size, 40*t_collectable.size,52*t_collectable.size, 100);
	fill(255,215,0);
		rect(t_collectable.x_pos, t_collectable.y_pos, 40*t_collectable.size,52*t_collectable.size, 100);  //first (x,y) pair is anchor point
	noFill();
	strokeWeight(2*t_collectable.size);
	stroke(139,129,19);
		rect(t_collectable.x_pos+6.5*t_collectable.size, t_collectable.y_pos+7.5*t_collectable.size, 28*t_collectable.size,37*t_collectable.size, 100);
	fill(139,69,19,40);
		rect(t_collectable.x_pos+18*t_collectable.size, t_collectable.y_pos+19*t_collectable.size, 6*t_collectable.size,14*t_collectable.size);

	t_collectable.y_pos += t_collectable.speed;	
	
	if (t_collectable.type == "ocean" ){
		if(t_collectable.y_pos < 20){
			t_collectable.speed = -initialSpeed;	
		}
		else if (t_collectable.y_pos > floorPos_y + 60*t_collectable.size){
			t_collectable.speed = -initialSpeed;
		}
	}
	else{
		if(t_collectable.y_pos < 175){
			t_collectable.speed = -initialSpeed;	
		}
		else if (t_collectable.y_pos > floorPos_y - 60*t_collectable.size){
			t_collectable.speed = -initialSpeed;
		}
	}
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
	if (dist(gameChar_world_x - 5, gameChar_y - 70, t_collectable.x_pos, t_collectable.y_pos) < 60){
		t_collectable.isFound = true;
		game_score += 100;
		coinSound.play();
	}
}

// ----------------------------------
// part6 implemented check functions
// ----------------------------------

//function to check remaining lives
function checkPlayerDie(){
	if (gameChar_y >= height-1 && lives > 0 && gameComplete == false){
		lives --;
		game_score -= 100;
		ouchSound.play();
		if (lives != 0){
			startGame();
		}
	}
}

//function to draw and check the flagpole
function renderFlagpole(flagpole){
	//draw flagpole
	noStroke();
	fill(30);
	rect(flagpole.x_pos,flagpole.y_pos,3,100,4);
	fill(200,0,0);
	if (flagpole.isReached == false){
		rect(flagpole.x_pos+4,flagpole.y_pos+98,35,2)
	}
	else if (lives > 0){
		push();
		beginShape();
		vertex(flagpole.x_pos+4, flagpole.y_pos+2);
		vertex(flagpole.x_pos+4, flagpole.y_pos+32);
		vertex(flagpole.x_pos+52, flagpole.y_pos+17);
		endShape(CLOSE);
		fill(250);
		textSize(9);
		text("You Win!",flagpole.x_pos+4, flagpole.y_pos+20)
		textSize(30);
		text("Thanks for playing!", flagpole.x_pos+1000,floorPos_y + 70);
		scale(-1,1);
		image(cake,-flagpole.x_pos-1040,floorPos_y-110,-200,150); //negative x-coordinate to flip img
		if(victorySoundplay == false){
			victorySound.play();
			victorySoundplay = true;
		}
		pop();
	}

	//checkflagpole
	if (flagpole.isReached == false){
		if (dist(gameChar_world_x - 5, gameChar_y - 70, flagpole.x_pos,flagpole.y_pos) < 50 && lives > 0){
			flagpole.isReached = true;
			game_score += 1000;
		}
	}
}

// ----------------------------------
// Platforms render and check functions
// ----------------------------------

function drawPlatform(platform){
	var initialSpeed = platform.speed;
	noStroke();
	fill(0,200,120);
		rect(platform.x_pos, platform.y_pos+initialSpeed, platform.width, 18, 2);
	
	platform.y_pos += platform.speed;

	if (platform.y_pos < 100){
		platform.speed = -initialSpeed;
	}
	else if (platform.y_pos > floorPos_y - 18) {
		platform.speed = -initialSpeed;
	}
}

//returns true if character is above x_pos and within width of platform
function checkPlatform(platform){
	//check if gameChar is inside a platform, checks jump_y to see if start of jump
	if(gameChar_world_x > platform.x_pos -15 && gameChar_world_x < platform.x_pos + platform.width +15 && gameChar_y > platform.y_pos-5  && gameChar_y < platform.y_pos+ 35 && jump_y > 2){
		gameChar_y = platform.y_pos;
		return true;
	}
	return false;
}

//draw sun and sunlight
function drawSun(){
	noStroke();
	
	for (let i = 0; i < 10; i++){
		fill(120,100,0, sunAlpha/2);
		ellipse(sun_x,sun_y,2900-i*200);
	}
	fill(255,120,10, sunAlpha*2);
	ellipse(sun_x,sun_y,900);
	sun_x -= 0.02;
	sun_y += 0.2;
	sunAlpha -= 0.03;
}
//function for debugging purposes
function debug(boolean){
	var x_pos = 920;
	var y_pos = 450;
	var gap = 11; 

	fill(255);
	if(boolean){
		textSize(12);
		text("DEBUGGING", x_pos,y_pos+gap);

		text("char_x: "+ gameChar_x, x_pos,y_pos+gap*2);
		text("world_x: "+ gameChar_world_x, x_pos,y_pos+gap*3);
		text("scroll: "+ scrollPos, x_pos,y_pos+gap*4);
		text("lives: "+ lives, x_pos,y_pos+gap*5);
		text("char_y: "+ gameChar_y, x_pos,y_pos+gap*6);		
		text("fall: "+ isFalling, x_pos,y_pos+gap*7);
		text("jump: "+ isJumping, x_pos,y_pos+gap*8); 		
		text("plummet: "+ isPlummeting, x_pos,y_pos+gap*9);
		text("jump_y: "+ jump_y, x_pos,y_pos+gap*10);

	}
}

/*
DISCLAIMER: I do not own any of these assets
bgm
	https://opengameart.org/content/adventure-music

sound effects 
	https://www.zapsplat.com/music/cartoon-voice-high-pitched-says-ouch-1/
	https://www.zapsplat.com/page/3/?s=jump&post_type=music&sound-effect-category-id
	https://assets.mixkit.co/sfx/download/mixkit-cartoon-positive-sound-2255.wav
	https://mixkit.co/free-sound-effects/water/

images 
	http://www.signaturecakes.com.ng/wp-content/uploads/2015/04/Cake-and-Plate.png
	https://www.seekpng.com/png/full/270-2704301_the-aim-of-discipline-is-to-provide-classrooms.png
*/