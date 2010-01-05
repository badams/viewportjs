// this function gets called when the document is ready.
function startDemo() {

  // create a new viewport (800x600 named "basic")
  var viewport = new ViewPort('basic', 800, 600);

  // create an object to keep track of our coords
  var ball = {x : 100, y : 100, vel_x : 4, vel_y : 6,radius : 10};

  // in order to use doodle on our viewport we need to 
  // point it to the canvas element that viewport created.
  $doodle.canvas('#basic');

  viewport.draw(function () {

    // check boundries
    if ((this.width - ball.radius) < ball.x || (ball.x - ball.radius) < 0) {
      ball.vel_x = ball.vel_x * -1;
    }

    if ((this.height - ball.radius) < ball.y || (ball.y - ball.radius) < 0) {
      ball.vel_y = ball.vel_y * -1;
    }

    ball.x += ball.vel_x; 
    ball.y += ball.vel_y;

    this.canvas.clear(); // clear the screen.

    // this draws a circle where the 'player' should be. 
    $doodle.circle({x : ball.x, y : ball.y, radius : ball.radius, fill : 'red'}).draw();
  });

  viewport.start(); // nothing happens until this gets called
};
