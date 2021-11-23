var speechBubble = document.getElementById("speechBubble");

var curGame = null
var gameHole =
{
    x:0,
    y:0,
    offsetX:0,
    offsetY:0,
    width : 200,
    height: 200,
    talkSpeed: 100,
    mouthPos:0,
    mouthOpen: false,
    moveSpeed: 2,
    moveRight: false,
    t: 0,
    render: function(ctx, x, y) {
        mid = this.width/2
        this.x = x-this.offsetX-mid
        this.y = y-this.offsetY
        ctx.drawImage(this.top, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.bottom, this.x, this.y+this.mouthPos, this.width, this.height)
        this.renderSpeechBubble()
    },
    animate: function(dt) {
        // this.shake(dt)
        // this.talk(dt)
    },
    center: function(dt) {
        this.offsetX = lerp(this.offsetX, -this.offsetX, dt)
    },
    idle: function(dt) {
        dt = dt * this.moveSpeed
        if (!this.moveRight)
        {
            this.offsetX = lerp(this.offsetX, -100, dt)
            if (this.offsetX < -45)
            {
                this.moveRight = true;
                console.log("go right")   
            }
        }
        else
        {
            this.offsetX = lerp(this.offsetX, 100, dt)
            if (this.offsetX > 45)
            {
                this.moveRight = false;
                console.log("go left") 
            }
        }
    },
    talk: function(dt) {
        dt = dt * this.talkSpeed
        if (!this.mouthOpen)
        {
            this.mouthPos += dt
            if (this.mouthPos > 10)
                this.mouthOpen = true;
        }
        else
        {
            this.mouthPos -= dt
            if (this.mouthPos < 0)
                this.mouthOpen = false;
        }
    },
    shake: function(dt) {
        this.t += dt
        if (this.t > 0.05) 
        {
            this.setMouth(!this.mouthOpen)
            point = rndPointInCircle(10,0,0)
            this.offsetX = point.x
            this.offsetY = point.y
            this.t = 0
        }
    },
    setMouth: function(open) {
        this.mouthOpen = open
        this.mouthPos = open ? 20 : 0  
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