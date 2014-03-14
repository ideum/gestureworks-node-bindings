expect = require('chai').expect
gwcore = require('bindings')('gestureworks.node')

dll = require('path').resolve('tmp/GestureworksCore32.dll')
unless require('fs').existsSync(dll)
  console.error("You must place the GestureworksCore32.dll file into ./tmp for the tests to run")
  process.exit(1)

gwcore.loadGestureWorks(dll)
gwcore.initializeGestureWorks(1,1)

process.on 'uncaughtException', (err) ->
  console.log(err.stack);
  throw err;

describe "Gestureworks Core", ->
  it "should return an empty set if no points are registered", ->
    gwcore.processFrame()
    points = gwcore.consumePointEvents()
    expect(points).to.be.empty

  it "should return registered points", ->
    gwcore.addEvent status: 1, id: 1, x: 100, y: 150
    gwcore.addEvent status: 0, id: 1, x: 105, y: 140

    gwcore.processFrame()
    points = gwcore.consumePointEvents()

    expect(points[0].pointId).to.equal(1)
    expect(points[0].position.x).to.equal(100)
    expect(points[0].position.y).to.equal(150)

  it "should not die when looping over empty frames", ->
    gwcore.processFrame()
    gwcore.consumePointEvents()
    gwcore.processFrame()
    gwcore.consumePointEvents()
