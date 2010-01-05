var startDemo = function () {

  var player = {map : {x : 5, y : 10}, velocity : {x : 0, y : 0}};

  var myScreen = new ViewPort('myScreen', 800, 600);
  var mini = new ViewPort('mini', 96, 96);

  var tiles = new TileSet(myScreen, {
    image :'sprites.bmp',
    margin : 2,
    tileMargin : 2,
    tileWidth : 32,
    tileHeight : 32
  });

  var map = new TileMap(myScreen, tiles);
  map.loadMap(window.map_data);
  
 var mtiles = new TileSet(mini, {image :'sprites.bmp', margin : 2, tileMargin : 2, tileWidth : 32, tileHeight : 32 });
  var miniMap = new TileMap(mini, mtiles);

//  var player = new PlayerCharacter();

  $doodle.canvas('#myScreen');

  keyboard();

  window.myScreen = myScreen;
  window.sprites = tiles;
  window.map = map;

  var fps = document.getElementById('fps');
  var scroll_x = document.getElementById('scroll_x');
  var scroll_y = document.getElementById('scroll_y');
  var tile_info = document.getElementById('tile_type');

  player.x = Math.floor((myScreen.width / (sprites.tileWidth) / 2) * sprites.tileWidth );
  player.y = Math.floor((myScreen.height / (sprites.tileWidth) / 2) * sprites.tileWidth );

  mini.draw(function () {
    var ctx = this.context;
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect (0, 0, this.width, this.height);

    miniMap.draw();

    ctx.fillStyle = "rgb(0,0,200)";
    ctx.fillRect(32, 32, 32, 32);
  });

  myScreen.draw(function () {

//    checkBoundries();
//  console.log(map.y);
    var tile_size = (tiles.tileWidth * map.zoom);
    
    map.old.x = map.x;
    map.old.y = map.y;

    if (map.velocity.x > tile_size) {
      map.velocity.x = tile_size;
    }

    if (map.velocity.y > tile_size) {
      map.velocity.y = tile_size;
    }

    map.x = map.x + map.velocity.x;
    map.y = map.y + map.velocity.y;

    var offset_x = 0//(map.x % tile_size);
    var offset_y = ((map.y % tile_size) * -1);

    map.scroll.x = Math.floor(((map.x * -1) + offset_x) / tile_size);
    map.scroll.y = Math.floor(((map.y * -1) - offset_y) / tile_size);

    player.map.x = map.scroll.x + Math.floor((this.width / tile_size) / 2);
    player.map.y = map.scroll.y + Math.floor((this.height / tile_size) / 2);

    var current_tiles = map.getSection(player.map.x - 1, player.map.y - 1, 4, 4);
    miniMap.loadMap({data : current_tiles});

    if (current_tiles[1][1] !== 0) {
      map.y = map.old.y;
      map.x = map.old.x;
      map.velocity.y = 0;
      map.velocity.x = 0;
    }

/*    if (current_tiles[1][2] !== 0 && map.velocity.x < 0) {
      map.velocity.x = 0;
      map.x = map.old.x;
    }

  if (current_tiles[1][0] !== 0 && map.velocity.x > 0) {
    map.velocity.x = 0;
    map.x = map.old.x;
  }
  */

/*  if (current_tiles[2][0] !== 0) {
    if (map.velocity.x > 0 && map.velocity.y < 0) {
      map.velocity.x = 0;
      map.x = map.old.x;
      map.y = map.y
    }  
  }*/

  if (current_tiles[2][1] === 0) {
    map.velocity.y = map.velocity.y - map.gravity;
  } else if (map.velocity.y < 0){
    map.velocity.y = 0;
    map.y = map.y - (map.y % tile_size);
   
  } else {
    if (map.velocity.x > 0) {
      map.velocity.x = map.velocity.x - 1;
    } else if (map.velocity.x < 0){
      map.velocity.x = map.velocity.x + 1;
    }
  }

  this.canvas.clear();
  map.draw();
        

  $doodle.rect({
    x:(player.map.x - map.scroll.x) * (tiles.tileWidth),
    y:(player.map.y - map.scroll.y) * (tiles.tileWidth),
    width:(sprites.tileWidth * map.zoom), height : (sprites.tileHeight * map.zoom) ,fill : 'red'}).draw();

  scroll_x.innerHTML = map.scroll.x;

  scroll_y.innerHTML = map.scroll.y;
  tile_info.innerHTML = current_tiles[2][1];
  fps.innerHTML = this.fps;
  
  });

  window.setTimeout(function () {
    myScreen.start();
    mini.start();
  }, 500);
};


/// 

var keyboard = function () {
  var keys = {37 : 'left', 38 : 'up', 39 : 'right', 40 : 'down', 61 : 'plus', 109 : 'minus'};
  document.addEventListener('keydown', function (e) {
    if (e.keyCode in keys) {
      switch (keys[e.keyCode]) {
        case 'left':
          map.velocity.x = 3;
          break;
        case 'right':
          map.velocity.x = -3;
          break;
        case 'up':
          map.velocity.y = 20;
          break;
        case 'down':
//          map.velocity.y = map.velocity.y - 1;
          break;
        case 'plus': 
          map.zoom++;
//    myScreen.context.getImageData(0, 0, 50, 50);
          break;
        case 'minus':
          map.zoom--;
          break;
      }
    }
  }, false);


};

window.map_data = {
  gravity : 1,
  old : {x : 0, y : 0},
  x : 0,
  y : 0,
  zoom : 1,
  scroll : {x : 0, y : 0},
  velocity : {x : 0, y : 0},
  data : [
    [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [9, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 12, 13, 11, 13, 11, 13, 14, 15, 16, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 13, 14, 15, 16, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
    [9, 9, 9, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 9, 9],
    [9, 9, 9, 9, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9],
    [8, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9],
    [7, 9, 9, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 , 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9],
    [8, 9, 11, 14, 13, 14, 11, 13, 14, 11, 13, 11, 14, 11, 13, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 9],
    [7, 8, 9, 7, 9, 9, 9, 8, 8, 9, 8, 8, 9, 8, 9, 8, 9, 9, 9, 9, 9, 9, 9, 9, 8, 7, 9, 7, 8, 6, 8, 6, 8]
  ]
};
