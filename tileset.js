(function () {

  this.TileSet = function (vp, options) {
    
    this.loadImage(options.image, function (img) {
      this.image = img;
    });

    this.viewport = vp;
    this.tileWidth = options.tileWidth;
    this.tileHeight = options.tileHeight;
    this.tileMargin = options.tileMargin || 0;
    this.margin = options.margin || 0;

    return this;
  };

  this.TileSet.prototype = {
    drawTile : function (sx, sy, x, y, zoom) {
      if (0 !== sx) {
        var srcX = (this.margin + (this.tileWidth * sx) + (this.tileMargin * sx)) >> 0;      
        var srcY = (this.margin + (this.tileHeight * sy) + this.tileMargin * sy) >> 0;
        var targetWidth = (this.tileWidth * zoom) >> 0;
        var targetHeight = (this.tileHeight * zoom) >> 0;
        this.viewport.context.drawImage(this.image, srcX, srcY, this.tileWidth, this.tileHeight, x, y, targetWidth, targetHeight);
      }
    },

    loadImage : function (src, callback) {
      var img = new Image(), self = this;
      img.src = src;
      img.onload = function () {
        callback.call(self, this);
      };
    }
  };

}).call(window);
