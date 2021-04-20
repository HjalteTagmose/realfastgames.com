var gameHole =
{
    width : 100,
    height: 100,
    render: function(ctx) {
        ctx.drawImage(this.img, 0, 10, this.width, this.height);
    },
    eat: function(box) {
        showGame(box.game);
    }
}

loadImage("gamehole.png").then(img => gameHole.img = img);

function showGame(game) 
{  
    var wrapper = document.getElementById('wrapper');       
    var div = document.createElement('div');
    div.style.zIndex = 1;
    div.style.position = "absolute";
    div.style.background = 'red';
    div.style.width  = 100 + 'px';
    div.style.height = 100 + 'px';
    div.style.left = 10 + 'px';
    div.style.top  = 10 + 'px';
    wrapper.append(div);
}
  
var wrapper = document.getElementById('wrapper');