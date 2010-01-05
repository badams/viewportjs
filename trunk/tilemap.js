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
    },

    /**
     * Centers the map to a position. 
     *
     * @access public
     */
    setCenter : function () {},
  };
}).call(window);
