(function () {

  /**
   * ViewPort Constructor.
   * 
   * @access public
   * @param string; canvas id
   * @param int
   * @param int
   * @return object
   */
  this.ViewPort = function (id, width, height) {  
    this.width = width;
    this.height = height;
    this.canvas = createViewPort(id, width, height);
    this.context = this.canvas.getContext('2d');
    this.interval = null;

    return this;
  };

  this.ViewPort.prototype  = {
    start : function () {
      var self = this;
      if (null === self.interval) {
        self.interval = setInterval(function () {
          self.fps = Math.ceil(1000 / (new Date().getTime() - self.last_render_timestamp))
          self.last_render_timestamp = new Date().getTime();
          self.onDraw.call(self);
        }, 10);
      }
    },
    stop : function () {
      window.clearInterval(this.interval);
      this.interval = null;
    },
    draw : function (fn) {
      this.onDraw = fn;
    }
  };

  /**
   * Creates a new canvas element in the viewport stack, 
   * if no stack exists one is created.
   *
   * @access private
   * @param string; canvas id
   * @param int
   * @param int
   */
  var createViewPort = function (id, width, height) {
  
    var port = document.createElement('canvas');

    port.setAttribute('id', id);
    port.setAttribute('width', width);
    port.setAttribute('height', height);
  
    var stack = document.getElementById('viewport-stack');

    if (null === stack) {
      stack = window.document.createElement('div');
      stack.setAttribute('id','viewport-stack');
      document.body.appendChild(stack);
    }

    stack.appendChild(port);
    return port;
  };

}).call(window);

