function Level(plan) {
  // Use the length of a single row to set the width of the level
  this.width = plan[0].length;
  // Use the number of rows to set the height

  this.height = plan.length;

  // Store the individual tiles in our own, separate array
  this.grid = [];

  // Loop through each row in the plan, creating an array in our grid
  for (var y = 0; y < this.height; y++) {
    var line = plan[y], gridLine = [];

    // Loop through each array element in the inner array for the type of the tile
    for (var x = 0; x < this.width; x++) {
      // Get the type from that character in the string. It can be 'x', '!' or ' '
      // If the character is ' ', assign null.

      var ch = line[x], fieldType = null;

      // Use if and else to handle the two cases
      if (ch == "x")
        fieldType = "wall";
      // Because there is a third case (space ' '), use an "else if" instead of "else"
      else if (ch == "!")
        fieldType = "lava";
      // lab fives floater
      else if (ch == "y")
        fieldType = "floater";
      else if (ch == "@")
        this.player = new Player(new Vector(x, y));

      // "Push" the fieldType, which is a string, onto the gridLine array (at the end).
      gridLine.push(fieldType);
    }
    // Push the entire row onto the array of rows.
    this.grid.push(gridLine);
  }
}

//Vector arithmetic: v_1 + v_2 = <x, y> + <a, b> = <x+a, y+b>

function Vector(x, y){
  this.x = x;
  this.y = y;
}

Vector.prototype.plus = function(other) {
  var addVector = new Vector(0,0);
  addVector.x = this.x + other.x;
  addVector.y = this.y + other.y;

  return addVector;
}

//Vector arithmetic: v_1 * factor = <x, y> * factor = <x*factor, y*factor>
Vector.prototype.times = function(factor) {
  return new Vector(this.x*factor, this.y*factor);
}

// Helper function to easily create an element of a type provided
// and assign it a class.
//player has a size, speed, and position
function Player (pos) {
  this.pos = pos.plus(new Vector(0, -0.5));
  this.size = new Vector(0.8, 1.5);
  this.speed = new Vector(0, 0);
}

function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}

// Main display class. We keep track of the scroll window using it.
function DOMDisplay(parent, level) {

// this.wrap corresponds to a div created with class of "game"
  this.wrap = parent.appendChild(elt("div", "game"));
  this.level = level;

  // In this version, we only have a static background.
  this.wrap.appendChild(this.drawBackground());
}

var scale = 20;

//Arrow key codes for readability
var arrowCodes = {37: 'left', 38: 'up', 39: 'right', 40 'down'};
//this assigns the object that will be updated anytime the player
//presses an arrow key
var arrows = trackKeys(arrowCodes);

//Translate the codes pressed from a key event
function trackKeys(codes){
  var pressed = {};

  //alters the current 'pressed' array which is returned from this
  //function. The pressed variable persists even after this function terminates
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = (event.Type == 'keydown');
      pressed[codes[event.keyCode]] = down;

      //We dont want the key press to scroll the browser window
      //this stops the event from continuing to be processed
      event.preventDefault();
      console.log(pressed);
      console.log(arrows);
    }
  }
  addEventListener('keydown', handler);
  addEventListener('keyup', handler);
  return pressed;
}

//Draw the player agent
DOMDisplay.prototype.drawPlayer = function() {
  //Create a new container div for actor dom elements
  var wrap = elt('div');

  var actor = this.level.player;
  var rect = elt('div', 'actor player');
  rect = wrap.appendChild(rect);

  rect.style.width = actor.size.x * scale + 'px';
  rect.style.height = actor.size.y * scale + 'px';
  rect.style.left = actor.pos.x * scale + 'px';
  rect.style.top = actor.pos.y * scale + 'px';

  return wrap;
}

DOMDisplay.prototype.drawBackground = function() {
  var table = elt("table", "background");
  table.style.width = this.level.width * scale + "px";

  // Assign a class to new row element directly from the string from
  // each tile in grid
  this.level.grid.forEach(function(row) {
    var rowElt = table.appendChild(elt("tr"));
    rowElt.style.height = scale + "px";
    row.forEach(function(type) {
      rowElt.appendChild(elt("td", type));
    });
  });
  return table;
};

// Organize a single level and begin animation
function runLevel(level, Display) {
  var display = new Display(document.body, level);

  display.actorLevel = display.wrap.append(display.drawPlayer());
}

function runGame(plans, Display) {
  function startLevel(n) {
    // Create a new level using the nth element of array plans
    // Pass in a reference to Display function, DOMDisplay (in index.html).
    runLevel(new Level(plans[n]), Display);
  }
  startLevel(0);
}
