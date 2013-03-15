var gestureworks =  require('./index');

exports.init = function (server) {
  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function (socket) {
    var touchObjects = [];

    socket.on('disconnect', function () {
      touchObjects.forEach(function(name) {
        gestureworks.deregisterTouchObject(name);
      });
      touchObjects = [];
    });

    socket.on('resizeWindow', function (data) {
      gestureworks.resize(data);
    });

    socket.on('touchevent', function (data) {
      gestureworks.emit('touch', data);
    });

    socket.on('registerTouchObject', function (name) {
      touchObjects.push(name);
      gestureworks.registerTouchObject(name);
    });

    socket.on('assignTouchPoint', function (name, pointId) {
      gestureworks.assignTouchPoint(name, pointId);
    });

    socket.on('addGesture', function (target, gesture) {
      gestureworks.addGesture(target, gesture);
    });

    gestureworks.on('point', function (data) {
      socket.emit('point', data);
      socket.emit('point' + data.status, data);
    });

    gestureworks.on('gesture', function (data) {
      socket.emit('gesture', data);
    });
  });
}