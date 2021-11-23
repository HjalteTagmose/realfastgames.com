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

function rndPointInCircle(radius, centerX, centerY) {
    r = radius * Math.sqrt(Math.random())
    theta = Math.random() * 2 * Math.PI
    x = centerX + r * Math.cos(theta)
    y = centerY + r * Math.sin(theta)
    return { x, y }
}