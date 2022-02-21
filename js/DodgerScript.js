var game = document.getElementById("game");
var character = document.getElementById("character");
let CHARACTERHEIGHT = 76;
let CHARACTERWIDTH = 40;
var interval;
var both = 0;
var counter = 0;
var LEVEL = 1;
var levelElement = document.getElementById('level');
var score = 0;
var scoreElement = document.getElementById('score');
var currentBlocks = [];
var randomPosition = 0;
let firstRun = 0;


var gameOverDiv;
var gameOverText;

// move character div left by 1 px
function moveLeft() {
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if(left>0){
    character.style.left = left - 1 + "px";
        }
    
}

// move character div right by 1px
function moveRight() {
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if(left<360){
    character.style.left = left + 1 + "px";
    }
}


// event listeners that respond to arrow keys
document.addEventListener("keydown", event => {
    if(both==0){
        both++;
    if(event.key=="ArrowLeft"){
        // sets an interval for how long to wait for the call of the  moveLeft function (1ms in this case)
        interval = setInterval(moveLeft, 1);
    }
    if(event.key=="ArrowRight"){
        interval = setInterval(moveRight, 1);
    }
    }
});

document.addEventListener("keyup", event => {
    clearInterval(interval);
    both=0;
});

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// encapculate this entire function in a driver to have this run then start is pressed
// if not a button, we could also use space bar   let gameInterval = 
function runGame() {
    return new Promise((resolve) => {let intId =setInterval( function () {

    var blockLast = document.getElementById("block"+(counter-1));
    if (counter>0){
        var blockLastTop = parseInt(window.getComputedStyle(blockLast).getPropertyValue("top"));
    }
    
    if (blockLastTop> 0 || counter==0) {
        
        // create html elements to contain the space objects
        var block = document.createElement("div");
        block.setAttribute("class", "block");
        block.setAttribute("id", "block"+counter);
        block.style.top = blockLastTop - 80 + "px";
      
        //generate random placement of hole (game width - hole size)
        var randomSize = getRandomInt(10,50);
        block.style.height = randomSize + "px";
        block.style.width = randomSize + "px";
        block.style.marginTop = -randomSize + "px";
        
        // random position for asteroid that lies in game boundary
        var randomPosition = getRandomInt(0, 400 - randomSize);
        block.style.left = randomPosition + "px";
        
        //add created layers to the game div
        game.appendChild(block);
        currentBlocks.push(counter);
        counter++;
    }
    
    for(i = 0; i < currentBlocks.length; i++){

        let currentId = currentBlocks[i];
        var currentBlock = document.getElementById("block" + currentId);

        var currentBlockTop = parseFloat(window.getComputedStyle(currentBlock).getPropertyValue("top"));
        var currentBlockLeft = parseFloat(window.getComputedStyle(currentBlock).getPropertyValue("left"));
        
        //moves the blocks top property to make it appear in motion
        currentBlock.style.top = currentBlockTop + 2 + "px";
        var currentBlockWidth = parseInt(window.getComputedStyle(currentBlock).getPropertyValue("width"));
        var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
        var currentBlockSize = currentBlockWidth + currentBlockLeft;
           
        //check to see if a block comes in contact with a player
        if((currentBlockTop > 345) && (currentBlockTop < 420)){

            // add extra digits to each scenario to get more precise collision
            if((characterLeft >= currentBlockLeft) && (characterLeft <= currentBlockSize)){
                // alert("Game Over! LEFT COLLISION");
                resolve();
                clearInterval(intId);
                return;
            }
            if ((currentBlockLeft >= characterLeft) && (currentBlockLeft <= characterLeft + CHARACTERWIDTH)){
                // alert("Game Over! RIGHT COLLISION"); 
                resolve();
                clearInterval(intId);
                return;
            }
        }
        
        // remove block when it passes the player and increase score
        if (currentBlockTop >440){
            score++;
            scoreElement.innerHTML = 'Score: ' + score;
            // check if score is a multple of 50 so we can increase the level
            // this also signals to make the blocks move faster
            let remainder = score % 50;
            if (remainder == 0){
                // score is am multiple of 50, increase level
                LEVEL++;
                levelElement.innerHTML = 'Level: ' + LEVEL;
            }

            currentBlocks.shift();
            currentBlock.remove();
        }
    }   
}, .01);
});
}


// shows a visual on webpage after the player hits an asteroid
function gameOverVisual() {
    return new Promise((resolve) => { 
        // Create game over banner
        gameOverDiv = document.createElement("div");
        gameOverDiv.setAttribute("id", "gameOver");

        // create element to contain text banner
        gameOverText = document.createElement("h1");
        gameOverText.setAttribute("id", "gameOverText");
        gameOverText.innerHTML = 'Game Over !';

        // add game result element to game div
        gameOverDiv.appendChild(gameOverText);
        game.appendChild(gameOverDiv);

        resolve();
        return;
    });
}

// function removeGameOverVisual();
function clearGameDate(){
    // clear all blocks or 'asteroids' from game:
    let blocks = document.querySelectorAll('.block');
    blocks.forEach(box => {
        box.remove();
    });

    //clear all variable values:
    both = 0;
    counter = 0;
    LEVEL = 1;
    score = 0;
    currentBlocks = [];
    // i;
    // x;
    randomPosition = 0;

    gameOverDiv.remove();
    gameOverText.remove();
}

async function driver(){
    if (firstRun > 0){
        clearGameDate();
    }
    firstRun++;
    await runGame();

    await gameOverVisual();
}

async function playAgain(){
    clearGameDate();

    // reset the score and level elements
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("level").innerHTML = "Level: " + LEVEL;

    // rurun game and display gameover visual when player loses
    await runGame();
    await gameOverVisual();
}











