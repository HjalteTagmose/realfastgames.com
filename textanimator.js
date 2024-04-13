var typewriter
var iframe
var isTyping = false
var isSkip = false
var speed = 10;    
var pause = 250;    
var l = 0 
var p = 0
var curLink = "intro"
const linkRegex = new RegExp(/<a\s+(?:[^>]*?\s+)?href=([\S])(?<link>.*?)\1 ?(target="(?<target>_blank)")?>(?<text>[^<]*)<\/a>/, 'g')
// new RegExp(/<a\s+(?:[^>]*?\s+)?href=(["'])(?<link>.*?)\1>(?<text>[^<]*)<\/a>/, 'g');
const textRegex = new RegExp(/<a href=[^<]*>[^<]*<\/a>/, 'g');

$(document).on("click", async function () { 
    skip()
});

var iframe = $(speechbubble)
function onStartWriting() {
    iframe.style="pointer-events: none;"
}
function onFinishWriting() {
    iframe.style="pointer-events: all;"
}

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

async function skip() {
    const spd = speed, pau = pause
    speed = pause = 0
    isSkip = true
    while(writing) await sleep(10)
    isSkip = false
    speed = spd
    pause = pau
}

async function write(rawText) {
    writing = true
    var links = []
    onStartWriting()

    // count tags: tag#
    matches = rawText.matchAll(/tag#(?<tag>\S*)/g)
    for (const match of matches) {
        const tag = match.groups.tag
        const junk = match[0]
        rawText = rawText.replace(junk, countTag(tag)+"")
        console.log("Tag: " + tag)
    }

    // find links
    var matches = rawText.matchAll(linkRegex)
    for (const match of matches) {
        console.log(match.groups.link + " - " + match.groups.text)
        links.push( { 
            Text   : match.groups.text,
            Link   : match.groups.link,
            Target : match.groups.target } )
    }

    // find pukes
    var matches = rawText.matchAll(/[^href="]puke-(?<puke>\S*)/g)
    for (const match of matches) {
        const puke = match.groups.puke
        const junk = match[0]
        rawText = rawText.replace(junk, "")
        pukeByTag(puke, true)
    }

    // find texts
    const texts = rawText.replace(/\n/g, '~').split(textRegex)

    // write
    for (let i = 0; i < texts.length-1; i++) {
        if (stop) break
        if (texts[i].length < 3) continue
        const txt = texts[i].split('\n')
        const lnk = links[i]

        for (let j = 0; j < txt.length; j++) {
            if (stop) break
            await typeText(txt[j])
            if (stop) break
            if (isSkip) continue
            await sleep(pause)
        }
        await typeLink(lnk.Text, lnk.Link, lnk.Target)
    }
    if (stop) {writing = false;return}
    await typeText(texts[texts.length-1])

    writing = false;
    onFinishWriting()
}

async function typeText(text) {
    if (isSkip)
    {
        for (let i = 0; i < text.length; i++) {
            const ch = text.charAt(i)
            if (ch === '~' || ch === ' ') isTyping = false
            if (ch === '~') $('#typewriter', $('#speechbubble').contents()).append("<br/>")
            else            $('#typewriter', $('#speechbubble').contents()).append(ch)
        }
        isTyping = false
        p++
        return
    }

    for (let i = 0; i < text.length; i++) {
        await sleep(speed).then( () => { 
            if (stop) return
            isTyping = true
            const ch = text.charAt(i)
            if (ch === '~' || ch === ' ') isTyping = false
            if (ch === '~') $('#typewriter', $('#speechbubble').contents()).append("<br/>")
            else            $('#typewriter', $('#speechbubble').contents()).append(ch)
        })
    } 
    isTyping = false
    p++
}

async function typeLink(text, link, target) {
    var t = target === undefined ? "" : " target='"+target+"' "
    var a = "<a href='"+link+"' id='c"+l+"'"+t+"></a>";
    $('#typewriter', $('#speechbubble').contents()).append(a)

    if (isSkip)
    {
        $("#c"+l, $('#speechbubble').contents()).append(text) 
        isTyping = false
        l++
        return
    }

    for (let i = 0; i < text.length; i++) {
        await sleep(speed).then( () => { 
            if (stop) return
            isTyping = true
            $("#c"+l, $('#speechbubble').contents()).append(text.charAt(i)) 
        })
    }

    isTyping = false
    l++
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
            if (element.href.includes('puke')) {
                var tag = element.href.match(/puke-(?<tag>.*)/).groups.tag
                pukeByTag(tag)
                return false
            }
            if (element.href.includes('flusher')) {
                writeLink("eatflusher")
                return false
            }
            if (element.href.includes('clearBoxes')) {
                clearBoxes()
                return false
            }

            const link = element.href.replace(/.*\//, "")
            writeLink(link)
            return false
        }
    };
    
    curWrite = writeLink("intro")
}

async function writeLink(link) {
    curLink = link
    const elmt = iframe.contentWindow.document.getElementById(link)
    await clear()
    curWrite = write(elmt.innerHTML)
}