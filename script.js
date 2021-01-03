$.getJSON("games.json", function(data) {
    parseJSON(data);
});

function parseJSON(data)
{
    var defaultSize = data.defaultSize;

    var i = 0;
    data.boxes.forEach(game => {
        var size = game.size ?? defaultSize;
        var rnd = Math.random() * 30 - 15;
        var pos = 
        {
            x: (size*1.5) * i % window.innerWidth, 
            y: (size*1.5) * i / Math.floor((window.innerWidth - size) / size)
        }
        var box = createBox(
            pos.x, pos.y, size, rnd
        ); i++;
        box.img = loadImage(game.imgPath);
        box.name = game.name;
    });
}