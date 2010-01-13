(function () {

  /**
   * TileMap Constructor, TileMap lets you create TileBased maps.
   *
   * @access public
   * @return object (TileMap instance)
   */
  this.TileMap = function (viewport, tileset) {

    this.coords = {x : 0, y: 0};
    this.scroll = {x : 0, y :0};
    this.velocity = {x : 0, y : 0};
    this.viewport = viewport;
    this.tileset = tileset; 
    this.zoom = 1;
    this.gravity = 1;
    this.x = this.coords.x;
    this.y = this.coords.y
    this.old = {x : 0, y: 0};
    this.objects = [];
    this.objectTypes = {};
    return this;
  };

  this.TileMap.prototype = {
    /**
     * returns a cropped section of map data based 
     * on the parameters.
     *
     * @access public
     * @return array
     */
    getSection : function (start_x, start_y, width, height) {    
      var data = [],
          map_data = this.data;

      for (var i = 0, row = start_y, row_count = start_y + height; row < row_count; row++, i++) {
        var map_row = map_data[row],
            data_row = data[i] = [];

        for (var ii = 0, col = start_x, col_count = start_x + width; col < col_count; col++, ii++) {
          data_row[ii] = map_row ? map_row[col] || 0 : 0;
        }
      }
      return data;
    },

    /**
     * Draws the visible parts of the map to the viewport.
     *
     * @access public
     * @return void
     */
    draw : function () {

/*      var tile_size = this.tileset.tileWidth * this.zoom,
          data = this.getSection(map.scroll.x - 1, map.scroll.y - 1, (this.viewport.width / tile_size) + 2, (this.viewport.width / tile_size) + 2);

      for (var row = 0, row_count = data.length; row < row_count; row++) {
        var data_row = data[row];
        for (col = 0, col_count = data_row.length; col < col_count; col++) {
          this.tileset.drawTile(data_row[col], 3, (col * tile_size), (row * tile_size), this.zoom);
        }
      }
*/
      var map = this,
          zoom = map.zoom,
          tiles = this.tileset,
          vp = this.viewport;

      var tile_size = (tiles.tileWidth * this.zoom);

      var startY = map.scroll.y - 1 > 0 ? map.scroll.y -1 : 0;
      var startX = map.scroll.x - 1 > 0 ? map.scroll.x -1 : 0;

      var endX = startX + (800 / (tiles.tileWidth * map.zoom) + 2);
      var endY = startY + (600 / (tiles.tileHeight * map.zoom) + 2);

      endX = map.data[0].length > endX ? endX : map.data[0].length; 
      endY = map.data.length > endY ? endY : map.data.length; 
  
      for (var i = 0, row = startY, rows = endY; row < rows; row++, i++) {
        for (var ii = 0, col = startX, cols = endX; col < cols; col++, ii++) {
          tiles.drawTile(map.data[row][col], 3, (map.x) + (col * tile_size), map.y + (row * tile_size), this.zoom);
//          console.log(map.y);
         // this.viewport.stop();
        }
      }
    },

    /**
     *
     * @access public
     * @param object
     */
    loadMap : function (map_object) {

      this.data = map_object.data;

      if (undefined !== map_object.objectTypes) {
        for (var prop in map_object.objectTypes) {
          this.objectTypes[prop] = map_object.objectTypes[prop];
        }  
      }
    },

    /**
     * Centers the map to a position. 
     *
     * @access public
     */
    setCenter : function () {},

    pointIsVisible : function () {},
    pointIsOnMap : function () {},

    spawnObject : function (props) {
      var obj = new this.GameObject();

      if (typeof props === 'string') {
        if (undefined !== this.objectTypes[props]) {
          props = this.objectTypes[props]
        } else {
          props = this.objectTypes['default'];
        }
      }

      if (typeof props === 'object') {
        for (var prop in props) {
          obj[prop] = props[prop];
        }
      }

      //spawn object on player
      obj.x = window.player.x;
      obj.y = window.player.y - 32;
      
      obj.id = this.objects.length;

      this.objects.push(obj);

    },

    updateObjects : function () {
      var objs = this.objects;
      for (var i = 0, l = objs.length; i < l; i++) {
        var obj = objs[i];

        if (typeof obj.update === 'function') {
          obj.update();
        }

        obj.map_x = this.scroll.x + (obj.x / this.tileset.tileWidth) >> 0; //FIXME, these coords are wrong.
        obj.map_y = this.scroll.y + (obj.y / this.tileset.tileWidth) >> 0;

        obj.old_x = obj.x;
        obj.old_y = obj.y;

        obj.x += obj.vel_x;
        obj.y += obj.vel_y;

        if (true === obj.gravity && 0 < this.gravity) {
          obj.vel_y += this.gravity;
        }

        if (true === obj.collision) {
          this.collisionCheck(obj);
        }
      }
    },

    drawObjects : function () {
      var objs = this.objects;
      for (var i = 0, l = objs.length; i < l; i++) {
        this.tileset.drawTile(12, 9, objs[i].x, objs[i].y, 1);
      }
    },

    collisionCheck : function (obj) {
      var tiles = this.getSection(obj.map_x - 1, obj.map_y - 1, 3, 3);
      miniMap.loadMap({data : tiles});

        if (tiles[1][1] !== 0) {
          obj.y = obj.old_y;
          obj.x = obj.old_x;

          obj.vel_y = 0;
          obj.vel_x = 0;
        }

        if (tiles[1][2] !== 0 && obj.vel_x > 0) {
          obj.vel_x = 0;
        }

        if (tiles[2][1] !== 0) {
          obj.vel_y = 0;
          obj.y = obj.old_y;
          if (obj.vel_x > 0) {
            obj.vel_x -= obj.friction;
          } else if (obj.vel_x < 0) {
            obj.vel_x += obj.friction;
          }
        }

        if (tiles[0][1] !== 0 && tiles[0][2] && obj.vel_y < 0) {
          obj.vel_y = obj.vel_y * -1;
        }
    }

  };

  
  this.TileMap.prototype.GameObject = function () {

    this.x = 0;
    this.y = 0;
    this.old_x = 0;
    this.old_y = 0;
    this.map_x = 0;
    this.map_y = 0
    this.vel_x = 0;
    this.vel_y = 0;
    this.width = 0;
    this.height = 0;
    this.friction = 1;
    this.gravity = true;
    this.collision = true;

    return this;
  };

}).call(window);
