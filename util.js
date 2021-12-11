async function loadImage(url) 
{
    var img = document.createElement("img");
    img.src = url;
    return img;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function lerp(a, b, t) {
    return a + t * (b - a);
}

function smoothstep(edge0, edge1, x) {
    x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return x * x * (3.0 - 2.0 * x);
}

function clamp(x, min, max) {
    return x < min ? min : x > max ? max : x
}

function rndPointInCircle(radius, centerX, centerY) {
    r = radius * Math.sqrt(Math.random())
    theta = Math.random() * 2 * Math.PI
    x = centerX + r * Math.cos(theta)
    y = centerY + r * Math.sin(theta)
    return { x, y }
}

// function divContains(div, px, py) {
//     w = div.offsetWidth
//     h = div.offsetHeight
//     x = div.offsetLeft
//     y = div.offsetTop
    
//     return x < px   &&
//            y < py   &&
//            x+w > px &&
//            y+h > py  
// }