var childProcess = require('child_process');

exports.init = function (server) {
  var io = require('socket.io').listen(server);
  io.set('transports', ['websocket', 'flashsocket']);
  var initData = Array.prototype.slice.call(arguments, 1);

  io.sockets.on('connection', function (socket) {
    var child = childProcess.fork(__dirname + '/child.js');
    child.send({ method: 'init', arguments: initData });

    socket.on('disconnect', function () {
      child.disconnect();
    });

    socket.on('resizeScreen', function (x, y) {
      child.send({ method: 'resizeScreen', arguments: [x, y] });
    });

    socket.on('touchevent', function (data) {
      child.send({ event: 'touch', data: data });
    });

    socket.on('registerTouchObject', function (name) {
      child.send({ method: 'registerTouchObject', arguments: [name] });
    });

    socket.on('assignTouchPoint', function (name, pointId) {
      child.send({ method: 'assignTouchPoint', arguments: [name, pointId] });
    });

    socket.on('addGesture', function (target, gesture) {
      child.send({ method: 'addGesture', arguments: [target, gesture] });
    });

    child.on('message', function(m) {
      switch (m.type) {
      case 'point':
        socket.emit('point', m.data);
        socket.emit('point' + m.data.status, m.data);
        break;
      case 'gesture':
        socket.emit('gesture', m.data);
        break;
      }
    });
  });
}