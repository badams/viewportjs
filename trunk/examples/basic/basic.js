// this function gets called when the document is ready.
function startDemo() {

  // create a new viewport (800x600 named "basic")
  var viewport = new ViewPort('basic', 800, 600);

  // create an object to keep track of our coords
  var player = {x : 100, y : 100};

  // in order to use doodle on our viewport we need to 
  // point it to the canvas element that viewport created.
  $doodle.canvas('#basic');

  viewport.draw(function () {
    // this draws a circle where the 'player' should be. 
    $doodle.circle({x : player.x, y : player.y, radius : 10, fill : 'red'}).draw();
  });

  viewport.start();
};
