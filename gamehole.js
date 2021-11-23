var speechBubble = document.getElementById("speechBubble");

var curGame = null
var gameHole =
{
    x:0,
    y:0,
    talkOffset:0,
    width : 200,
    height: 200,
    render: function(ctx, x, y) {
        var offsetX = this.width/2
        this.x = x-offsetX
        this.y = y
        ctx.drawImage(this.top, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.bottom, this.x, this.y+this.talkOffset, this.width, this.height)
        this.renderSpeechBubble()
    },
    renderSpeechBubble: function() {
        speechBubble.style = "display: block;";
    },
    contains: function(x, y) {
        return  x < this.width  + this.x && 
                y < this.height + this.y &&
                x > this.x && 
                y > this.y 
    },
    eat: function(box) {
        eatGame(box.game);
    },
    puke: function() {
        pukeGame();
    }
}

loadImage("metop.png").then(img => gameHole.top = img);
loadImage("mebottom.png").then(img => gameHole.bottom = img);

function eatGame(game) 
{  
    playSound('eat');
    curGame = game;
    window.open(game.link, '_blank').focus();
    // var wrapper = document.getElementById('wrapper');       
    // var div = document.createElement('div');
    // div.style.zIndex = 1;
    // div.style.position = "absolute";
    // div.style.background = 'red';
    // div.style.width  = 100 + 'px';
    // div.style.height = 100 + 'px';
    // div.style.left = 10 + 'px';
    // div.style.top  = 10 + 'px';
    // wrapper.append(div);
}

function pukeGame()
{
    if (curGame != null)
    {
        playSound('puke');
        curGame.puke = 1;
        curGame = null;
    }
}

function playSound(sfx)
{
    var audio = new Audio('sfx/'+sfx+'.wav');
    audio.play();
}

document.addEventListener("visibilitychange", event => {
    if (document.visibilityState == "visible") {
        console.log("tab is active")
        pukeGame()
    } else {
        console.log("tab is inactive")
    }
})

var wrapper = document.getElementById('wrapper');