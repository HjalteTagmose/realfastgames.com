var curGame = null
var gameHole =
{
    width : 150,
    height: 150,
    render: function(ctx) {
        ctx.drawImage(this.img, 0, 10, 300, 300);
    },
    eat: function(box) {
        eatGame(box.game);
    },
    puke: function() {
        pukeGame();
    }
}

loadImage("gamehole.png").then(img => gameHole.img = img);

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