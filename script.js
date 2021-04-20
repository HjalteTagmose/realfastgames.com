$.getJSON("games.json", function(data) {
    parseJSON(data);
});

async function parseJSON(data)
{
    var i = 0;
    data.boxes.forEach(async game => {
        var size = (game.size ?? 100) * data.sizeMultiplier;
        var rnd = Math.random() * 30 - 15;
        var pos = 
        {
            x: (size*1.5) * i % window.innerWidth, 
            y: (size*1.5) * i / Math.floor((window.innerWidth - size) / size)
        }
        var box = createBox(
            pos.x, pos.y, size, rnd
        ); i++;
        await loadImage(game.imgPath).then(img => game.img = img);
        box.game = game;
    });
}

var mousePos = { x: 0, y: 0 };
var selected = null;

canvas.addEventListener('touchend', (e) => stopDrag());
canvas.addEventListener('mouseup', (e) => stopDrag());
canvas.addEventListener('touchmove', (e) => { getTouch(e); drag();});
canvas.addEventListener('mousemove', (e) => { getMouse(e); drag();});
canvas.addEventListener('touchstart', (e) => { getTouch(e); startDrag();});
canvas.addEventListener('mousedown',  (e) => { getMouse(e); startDrag();});
canvas.addEventListener('click',  (e) => { getMouse(e); click(e);});

function startDrag(e)
{
    for (let i = 0; i < boxes.length; i++)
    {
        var b = boxes[i];
        if (contains(b, mousePos.x, mousePos.y))
        {
            console.log(b.game.name);
            selected = b;
        }
    }
}

function drag(e)
{
    if (selected != null)
    {
        moveToPos(selected, mousePos.x, mousePos.y);
    }
}

function stopDrag(e)
{
    // Assumes gamehole is in topleft corner
    if (mousePos.x < gameHole.width && 
        mousePos.y < gameHole.height)
        gameHole.eat(selected)
    
    pinBox(selected, false);
    selected = null;
}

function click(e)
{
    if (e.detail == 1)
    {
        for (let i = 0; i < boxes.length; i++)
        {
            var b = boxes[i];
            if (contains(b, mousePos.x, mousePos.y))
            {
                // window.open(b.game.link,'_blank');
            }
        }
    }
}

function moveToPos(box, x, y)
{
    box.x = x
    box.y = y
    pinBox(box, true);
    box.path.forEach(p => {
        p.oldx = p.x;
        p.oldy = p.y;
    });
    box.path[0].x = x - box.size/2;
    box.path[0].y = y - box.size/2;
    box.path[1].x = x + box.size/2;
    box.path[1].y = y - box.size/2;
    box.path[2].x = x + box.size/2;
    box.path[2].y = y + box.size/2;
    box.path[3].x = x - box.size/2;
    box.path[3].y = y + box.size/2;
}

function pinBox(box, pin)
{
    if (box == null) return;
    box.path[0].pinned = pin;
    box.path[1].pinned = pin;
    box.path[2].pinned = pin;
    box.path[3].pinned = pin;
}

function getMouse(e) 
{
    var rect = canvas.getBoundingClientRect();
    var x = (e.clientX - rect.left)* 1.0;
    var y = (e.clientY - rect.top )* 1.0;

    mousePos.x = (x/rect.width)  * canvas.width; 
    mousePos.y = (y/rect.height) * canvas.height;
}

function getTouch(e) 
{
    var rect = canvas.getBoundingClientRect();
    var x = (e.touches[0].clientX - rect.left)* 1.0;
    var y = (e.touches[0].clientY - rect.top )* 1.0;

    mousePos.x = (x/rect.width)  * canvas.width; 
    mousePos.y = (y/rect.height) * canvas.height; 
}

function contains(box, x, y)
{
    return  box.min.x < x && x < box.max.x &&
            box.min.y < y && y < box.max.y;
}
