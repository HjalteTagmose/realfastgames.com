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
            x: (size*150) * i % window.innerWidth - 500, 
            y: (size*150) * i / Math.floor((window.innerWidth - size) / size)
            // x: (size*1.5) * i % window.innerWidth, 
            // y: (size*1.5) * i / Math.floor((window.innerWidth - size) / size)
        }
        var box = createBox(
            pos.x, pos.y, size, rnd
        ); i++;
        await loadImage(game.imgPath).then(img => game.img = img);
        box.game = game;
        box.hidden = true;
        pinBox(box, true)
    });
}

var mousePos = { x: 0, y: 0 };
var selected = null;

canvas.addEventListener('touchend'  , (e) => stopDrag());
canvas.addEventListener('mouseup'   , (e) => stopDrag());
canvas.addEventListener('touchmove' , (e) => { getTouch(e); drag();});
canvas.addEventListener('mousemove' , (e) => { getMouse(e); drag();});
canvas.addEventListener('touchstart', (e) => { getTouch(e); startDrag();});
canvas.addEventListener('mousedown' , (e) => { getMouse(e); startDrag();});
canvas.addEventListener('click'     , (e) => { getMouse(e); click(e);});

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
    if (gameHole.contains(mousePos.x, mousePos.y))
        gameHole.eat(selected)
    
    pinBox(selected, false);
    selected = null;
}

function click(e)
{
    if (e.detail == 1)
    {
        if (gameHole.contains(mousePos.x, mousePos.y))
        {
            gameHole.toggleSpeech();
        }
        // for (let i = 0; i < boxes.length; i++)
        // {
        //     var b = boxes[i];
        //     if (contains(b, mousePos.x, mousePos.y))
        //     {
        //         // window.open(b.game.link,'_blank');
        //     }
        // }
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

function setPos(box, x, y)
{
    box.x = x
    box.y = y
    box.path.forEach(p => {
        p.oldx = p.x;
        p.oldy = p.y;
    });
    box.path[0].x = box.path[0].oldx = x - box.size/2;
    box.path[0].y = box.path[0].oldy = y - box.size/2;
    box.path[1].x = box.path[1].oldx = x + box.size/2;
    box.path[1].y = box.path[1].oldy = y - box.size/2;
    box.path[2].x = box.path[2].oldx = x + box.size/2;
    box.path[2].y = box.path[2].oldy = y + box.size/2;
    box.path[3].x = box.path[3].oldx = x - box.size/2;
    box.path[3].y = box.path[3].oldy = y + box.size/2;
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

let pukeDelay = 150
let pukes = 1
let cleared = true

async function pukeByTag(tag) {
    playSound('puke');
    gameHole.puking = true
    setSpeech(false)
    for (let i = 0; i < boxes.length; i++)
    {
        var b = boxes[i];
        if (b.game.tags.includes(tag) && b.hidden)
        {
            cleared = false
            setPos(b, gameHole.x+100, gameHole.y+150)
            b.hidden = false
            pinBox(b, false)
            pukeGame(b.game)
            console.log("puke: "+b.game.name)
            await sleep(pukeDelay)
            if (pukes % 3 === 0) playSound('puke')
            pukes++
        }
    }
    gameHole.puking = false
    pukes=1
}

async function clearBoxes() {
    if (cleared) return

    setSpeech(false)
    floorOffset = 50000
    
    await sleep(1000)
    let waited = 1000
    while(!speechOn && waited < 1500) 
    {
        await sleep(10)
        waited += 10
    }
    
    floorOffset = 0 
    for (let i = 0; i < boxes.length; i++)
    {
        var b = boxes[i];
        b.hidden = true
        pinBox(b, true)
    }
    cleared = true
    if (!speechOn) setSpeech(true)
}

function countTag(tag) {
    var total = 0
    for (let i = 0; i < boxes.length; i++)
    {
        var b = boxes[i]
        if (b.game.tags.includes(tag))
        {
            total++
        }
    }
    return total
}