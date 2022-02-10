var speechBubble = document.getElementById("speechdiv");

var curGame = null
var gameHole =
{
    x:0,
    y:0,
    offsetX:0,
    offsetY:0,
    width : 200,
    height: 200,
    talkSpeed: 150,
    mouthPos:0,
    mouthOpen: false,
    moveSpeed: .5,
    moveRight: false,
    t: 0,
    puking: false,
    render: function(ctx, x, y) {
        mid = this.width/2
        this.x = x-this.offsetX-mid
        this.y = y-this.offsetY
        ctx.drawImage(this.top, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.bottom, this.x, this.y+this.mouthPos, this.width, this.height)
    },
    animate: function(dt) {
        if(this.puking) {
            this.shake(dt)
            this.setMouth(true)
        } else {
            if(isTyping && speechOn) this.talk(dt)
            else this.setMouth(false)
            this.idle(dt) 
        }
    },
    center: function(dt) {
        this.offsetX = lerp(this.offsetX, -this.offsetX, dt)
    },
    idle: function(dt) {
        if (this.t > 1)
        {
            this.moveRight = !this.moveRight
            this.t = 0
        }

        this.t += dt * this.moveSpeed
        const v = smoothstep(0, 1, this.t)

        if (!this.moveRight)
            this.offsetY = (v * -20)+10
        else
            this.offsetY = (v *  20)-10
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
    contains: function(x, y) {
        return  x < this.width  + this.x && 
                y < this.height + this.y &&
                x > this.x && 
                y > this.y 
    },
    toggleSpeech: function() {
        if (!this.puking)
            setSpeech(!speechOn)
    },
    eat: function(box) {
        if (box != null)
            eatGame(box.game);
    },
    puke: function() {
        pukeCurGame();
    }
}

loadImage("imgs/metop.png").then(img => gameHole.top = img);
loadImage("imgs/mebottom.png").then(img => gameHole.bottom = img);

function eatGame(game) 
{  
    if (game.tags.includes("flusher")) 
    {
        writeLink("flusher")
        setSpeech(true)
        return;
    }

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

function pukeCurGame() {
    pukeGame(curGame)
}

function pukeGame(game) {
    if (game != null)
    {
        game.puke = 1;
        game = null;
    }
}

var speechOn=true
function setSpeech(on) {
    speechOn = on
    speechBubble.style = on ? "display: block;" : "display: none;";
}

function playSound(sfx){
    var audio = new Audio('sfx/'+sfx+'.wav');
    audio.play();
}

document.addEventListener("visibilitychange", event => {
    if (document.visibilityState == "visible") {
        console.log("tab is active")
        pukeCurGame()
    } else {
        console.log("tab is inactive")
    }
})

var wrapper = document.getElementById('wrapper');