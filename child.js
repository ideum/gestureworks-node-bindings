var gestureworks = require('./index');

process.on('message', function (m) {
  if (m.event != null) {
    gestureworks.emit(m.event, m.data);
  } else if (m.method != null && m.arguments != null) {
    gestureworks[m.method].apply(gestureworks, m.arguments);
  }
});

gestureworks.on('point', function (data) {
  process.send({ type: 'point', data: data });
});

gestureworks.on('gesture', function (data) {
  process.send({ type: 'gesture', data: data });
});
