Node bindings for [Gestureworks Core](http://gestureworks.com).  Currently only Windows hosts are supported.

The init function *must* be called before any other commands.  It will load the DLL and the GML files and kick off the internal event loop.

    var gestureworks = require("gestureworks");
    gestureworks.init(
      'path/to/GestureworksCore.dll',
      'path/to/gestures.gml',
      1024, // viewport width
      768   // viewport height
    );

Most of the [Core API](http://wiki.gestureworks.com/index.php/GestureWorksCore:GestureWorks_Core_API_Reference) is supported unmodified, with the following exceptions.
* All object keys use camelCase instead of snake_case, in keeping with node's standard coding style
* `loadGML()` and `initializeGestureWorks()` are called in the `init()` function and do not have to be invoked separately.
* `registerWindowForTouch()` and `registerWindowForTouchByName()` are not supported.  Instead, you are expected to register touch points manually via `addEvent()`
* There is no explicit `processFrame()`, `consumePointEvents()`, or `consumeGestureEvents()`.  Instead, the bindings are an [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter) instance and will fire 'point' and 'gesture' events.

Additionally, the bindings include a socket.io powered server, available through the `serve()` method.  It accepts either a port number or an [http.Server](http://nodejs.org/api/http.html#http_class_http_server) instance, plus the same arguments as `init()`.

    var gestureworks = require("gestureworks");
    gestureworks.serve(
      8080, // port number or server
      'path/to/GestureworksCore.dll',
      'path/to/gestures.gml',
      1024, // viewport width
      768   // viewport height
    );