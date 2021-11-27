var typewriter
var iframe
var isTyping = false
var speed = 30;    
var pause = 250;    
var l = 0
const linkRegex = new RegExp(/<a\s+(?:[^>]*?\s+)?href=(["'])(?<link>.*?)\1>(?<text>[^<]*)<\/a>/, 'g');
const textRegex = new RegExp(/<a href=[^<]*>[^<]*<\/a>/, 'g');

async function write(rawText) {
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
        isTyping = true
        const txt = texts[i].split('\n')
        const lnk = links[i]
        for (let j = 0; j < txt.length; j++) {
            await typeText(txt[j]+"\n")
            isTyping = false
            await sleep(pause)
            isTyping = true
        }
        await typeLink(lnk.Text, lnk.Link)
        isTyping = false
    }
    await typeText(texts[texts.length-1])
}

async function typeText(text) {
    for (let i = 0; i < text.length; i++) {
        await sleep(speed).then( () => { 
            $('#typewriter', $('#speechbubble').contents()).append(text.charAt(i)) 
        })
    } 
}

async function typeLink(text, link) {
    $('#typewriter', $('#speechbubble').contents()).append("<a href='"+link+"' id='c"+l+"'></a>")
    for (let i = 0; i < text.length; i++) {
        await sleep(speed).then( () => { 
            $("#c"+l, $('#speechbubble').contents()).append(text.charAt(i)) 
        })
    }
    l++;
}   

jQuery(document).ready(function() {
    setTimeout(setup, 200);
});

async function setup() {
    iframe     = $('#speechbubble').get(0) // document.getElementById("speechbubble");
    typewriter = iframe.contentWindow.document.getElementById("typewriter")
    typewriter.innerHTML = "";
    
    iframe.contentWindow.document.onclick = function (e) {
        e = e ||  window.event;
        var element = e.target || e.srcElement;
        
        if (element.tagName == 'A') {
            alert(element.href);
            return false; // prevent default action and stop event propagation
        }
    };
    
    var intro = iframe.contentWindow.document.getElementById("intro")
    write(intro.innerHTML)
    setTimeout(write, 1000);
}
