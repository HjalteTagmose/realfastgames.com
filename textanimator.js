var typewriter
var iframe
var isTyping = false
var speed = 30;    
var pause = 250;    
var l = 0 
var p = 0
const linkRegex = new RegExp(/<a\s+(?:[^>]*?\s+)?href=([\S])(?<link>.*?)\1 ?(target="(?<target>_blank)")?>(?<text>[^<]*)<\/a>/, 'g')
// new RegExp(/<a\s+(?:[^>]*?\s+)?href=(["'])(?<link>.*?)\1>(?<text>[^<]*)<\/a>/, 'g');
const textRegex = new RegExp(/<a href=[^<]*>[^<]*<\/a>/, 'g');

var writing = false
var stop = false

async function clear() {
    await finish()
    typewriter.innerHTML = "";
    l = 0;
}

async function finish() {
    const spd = speed, pau = pause
    speed = pause = 0
    isTyping = false
    stop = true
    while(writing) await sleep(10)
    stop = false
    speed = spd
    pause = pau
}

async function write(rawText) {
    writing = true
    var links = []
    const matches = rawText.matchAll(linkRegex)
    for (const match of matches) {
        console.log(match.groups.link + " - " + match.groups.text)
        links.push( { 
            Text   : match.groups.text,
            Link   : match.groups.link,
            Target : match.groups.target } )
    }
    const texts = rawText.split(textRegex)

    for (let i = 0; i < texts.length-1; i++) {
        if (stop) break
        const txt = texts[i].split('\n')
        const lnk = links[i]
        for (let j = 0; j < txt.length; j++) {
            if (stop) break
            await typeText(txt[j])
            if (stop) break
            await sleep(pause)
        }
        await typeLink(lnk.Text, lnk.Link, lnk.Target)
    }
    if (stop) {writing = false;return}
    await typeText(texts[texts.length-1])
    writing = false;
}

async function typeText(text) {
    // $('#typewriter', $('#speechbubble').contents()).append("<p id='p"+p+"'></p>")
    for (let i = 0; i < text.length; i++) {
        await sleep(speed).then( () => { 
            if (stop) return
            isTyping = true
            $('#typewriter', $('#speechbubble').contents()).append(text.charAt(i))
            // $("#p"+l, $('#speechbubble').contents()).append(text.charAt(i)) 
        })
    } 

    isTyping = false
    p++
}

async function typeLink(text, link, target) {
    var t = target === undefined ? "" : " target='"+target+"' "
    var a = "<a href='"+link+"' id='c"+l+"'"+t+"></a>";
    $('#typewriter', $('#speechbubble').contents()).append(a)
    
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
            if (element.target)
                return true

            const link = element.href.replace(/.*\//, "")
            writeLink(link)
            return false
        }
    };
    
    curWrite = writeLink("intro")
}

async function writeLink(link) {
    const elmt = iframe.contentWindow.document.getElementById(link)
    await clear()
    curWrite = write(elmt.innerHTML)
}