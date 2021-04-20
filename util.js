async function loadImage(url) 
{
    var img = document.createElement("img");
    img.src = url;
    return img;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}