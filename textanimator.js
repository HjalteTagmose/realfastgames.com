var typewriter
var iframe
var isTyping = false
var speed = 30;    
var pause = 250;    
var l = 0
const linkRegex = new RegExp(/<a\s+(?:[^>]*?\s+)?href=(["'])(?<link>.*?)\1>(?<text>[^<]*)<\/a>/, 'g');
const textRegex = new RegExp(/<a href=[^<]*>[^<]*<\/a>/, 'g');

var writing = false
var stop = false

async function clear() {
    await finish()
    typewriter.innerHTML = "";
    l = 0;
}

async function finish() {
    var s = speed, p = pause
    speed = pause = 0
    isTyping = false
    stop = true
    while(writing) await sleep(10)
    stop = false
    speed = s
    pause = p
}

async function write(rawText) {
    writing = true
    var links = []
    const matches = rawText.matchAll(linkRegex)
    for (const match of matches) {
        console.log(match.groups.link + " - " + match.groups.text)
        links.push( { 
            Text :  match.groups.text,
            Link :  match.groups.link } )
    }
    const texts = rawText.split(textRegex)

    for (let i = 0; i < texts.length-1; i++) {
        if (stop) break
        const txt = texts[i].split('\n')
        const lnk = links[i]
        for (let j = 0; j < txt.length; j++) {
            if (stop) break
            await typeText(txt[j]+"\n")
            if (stop) break
            await sleep(pause)
        }
        await typeLink(lnk.Text, lnk.Link)
    }
    if (stop) {writing = false;return}
    await typeText(texts[texts.length-1])
    writing = false;
}

async function typeText(text) {
    for (let i = 0; i < text.length; i++) {
        await sleep(speed).then( () => { 
            if (stop) return
            isTyping = true
            $('#typewriter', $('#speechbubble').contents()).append(text.charAt(i)) 
        })
    } 
    isTyping = false
}

async function typeLink(text, link) {
    $('#typewriter', $('#speechbubble').contents()).append("<a href='"+link+"' id='c"+l+"'></a>")
    for (let i = 0; i < text.length; i++) {
        await sleep(speed).then( () => { 
            if (stop) return
            isTyping = true
            $("#c"+l, $('#speechbubble').contents()).append(text.charAt(i)) 
        })
    }
    isTyping = false
    l++;
}   

jQuery(document).ready(function() {
    setTimeout(setup, 500);
});

async function setup() {
    iframe     = $('#speechbubble').get(0) // document.getElementById("speechbubble");
    typewriter = iframe.contentWindow.document.getElementById("typewriter")
    clear()
    
    iframe.contentWindow.document.onclick = function (e) {
        e = e ||  window.event;
        var element = e.target || e.srcElement;

        if (element.tagName == 'A') {
            const link = element.href.replace(/.*\//, "")
            writeLink(link)
            return false; // prevent default action and stop event propagation
        }
    };
    
    curWrite = writeLink("intro")
}

async function writeLink(link) {
    const elmt = iframe.contentWindow.document.getElementById(link)
    await clear()
    curWrite = write(elmt.innerHTML)
}