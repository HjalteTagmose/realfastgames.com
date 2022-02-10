var incr = 50
var linkCount = 5
var links = []
    
var handle;
var handleStart = 0;

var flushing = false

async function updateFlusher() {
    renderFlusher()
    if (handle.path[0].y > handleStart+incr*5 && !flushing)
        await flush()
}

async function flush()
{
    if (flushing) return
    flushing = true
    playSound('flush')
    await clearBoxes()
    pinBox(handle, false)
    handle.hidden = false
    await sleep(4000)
    flushing = false
}

async function createFlusher() {
    var x = canvas.width/2 + canvas.width/3
    
    //chain
    var prev = {
        x: x,
        y: 0,
        oldx: x,
        oldy: 100,
        pinned: true
    }

    for (let i = 0; i < linkCount; i++) {
        console.log(prev.y)
        p = {
            x: x,
            y: prev.y+incr,
            oldx: x,
            oldy: prev.y+incr
        }
        s = {
            p0: prev,
            p1: p,
            length: distance(prev, p)
        }
        points.push(p, prev)
        sticks.push(s)
        links.push(s)
        prev = p
    }

    var by = incr*linkCount+incr
    var box = createBox(x,by,100,0)
    box.game = { name: "flusher", link: "flusher", img:null, tags: ["flusher"] }
    await loadImage("/handle-temp.png").then(img => box.game.img = img);
    box.pinned = false

    handle = box
    handleStart = by
    handle.noShadow = true

    s = {
        p0: prev,
        p1: box.path[0],
        length: distance(prev, box.path[0])
    }
    sticks.push(s)
    links.push(s)
}

function renderFlusher()
{
    context.beginPath();
    for (let i = 0; i < linkCount+1; i++) 
    {
        var s = links[i];
        if (!s.hidden)
        {
            context.moveTo(s.p0.x, s.p0.y);
            context.lineTo(s.p1.x, s.p1.y);
        }
    }
    context.stroke();
}