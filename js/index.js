
//global so it can be used everywhere, resets the values when the game restarts
let highScore = 0;
let missiles = []; //array of missiles
let aliens = []; //array of aliens
let windowHeight = window.innerHeight; // the height of the window at all times
let windowWidth = window.innerWidth; //the width of the window at all times
let player =
{
    left: 100,
    top: windowHeight - 50
}
let currentLevel = 1; // current level, game speeds up when increased
let currentScore = 0; //what the current score is, to be displayed in a <p> in the html
let gameHasStarted = false; //true when the player has hit a key that is used for the game
let gameOver = false; //will be true when the game ends
let keyPressed = 0; //what is currently being pressed to be used in the global scope

let numRows = 5; //number of rows of aliens
let numColumns = 10; //number of columns of aliens
let paddingTOP = 100; //padding in pixels of where the aliens start from the top
let paddingLEFT = 100; //padding in pixels of where the aliens start from the left

let gameSpeed = 10; //in MS when the game updates





//class to contain information about the aliens and make it easier to put them in an array
class alien
{
    constructor(x, y)
    {
        this.posX = x;
        this.posY = y;
        this.isMovingRight = true;
        this.isAlive = true;
    }
    //movement behavior of the aliens, speeds up as you progress
    move()
    {
        if(this.isMovingRight)
        {
            this.posX += currentLevel;
        }
        else
        {
            this.posX -= currentLevel;
        }
        if(this.posX >= windowWidth - 30)
        {
            this.isMovingRight = false;
            this.posY += 25;
        }
        if(this.posX <= 0)
        {
            this.isMovingRight = true;
            this.posY += 25;
        }
    }
}

//class to contain information about all the missiles and to make it easier to create an array of them
class missile
{
    constructor(x, y)
    {
        this.posX = x;
        this.posY = y;
    }
    //movement behavior of the missiles
    move()
    {
        this.posY -= 10;
    }
}


//get input and then assign it to a global variable
document.onkeydown = function(key)
{
    keyPressed = key.keyCode;
}
//functions attached to the document to update a value when key is unpressed
document.onkeyup = function(key)
{
    keyPressed = '';
}

//draws the player on the screen and handles movement 
function drawPlayer()
{
    //move left
    if(keyPressed == 65)
    {
        player.left -= 10
    }
    //move right
    if(keyPressed == 68)
    {
        player.left += 10;
    }
    //fire button pushed
    if(keyPressed == 87)
    {
        let x = new missile(player.left + 21, player.top);
        missiles.push(x);
        //console.log('shooting missile at: ' + x.posX + ', ' + x.posY);
    }
    //bounds for player to not go out of the window
    if(player.left > windowWidth - 50)
    {
        player.left = windowWidth - 50;
    }
    if(player.left <= 0)
    {
        player.left = 0;
    }

    //update html so the div moves with the logic
    document.getElementById('player').style.left = player.left + 'px';
    document.getElementById('player').style.top = player.top + 'px';
}

//draws all the missiles and cuts them off when they hit the 'roof'
function drawMissiles()
{
    //reset inner HTML everytime it is drawn
    document.getElementById('missile').innerHTML = " ";
    
    //if there are too many missiles it will limit the amount because that would be easy mode
    if(missiles.length > 10)
    {
        missiles.length = 10;
    }    
    
    //fill all the missiles into the div as separate divs and then move, css will handle the image to be displayed because it is a class
    for(var i = 0; i < missiles.length; i++)
    {
        if(missiles[i].posY <= 0)
        {
            missiles.splice(i, 1);
        }
        missiles[i].move();
        //console.log(missiles[i].posY);
        document.getElementById('missile').innerHTML += 
        `<div class='missiles'; style='left:${missiles[i].posX}px; top:${missiles[i].posY}px';></div>`
    }
}

//draws all the aliens and moves them all at once
function drawAliens()
{
    //reset inner HTML everytime it is drawn
    document.getElementById('alien').innerHTML = " ";
  
    //move all the aliens
    for(let i = 0; i < aliens.length; i++)
    {
        aliens[i].move();
    }
    for(let i = 0; i < aliens.length; i++)
    {
        if(aliens[i].isAlive)
        {
            document.getElementById('alien').innerHTML +=
            `<div class='aliens'; style='left:${aliens[i].posX}px; top:${aliens[i].posY}px';></div>`;
        }        
    }
}

//detect collisions between actors, logic here and points
function collisionDetection()
{
    for(let i = 0; i < aliens.length; i++)
    {
        if(aliens[i].isAlive)
        {
            for(let j = 0; j < missiles.length; j++)
            {
                if((missiles[j].posX >= aliens[i].posX && missiles[j].posX <= aliens[i].posX + 25) && (missiles[j].posY >= aliens[i].posY && missiles[j].posY <= aliens[i].posY + 25))
                {
                    aliens[i].isAlive = false;
                    aliens.splice(i, 1);            //remove the alien from the array
                    currentScore += 5 * currentLevel;
                    break;
                }
            }
        } 
    }
}

//Throws a tuple into the database with player name and score
function recordScore(score)
{
    //get user name
    let temp = '';
    if(gameOver)
    {
        temp = prompt("What is your name?");
    }

    //send data to database
    let httpr = new XMLHttpRequest();
    httpr.open("POST", "./php/send_data.php", true);
    httpr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpr.onreadystatechange = function()
    {
        if(httpr.readyState == 4 && httpr.status == 200)
        {
            httpr.responseText;
        }
    }
    httpr.send("name="+temp+"&score="+score);
}

function populateAliens()
{
    for(let i = 0; i < numRows; i++)
    {
        for(let j = 0; j < numColumns; j++)
        {
            let temp = new alien(j * 40 + paddingLEFT, i * 40 + paddingTOP);
            aliens.push(temp);
        }
    }
}

//needs work
function checkIfGameOver()
{
    console.log('checkIfGameOver function');
    for(let i = 0; i < aliens.length; i++)
    {
        if(aliens[i].posY >= windowHeight - 50)
        {
            gameOver = true;
        }
    }
}

function checkIfWaveBeat()
{
    console.log('checkIfWaveBeat function');
    for(let i = 0; i < aliens.length; i++)
    {
        if(aliens[i].isAlive)
        {
            return false;
        }
    }
    return true;
}

function startGame()
{
    console.log('startGame function');
    //empty array of missiles, add to when the player hits fire
    missiles = [];

    //empty array of alines, use .push to add them to the array or objects
    aliens = [];

    //populate aliens
    populateAliens();


    //player position in the screen
    player = 
    {
        left: 100,
        top: windowHeight - 50
    }

    //set current score to 0 and current level to 1 
    currentScore = 0;
    currentLevel = 1;
    
    //set size of the canvas to the spare space on the window
    gameHasStarted = false;
    gameOver = false;

    waitForGameToStart();
}

function updateInformation()
{
    console.log('updateInfomation function');
    document.getElementById('information').innerHTML = "Current Score: " + currentScore + "   Current Level: " + currentLevel + "   High Score: ";
}

//loop with contraint on gamespeed, runs the function every 'gameSpeed' milliseconds
function runGame()
{
    console.log('runGame function');
    //running interval to run the game consistently
    let running = setTimeout(runGame, gameSpeed);
    updateInformation();
    drawAliens();
    drawMissiles();
    drawPlayer();
    collisionDetection();
    if(checkIfWaveBeat())
    {
        populateAliens();
        currentLevel++;
    }
    checkIfGameOver();
    if(gameOver)
    {
        clearInterval(running);
        recordScore(currentScore);
        startGame();
    }
}

//waits til the user gives an input to start the game
function waitForGameToStart()
{
    console.log('waitForGameToStart function');
    let waiting = setTimeout(waitForGameToStart, 10);
    //console.log('waiting for game to start');
    if(keyPressed)
    {
        //clears interval first so that it doesnt keep running the waiting loop
        clearInterval(waiting);
        //then moves to the run game loop
        runGame();
    }
    gameOver = false;
}

//when the window is resized the html will call this function to reset the values for the window height in the javascript
function windowResize()
{
    console.log('windowResize function');
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
    player.top = window.innerHeight - 50;
}


//loop restarts the game when it ends
startGame();