var gwcore = require('bindings')('gestureworks.node');

var EventEmitter = require('events').EventEmitter;
var gestureworks = module.exports = new EventEmitter();

var xScale, yScale;

gestureworks.init = function(dllPath, gmlPath, x, y) {
  var path = require('path');
  var success;

  success = gwcore.loadGestureWorks(path.resolve(dllPath));
  if (success !== 0) throw "GestureWorks DLL could not be loaded";

  success = gwcore.loadGML(path.resolve(gmlPath));
  if (!success) throw "GML could not be loaded";

  xScale = x;
  yScale = y;
  gwcore.initializeGestureWorks(xScale, yScale);

  eventLoop();
};

gestureworks.resize = function(options) {
  if (options.width) xScale = parseInt(options.width, 10);
  if (options.height) yScale = parseInt(options.height, 10);
  gwcore.resizeScreen(xScale, yScale);
}

gestureworks.on('touch', function (touchEvent) {
  switch (touchEvent.type) { // match against touchStatus enum
    case 'touchstart': touchEvent.status = 1; break;
    case 'touchmove':  touchEvent.status = 0; break;
    case 'touchend':   touchEvent.status = 2; break;
  }

  touchEvent.id = touchEvent.identifier;

  touchEvent.x /= xScale;
  touchEvent.y /= yScale;

  gwcore.addEvent(touchEvent);
});

function eventLoop () {
  // run the loop at ~120Hz
  setTimeout(eventLoop, (1000 / 120));

  gwcore.processFrame();

  gwcore.consumePointEvents().forEach(function(pointEvent) {
    switch(pointEvent.status) {
      case 0: pointEvent.status = 'move';  break;
      case 1: pointEvent.status = 'start'; break;
      case 2: pointEvent.status = 'end';   break;
    }
    gestureworks.emit('point', pointEvent);
  });

  gwcore.consumeGestureEvents().forEach(function(gestureEvent) {
    gestureworks.emit('gesture', gestureEvent);
  });
}

gestureworks.registerWindowForTouchByName = gwcore.registerWindowForTouchByName
gestureworks.registerTouchObject = gwcore.registerTouchObject
gestureworks.assignTouchPoint = gwcore.assignTouchPoint
gestureworks.loadGML = gwcore.loadGML
gestureworks.addGesture = gwcore.addGesture
gestureworks.addGestureSet = gwcore.addGestureSet
gestureworks.removeGesture = gwcore.removeGesture
gestureworks.removeGestureSet = gwcore.removeGestureSet
gestureworks.enableGesture = gwcore.enableGesture
gestureworks.disableGesture = gwcore.disableGesture
gestureworks.deregisterTouchObject = gwcore.deregisterTouchObject
gestureworks.addEvent = gwcore.addEvent