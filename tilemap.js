(function () {

  /**
   * TileMap Constructor, TileMap lets you create TileBased maps.
   *
   * @access public
   * @return object (TileMap instance)
   */
  this.TileMap = function (viewport, tileset) {

    this.scroll = {x : 0, y :0};
    this.viewport = viewport;
    this.tileset = tileset; 
    this.zoom = 1;
    this.gravity = 1;
    this.x = 0;
    this.y = 0;
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

      var tile_size = this.tileset.tileWidth * this.zoom,
          data = this.getSection(this.scroll.x, this.scroll.y, (this.viewport.width / tile_size) + 1, (this.viewport.width / tile_size) + 1)
          offset_x = this.x % tile_size, 
          offset_y = this.y % tile_size;

      for (var row = 0, row_count = data.length; row < row_count; row++) {
        var data_row = data[row];
        for (var col = 0, col_count = data_row.length; col < col_count; col++) {
          this.tileset.drawTile(data_row[col], 4, offset_x + (col * tile_size), offset_y + (row * tile_size), this.zoom);
        }
      }
    },

    /**
     *
     * @access public
     * @param object
     */
    loadMap : function (map) {

      this.data = map.data;

      /**
       * if an objectTypes property exists on the map, load those objects
       * into the map.
       */
      if (undefined !== map.objectTypes) {
        for (var prop in map.objectTypes) {
          this.objectTypes[prop] = map.objectTypes[prop];
        }  
      }

      /**
       * if an array called "objects" is detected, iterate through it
       * and spawn any defined objects.
       */
      if (undefined !== map.objects) {
        for (var o = 0, l = map.objects.length; o < l; o++) {
          var mo = map.objects[o];
          this.spawnObject(mo.type, mo.x, mo.y);
        }
      }
    },

    /**
     * Scrolls to a given point on the map.
     *
     * @access public
     */
    follow : function (obj) {
      
      var tile_size = this.tileset.tileWidth;      
      var sWidth = this.viewport.width / tile_size >> 0;
      var sHeight = this.viewport.height / tile_size >> 0;  
      var x = obj.map_x - sWidth / 2 >> 0;
      var y = obj.map_y - sHeight / 2 >> 0;

/*      if (obj.map_x < this.scroll.x || obj.map_x > this.scroll.x + sWidth) {
        this.x = (x * -1) * tile_size;      
      }*/

/*      if (obj.map_y < this.scroll.y || obj.map_y > this.scroll.y + sHeight) {
      this.y = (y * -1) * tile_size;      
      }*/

      if (x > 0 && x < (this.data[0].length + 1) - sWidth) {
        this.x = this.x - obj.vel_x;
      }

      if (y > this.scroll.y && this.scroll.y < this.data.length - (sHeight + 1)) {
        this.y -= 3;
      }

      if (y < this.scroll.y && this.scroll.y > -1) {
        this.y += 3;
      }

      if (this.x > 0) {
        this.x = 0;
      }

      if (this.y > 0) {
        this.y = 0;
      }

    },

    center : function () {},
    pointIsVisible : function () {},
    pointIsOnMap : function () {},

    /**
     *
     * @access public
     * @return void
     */
    spawnObject : function (props, x, y) {
      var obj = new this.GameObject();

      /**
       * if props is a string check if there are any object 
       * types by that name, if one exists; use it for this object, 
       * if not attempt to use 'default'.
       */
      if (typeof props === 'string') {
        if (undefined !== this.objectTypes[props]) {
          props = this.objectTypes[props]
        } else {
          props = this.objectTypes['default'];
        }
      }

      if (typeof props.collision === 'function') {
        props._collision = props.collision;
        props.collision = true;
      }

      if (typeof props === 'object') {
        for (var prop in props) {
          obj[prop] = props[prop];
        }
      }

      obj.map_x = x || 0;
      obj.map_y = y || 0;

      obj.x = (obj.map_x * this.tileset.tileWidth) >> 0;
      obj.y = (obj.map_y * this.tileset.tileWidth) >> 0;

      obj.map = this;

      this.objects.push(obj);

      return obj;
    },

    removeObject : function (obj) {      
      this.objects.splice(this.objects.indexOf(obj), 1);
    },
    /**
     *
     */
    updateObjects : function () {
      var objs = this.objects;
      for (var i = 0, l = objs.length; i < l; i++) {
        var obj = objs[i];

        if (typeof obj.update === 'function') {
          obj.update();
        }

        obj.map_x = obj.x / this.tileset.tileWidth >> 0;
        obj.map_y = obj.y / this.tileset.tileWidth >> 0; 

        obj.old_x = obj.x;
        obj.old_y = obj.y;

        obj.x += obj.vel_x;
        obj.y += obj.vel_y;


        if (obj.gravity && 0 < this.gravity) {
          obj.vel_y += this.gravity;
        }

        if (obj.mapFollow) {
          this.follow(obj);
        }

        if (obj.collision) {
          this.collisionCheck(obj);
        }
      }
    },

    drawObjects : function () {
      var objs = this.objects;
      for (var i = 0, l = objs.length; i < l; i++) {
        this.tileset.drawTile(12, 9, this.x + objs[i].x, this.y + objs[i].y, 1);
      }
    },

    collisionCheck : function (obj) {

      var tiles = this.getNavigationData(obj), callback = null;

      miniMap.loadMap({data : tiles});

      if (typeof obj._collision === 'function') {
        var collision_ = [];
        callback = function () {
          obj._collision.apply(obj, arguments);
        }
      }

      if (tiles[0][1] !== 0 && obj.vel_y < 0) {
        obj.y = obj.old_y - (obj.old_y % 32);
        obj.vel_y = obj.vel_y * -1;
      }

      if (tiles[1][1] !== 0) {
        if (null === callback || false !== callback({data:tiles})) { 
          obj.y = obj.old_y;
          obj.x = obj.old_x;

          obj.vel_y = 0;
          obj.vel_x = 0;
        }
      }

    /*  if ((0 !== tiles[1][0] || 0 !== tiles[1][2]) && obj.vel_x !== 0) {
          obj.vel_x = 0;
          obj.x = obj.old_x;
      }*/

      if (tiles[2][1] !== 0) {          
        if (null === callback || false !== callback({data:tiles, type : 'south'})) {
          obj.vel_y = 0;
          obj.y = obj.old_y - (obj.old_y % 32);
          if (obj.vel_x > 0) {
            obj.vel_x -= obj.friction;
          } else if (obj.vel_x < 0) {
            obj.vel_x += obj.friction;
          }
        }
      }

      if (tiles[0][1] !== 0 && tiles[0][2] && obj.vel_y < 0) {               
        if (null === callback || false !== callback({data:tiles})) {
          obj.vel_y = obj.vel_y * -1;
        }
      }
    },

    getNavigationData : function (obj) {
      var tiles = this.getSection(obj.map_x - 1, obj.map_y - 1, 3, 3);

      if (obj.objectCollision) {
        for (var i = 0, l = this.objects.length; i < l; i++) {
          if (i !== this.objects.indexOf(obj)) {
            var o = this.objects[i];

            if (obj.map_x === o.map_x && obj.map_y === o.map_y) {
              tiles[1][1] = 1;
            }
                        
            if ((obj.map_y + 1) === o.map_y && obj.map_x === o.map_x) {
              tiles[2][1] = 1;
            }

            if ((obj.map_x + 1) === o.map_x && obj.map_y == o.map_y) {
              tiles[1][2] = 1;
            }

          }
        }
      }
  
      return tiles;
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
    this.objectCollision = true;

    return this;
  };

}).call(window);
