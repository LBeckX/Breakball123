var canvas = document.getElementById("breakball_canvas");
var ctx = canvas.getContext("2d");

var canHeight = canvas.height;
var canWidth = canvas.width;

var x = canvas.width/2;
var y = canvas.height-90;
var tempScore;
var colLeftOrRight = 0.5;
var tempSpeedX = 0.4;
var tempSpeedY = 0.6;
var speedX = 2;
var speedY = 5;
var dx = speedX;
var dy = -speedY;
var mv = 0.25;
var status = 'mainmenu';
var mouseClick = false;

var relativeY=0;
var relativeX=0;

var ballRadius = 10;
var nullBallRadius = 10;
var tempBallRadius = 2;

var puffer = 3;
var paddleHeight = 12;
var nullPaddleWidth = 150;
var paddleWidth = 150;
var paddleTempWith = 15;
var paddleX = (canvas.width-paddleWidth)/2;
var win = false;

var rightPressed = false;
var leftPressed = false;

var brickDestr = 0;
var brickRowCount = 1;
var brickColumnCount = 7;
var brickWidth = 83;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 20;
var brickDifficulty = 0;
var bricks = [];

var specialChance = 25;
var specialsHeight = 30;
var specialsWidth = 75;
var specials = new Array(0);

var liveGen;

var sendTrue = 0;
var playerName;
var score = 0;
var lives = 3;

var startBall = false;
var stage = 1;
var time = 0;

var BUTTONS = [
    mainMenu =[
        play={
            'text':' - STARTEN - ',
            'width':350,
            'height':50,
            'do':function(){
                status='playing';
            }
        },
        credit={
            'text':' CREDITS ',
            'width':250,
            'height':50,
            'do':function(){
                status='credits';
            }
        }
    ],
    breakMenu=[
        play={
            'text':'- WEITER -',
            'width':350,
            'height':50,
            'do':function(){
                status='playing';
            }
        },
        newGame={
            'text':'- NEUES SPIEL -',
            'width':200,
            'height':50,
            'do':function(){
                setAllNull();
                loadBricks();
                setStart();
                paddleWidth = nullPaddleWidth;
                ballRadius = nullBallRadius;
                lives = 3;
                win = false;
                stage = 1;
                status = 'playing';
                startBall = false;
                tempScore=0;
                time = 0;
                score=0;
                brickDestr=0;
                sendTrue = 0;
            }
        },
        mainMenu={
            'text':'- MENÜ -',
            'width':250,
            'height':50,
            'do':function(){
                status = 'mainmenu';
                tempScore=0;
                time = 0;
                score=0;
            }
        }
    ],
    gameOverMenu=[
        play={
            'text': '¯\\ (ツ) /¯ - NEUES SPIEL - ¯\\ (ツ) /¯',
            'width': 350,
            'height': 50,
            'do': function () {
                status = 'playing';
                startBall = false;
                tempScore=0;
                time = 0;
                score=0;
                brickDestr=0;
                sendTrue = 0;
            }
        }
    ],
    playingMenu=[
        sound={
            'posX': canWidth-210,
            'posY': 0,
            'width':100,
            'height':20,
            'text0':'Volume: <',
            'text1':'Volume: <))',
            'do0':function () {
                BgMusic.volume = 0;
                sound.stat=0;
            },
            'do1':function () {
                BgMusic.volume = 0.3;
                sound.stat=1;
            },
            'stat':1
        }
    ],
    credits=[
        back={
            'posX': canWidth-210,
            'posY': canHeight-40,
            'width':100,
            'height':40,
            'text0':'back',
            'text1':'back',
            'do0':function(){
                status='mainmenu';
                back.stat=0;
            },
            'do1':function(){
                status='mainmenu';
                back.stat=1;
            },
            'stat':1
        }
    ]
];

var Cookie = {
    get: function (name) {
        var data    = document.cookie.split(";");
        var cookies = {};
        for(var i = 0; i < data.length; ++i) {
            var tmp = data[i].split("=");
            if (tmp[0] == name) {
                return (tmp[1]);
            }
        }
    },
    set: function (name) {
        var datum = new Date();
        var jahrPlus = datum.getFullYear()+1;
        datum.setFullYear(jahrPlus);
        playerName = prompt('Bitte geben Sie Ihren Namen ein, um Ihren Score zu speichern.');
        if(playerName.length >= 12)
        {
            playerName = playerName.substring(0, 12);
            playerName = playerName.replace(/<\/?[^>]+(>|$)/g, "");
        }
        document.cookie = name + "=" + playerName + ";expires=" + datum + ";domain=.unitgreen.com;path=/";
    }
};

init();

function drawTitleScreen(){
    drawMessageAndBG(0,0,canWidth,canHeight,canWidth/2,
                    (canHeight/2)-(canHeight/3.5),'80',null,'#fff','BREAKBALL::123',1);
}

function drawGameOverScreen(){
    drawMessageAndBG(0,0,canWidth,canHeight,canWidth/2,
        (canHeight/2)-(canHeight/5),'80',null,'#fff',' - GAME OVER - ',1);

    drawMessageAndBG(null,null,null,null,150,(canHeight-100)+25,'25',null,'#fff',' Score: '+score,1);
    //drawMessageAndBG(null,null,null,null,canWidth-200,(canHeight-100)+25,'25',null,'#fff','Destroyed blocks: '+brickDestr,1);
}

function drawMenuButtonAndCheckCollision(){
    var menuInt;
    var buttonY;
    if(status == 'mainmenu'){
        menuInt = 0;
    }else if(status == 'breakmenu'){
        menuInt = 1;
    }else if(status == 'gameover'){
        menuInt = 2;
    }

    var count = Object.keys(BUTTONS[menuInt]).length;

    var canv_2 = canWidth/2;
    var canv_count = ((canHeight/count));
    for(var i = 0; i <=count-1;i++){
        var buttonHeight = BUTTONS[menuInt][i].height;
        var buttonWidth = BUTTONS[menuInt][i].width;
        var buttonX = canv_2-buttonWidth/2;
        if(menuInt == 0){
            buttonY = ((i+1)*canv_count/2)+buttonHeight;
        } else {
            buttonY = ((i+1)*canv_count/2)+buttonHeight/2;
        }
        var buttonText = BUTTONS[menuInt][i].text;
        var fontY = buttonY+(buttonHeight/2);
        if(checkButtonCollision(buttonWidth,buttonHeight,buttonX,buttonY)){
            drawMessageAndBG(buttonX,buttonY,buttonWidth,buttonHeight,canv_2,fontY,'20','#0095DD','#fff',buttonText,1);
            if(mouseClick == true){
                BUTTONS[menuInt][i].do();
            }
        } else {
            drawMessageAndBG(buttonX,buttonY,buttonWidth,buttonHeight,canv_2,fontY,'20','#1EF3FF','#3F3F3F',buttonText,1);
        }
    }
}

function drawPlayingButtonAndCheckCollision(button) {
    var text;
    var menuInt;
    if(button == 'playingMenu'){
        menuInt = 3;
    } else if(button == 'credits'){
        menuInt = 4;
    }

    var countButtons = Object.keys(BUTTONS[menuInt]).length;
    for(var i = 0; i <=countButtons-1;i++){
        var buttonHeight = BUTTONS[menuInt][i].height;
        var buttonWidth = BUTTONS[menuInt][i].width;
        var buttonX = BUTTONS[menuInt][i].posX;
        var buttonY = BUTTONS[menuInt][i].posY;
        var buttonText0 = BUTTONS[menuInt][i].text0;
        var buttonText1 = BUTTONS[menuInt][i].text1;
        var buttonStatus = BUTTONS[menuInt][i].stat;

        if(buttonStatus == 1){
            text = buttonText1;
        } else {
            text = buttonText0;
        }

        drawMessageAndBG(buttonX,buttonY,buttonWidth,buttonHeight,buttonX+buttonWidth/2,buttonY+buttonHeight/2,'15','#fff','#0095DD',text);
        if(checkButtonCollision(buttonWidth,buttonHeight,buttonX,buttonY)){
            if(mouseClick == true){
                if(buttonStatus == 1){
                    BUTTONS[menuInt][i].do0();
                } else {
                    BUTTONS[menuInt][i].do1();
                }
            }
        }
    }
}

function checkButtonCollision(buttonWidth,buttonHeight,buttonX,buttonY){
    return !!(relativeX > buttonX && relativeX < buttonX + buttonWidth && relativeY > buttonY && relativeY < buttonY + buttonHeight);
}

function checkHack() {
    if(score >= tempScore+10 || score < tempScore){
        alert('fail!');
        score = 0;
        status = 'gameover';
    } else {
        tempScore = score;
    }
}

function init() {
    loadMedia();
    loadBricks();
    playSound(BgMusic,true);

    requestframe = (function(){
        return window.requestAnimationFrame ||
            window.webkidRequestAnimationFrame ||
            window.mozRequestAnimationFrame	||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback,1000/60)
            };
    })();

    var userNameCookie = Cookie.get('username');
    if(userNameCookie == null && playerName == undefined){
        Cookie.set('username',playerName);
    } else {
        playerName = userNameCookie;
    }
    gameLoop();
}

function loadMedia() {
    BHitSound = new Audio('files/media/brickHit.mp3');
    BLostSound = new Audio('files/media/blost.mp3');
    GLostSound = new Audio('files/media/glost.mp3');
    GWinningSound = new Audio('files/media/gwinning.mp3');
    PHitSound = new Audio('files/media/paddleHit.mp3');
    BgMusic = new Audio('files/media/background-musik.mp3');
    BgMusic.autobuffer = true;
}

function loadBricks() {
    var specialArrInt;
    bricks = [];
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {

            liveGen = 1 + Math.round(Math.random()*brickDifficulty);
            var intSpecial = Math.round(Math.random()*specialChance);

            switch (intSpecial){
                case 1:
                    specialArrInt = 1;
                    break;
                case 2:
                    specialArrInt = 2;
                    break;
                case 3:
                    specialArrInt = 3;
                    break;
                default:
                    specialArrInt = 0;
            }
            bricks[c][r] = { x : 0, y : 0,status: 1, liveBr : liveGen, special : specialArrInt};
        }
    }
}

function playSound(sound,loop) {
    sound.type = 'audio/mpeg';
    try {sound.currentTime = 0;}catch (e){
        console.log('Can\'t set current time to 0: '+e);
    }
    sound.loop = loop;
    sound.volume = 0.1;
    sound.play();
}

function drawBricks() {
    var text = "";
    var fontColor = "#000";
    var color;

    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;

                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                if(bricks[c][r].special != 0){
                    ctx.strokeStyle = "#fff";
                    ctx.lineWidth = 4;
                    ctx.strokeRect (bricks[c][r].x,bricks[c][r].y,brickWidth,brickHeight);
                }
                switch(bricks[c][r].liveBr) {
                    case 1:
                        color = "#1EF3FF";
                        break;
                    case 2:
                        color = "#004EFF";
                        break;
                    case 3:
                        color = "#FF00A9";
                        break;
                    case 4:
                        color = "#FF0800";
                        break;
                    case 5:
                        color = "#14FF00";
                        break;
                    case 6:
                        color = "#F9FFF6";
                        break;
                }
                drawMessageAndBG(brickX,brickY,brickWidth,brickHeight,brickX+brickWidth/2,brickY+brickHeight/2,"12",color,fontColor,text,1);
            }
        }
    }
}

function drawMessageAndBG(xRec,yRec,widthRec,heightRec,fontPosX,fontPosY,fontSize,recColor,fontColor,text,opons) {
    if(recColor != null){
        ctx.globalAlpha = opons;
        ctx.fillStyle = recColor;
        ctx.fillRect(xRec ,yRec,widthRec,heightRec);
    }

    if(fontColor != null){
        ctx.globalAlpha =1;
        ctx.fillStyle = fontColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = fontSize + "px Arial";
        ctx.fillText(text,fontPosX,fontPosY);
    }
    ctx.globalAlpha = 1;
}

function drawScore() {
    var width = 100;
    var height = 20;
    var posX = 0;
    var posY = 0;
    drawMessageAndBG(posX,posY,width,height,posX+width/2,posY+height/2,16,'#fff','#0095DD',"Score: " + score,1)
}

function drawLives() {
    var width = 100;
    var height = 20;
    var posX = canvas.width-width;
    var posY = 0;
    drawMessageAndBG(posX,posY,width,height,posX+width/2,posY+height/2,16,'#fff','#0095DD',"Lives: "+lives,1)
}

function drawTime(newTime) {
    var width = 120;
    var height = 20;
    var posX = 120;
    var posY = 0;
    var drawingtime = newTime/60;
    drawingtime = Math.round(drawingtime * 100)/100;
    drawMessageAndBG(posX,posY,width,height,posX+width/2,posY+height/2,16,'#fff',null,'',1);

    ctx.globalAlpha=1;
    ctx.fillStyle='#0095DD';
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = 16 + "px Arial";
    ctx.fillText("Time: "+ drawingtime +' s',posX+5,posY+height/2);
}

function drawBall(mvX,mvY) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(mvX != null){
        if(dx>0) {
            x = x + mv;
        } else {
            x = x - mv;
        }
        collisionDetectionBrick(1,null);
    }

    if(mvY != null){
        if(dy>0){
            y = y + mv;
        } else {
            y = y - mv;
        }
        collisionDetectionBrick(null,1);
    }

    ctx.beginPath();
    ctx.arc(x,y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#00FF87";
    ctx.fill();
    ctx.closePath();
    drawBricks();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawSpecs() {
    for(var i=0;i<specials.length;i++){

        if(specials[i][4] == 1){
            specials[i][1] = specials[i][1]+(speedY/2);

            if(specials[i][2] == "newWidth"){

                drawMessageAndBG(specials[i][0],specials[i][1],specialsWidth,specialsHeight,
                    specials[i][0]+specialsWidth/2,specials[i][1]+specialsHeight/2,
                    "15","#FFD712","#292AFF","---",1);

                specials[i][4] = collisionDetectionSpecs(specials[i][0], specials[i][1], specials[i][2]);
            }
            else if(specials[i][2] == "bigBall"){
                drawMessageAndBG(specials[i][0],specials[i][1],specialsWidth,specialsHeight,
                    specials[i][0]+specialsWidth/2,specials[i][1]+specialsHeight/2,
                    "15","#FF009A","#82FF10","O+",1);

                specials[i][4] = collisionDetectionSpecs(specials[i][0], specials[i][1], specials[i][2]);
            }
            else if(specials[i][2] == "fastBall"){
                drawMessageAndBG(specials[i][0],specials[i][1],specialsWidth,specialsHeight,
                    specials[i][0]+specialsWidth/2,specials[i][1]+specialsHeight/2,
                    "15","#FF009A","#82FF10",">O",1);

                specials[i][4] = collisionDetectionSpecs(specials[i][0], specials[i][1], specials[i][2]);
            }
        }
    }
}

function drawCredits() {
    drawMessageAndBG(0,0,canWidth,canHeight,canWidth/2,canHeight/4,'12','#000','#fff','Spiel von Lukas BeckX ;)',0.7);
    drawMessageAndBG(0,0,canWidth,canHeight,canWidth/2,canHeight/3,'12',null,'#fff','Besuch mich auf GitHub: github.com/LBeckX',0.7);
    drawMessageAndBG(0,0,canWidth,canHeight,canWidth/2,canHeight/2.7,'12',null,'#fff','oder auf Facebook: facebook.com/lukas.beck36',0.7);
}

function collisionDetectionField() {
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        playSound(PHitSound,false);
    }

    if(y + dy < ballRadius) {
        dy = -dy;
        playSound(PHitSound,false);
    }
}

function collisionDetectionPaddle() {
    if(y + dy > canvas.height-ballRadius*1.5) {

        if((x+ballRadius/2) > paddleX-puffer && (x-ballRadius/2) < paddleX + paddleWidth+puffer &&
            (y < canvas.height-paddleHeight || y > canvas.height-paddleHeight)) {

            if(x > paddleX-puffer+paddleWidth/2) {
                dx += colLeftOrRight;
            }
            else {
                dx -= colLeftOrRight;
            }
            dy = -dy;
            playSound(PHitSound,false);
        }
        else if(y > canvas.height+puffer){
            lives--;
            playSound(BLostSound,false);

            if(!lives) {
                gameOverHandler();
            }
            else {
                setAllNull();
                window.setTimeout(function(){
                    setStart();
                },2000);
            }
        }
    }
}

function collisionDetectionBrick(checkX,checkY) {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {

            var b = bricks[c][r];

            if(b.status == 1) {
                if(checkX!=null){
                    if (((dx > 0 && x + ballRadius >= b.x  && x + ballRadius <= b.x ) ||
                        (dx < 0 && x - ballRadius <= b.x + brickWidth && x - ballRadius >= b.x + brickWidth - mv)) &&
                        (y + ballRadius >= b.y + mv && y - ballRadius <= b.y + brickHeight - mv)) {
                        dx = -dx;
                        b.liveBr--;
                        score++;
                        if (b.liveBr == 0) {
                            b.status = 0;
                            checkSpecs(b.x + brickWidth / 2, b.y + brickHeight / 2, b.special);
                            brickDestr++;
                        }
                        playSound(BHitSound, false);
                    }
                }

                if(checkY!=null){
                    if((x+ballRadius >= b.x+mv && x-ballRadius <= b.x+brickWidth-mv) &&
                        (y+ballRadius >= b.y-mv && y-ballRadius <= b.y+brickHeight+mv)){
                        dy = -dy;
                        b.liveBr--;
                        score++;

                        if(b.liveBr == 0) {
                            b.status = 0;
                            checkSpecs(b.x+brickWidth/2,b.y+brickHeight/2,b.special);
                            brickDestr++;
                        }
                        playSound(BHitSound,false);
                    }
                }

                if(brickDestr == brickRowCount*brickColumnCount) {
                    setAllNull();
                    win = true;
                    playSound(GWinningSound,false);
                    window.setTimeout(function(){newLevel();},2000);
                }
            }
        }
    }
}

function collisionDetectionSpecs(specX, specY, specUp) {

    if(specY +(speedY+2) > canvas.height-(paddleHeight*1.5)){
        if(specX+specialsWidth > paddleX-puffer && specX < paddleX + paddleWidth+puffer &&
            (specY-puffer <= canvas.height-paddleHeight+puffer || specY >= canvas.height-paddleHeight-puffer)) {

            switch (specUp) {
                case "newWidth":
                    paddleWidth = paddleWidth + paddleTempWith;
                    return 0;
                    break;
                case "bigBall":
                    ballRadius = ballRadius + tempBallRadius;
                    return 0;
                    break;
                case "fastBall":
                    if(dx > 0){
                        dx = dx+tempSpeedX;
                    }
                    else {
                        dx = dx-tempSpeedX;
                    }
                    if(dy > 0){
                        dy = dy+tempSpeedY;
                    }
                    else{
                        dy = dy-tempSpeedY;
                    }
                    return 0;
                    break;
            }
        }
        else if(specY > canvas.height){
            return 0;
        }
    }
    return 1;
}

function checkSpecs(bX,bY,spec){
    var newElement;
    switch(spec) {
        case 1:
            newElement = [bX,bY,"newWidth",1,1];
            break;
        case 2:
            newElement = [bX,bY,"bigBall",1,1];
            break;
        case 3:
            newElement = [bX,bY,"fastBall",1,1];
            break;
        default:
            newElement = [bX,bY,"NULL",1,0];
    }
    specials.push(newElement);
}

function newLevel() {
    win = false;
    startBall = false;
    brickDestr = 0;

    if(brickRowCount <= 4){
        brickRowCount++;
        brickHeight -= 1;
    }

    if(speedX <= 7){
        speedX = speedX + 0.5;
        speedY = speedY + 0.75;
    }
    stage++;
    if(brickDifficulty <= 6)
        brickDifficulty++;

    loadBricks();
    setStart();
    paddleWidth = nullPaddleWidth;
    ballRadius = nullBallRadius;
}

function gameOverHandler() {
    storeScore();
    console.log('eintrag');
    status='gameover';
    playSound(GLostSound,false);
    setAllNull();
    loadBricks();
    setStart();
    paddleWidth = nullPaddleWidth;
    ballRadius = nullBallRadius;
    lives = 3;
    win = false;
    stage = 1;
}

function setAllNull() {
    x = canvas.width/2;
    y = canvas.height-90;
    dx = 0;
    dy = 0;
    specials = new Array(0);
}

function setStart() {
    x = canvas.width/2;
    y = canvas.height-90;
    dx = speedX;
    dy = -speedY;
    paddleX = (canvas.width-paddleWidth)/2;
}

function gameLoop() {
    if(status == 'mainmenu'){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTitleScreen();
        drawPlayingButtonAndCheckCollision('playingMenu');
        drawMenuButtonAndCheckCollision();
    }
    else if(status == 'breakmenu') {
        startBall = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddle();
        drawBricks();
        drawMessageAndBG(0,0,canWidth,canHeight,0,0,0,'#000',null,'',0.4);
        drawMenuButtonAndCheckCollision();
        drawPlayingButtonAndCheckCollision('playingMenu');
    }
    else if(status == 'gameover') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGameOverScreen();
        drawMenuButtonAndCheckCollision();
        drawPlayingButtonAndCheckCollision('playingMenu');
    }
    else if(status == 'credits') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCredits();
        drawPlayingButtonAndCheckCollision('credits');
        drawPlayingButtonAndCheckCollision('playingMenu');
    }
    else if(status == 'playing') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!win) {
            if(startBall) {
                var i;
                if(dx>0 && dx != 0){
                    for (i = 0; i <= dx; i=i+mv) {
                        drawBall(1, null);
                    }
                } else if(dx != 0){
                    for (i = 0; i >= dx; i=i-mv) {
                        drawBall(1, null);
                    }
                }

                if(dy>0 && dy != 0){
                    for (i = 0; i <= dy; i=i+mv) {
                        drawBall(null,1);
                    }
                } else if(dy != 0) {
                    for (i = 0; i >= dy; i=i-mv) {
                        drawBall(null,1);
                    }
                }
                time++;
            }
            drawBall(null,null);
            drawTime(time);
            drawBricks();
            drawPaddle();
            drawLives();
            drawScore();
            drawSpecs();
            collisionDetectionField();
            collisionDetectionPaddle();
            drawPlayingButtonAndCheckCollision('playingMenu');
        }
        else {
            drawMessageAndBG(canvas.width / 2 - 150, canvas.height / 2 - 50, 300, 100,
                canvas.width / 2, canvas.height / 2, "50", "#0095DD", "#fff", "Level " + (stage + 1),1);
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        if (!startBall) {
            drawMessageAndBG(canvas.width / 2 - 150, canvas.height / 2 - 50, 300, 100,
                canvas.width / 2, canvas.height / 2, "50", "#0095DD", "#fff", "Starting...",1);

            window.setTimeout(function () {
                startBall = true;
            }, 1500);
        }
    }
    checkHack();
    mouseClick = false;
    requestframe(gameLoop);
}

function storeScore(){
    if (window.XMLHttpRequest) {
        ajaxRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            ajaxRequest = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {
            try {
                ajaxRequest = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {}
        }
    }
    if(score < 3000) {
        if (sendTrue != 1 && playerName != undefined) {
            var string = "name=" + playerName + "&score=" + score;
            var url = '/!script/php/score_handler/score_safer.script.php?table=breakball123_highScore';
            ajaxRequest.open("post", url, true);
            ajaxRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            ajaxRequest.send(string);
            sendTrue = 1;
        }
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", mouseClickHandler, false);
document.addEventListener('touchmove', touchMoveHandler , false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
    else if (e.keyCode == 27 && status == 'playing') {
        status = 'breakmenu';
    }
    else if (e.keyCode == 27 && status == 'breakmenu') {
        status = 'playing';
    }

}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(evt) {
    var rect = canvas.getBoundingClientRect();
    relativeX = evt.clientX - rect.left;
    relativeY = evt.clientY - rect.top;
    //relativeX = (e.pageX - document.getElementById('game_object').offsetLeft) - document.getElementById('main').offsetLeft;
    //relativeY = (e.pageY - document.getElementById('game_object').offsetTop) - document.getElementById('main').offsetTop;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function mouseClickHandler(){
    mouseClick = true;
}

function touchMoveHandler(e) {

    var t = e.targetTouches;
    console.log(e);
    for (var i=0; i<t.length; i++) {
        paddleX = (t[i].clientX - paddleWidth/2 - document.getElementById('game_object').offsetLeft) - document.getElementById('main').offsetLeft;
        e.preventDefault();
    }
}