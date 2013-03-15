#include <node.h>
#include <v8.h>
#include "gwc/GWCUtils.h"
#include "gwc/GestureworksCore.h"
#include "cvv8/v8-convert.hpp"
#include "src/conversions.hpp"

using namespace v8;

#define WRAP_FUNCTION(name, type, args) Set(\
	String::NewSymbol(#name), FunctionTemplate::New(\
		cvv8::FunctionToInCa<type args, name>::Call)->GetFunction());

Handle<Value> GWC_AddEvent(const Arguments& args) {
	HandleScope scope;
	Local<Object> obj = args[0]->ToObject();

	int id = obj->Get(String::NewSymbol("id"))->NumberValue();
	double x = obj->Get(String::NewSymbol("x"))->NumberValue();
	double y = obj->Get(String::NewSymbol("y"))->NumberValue();
	int status = obj->Get(String::NewSymbol("status"))->NumberValue();

	gwc::touchpoint tp;
	tp.status = (gwc::touchStatus)status;
	tp.init(id, x, y, 0, 1, 1);
	addEvent(tp);

	return scope.Close(Undefined());
}

void init(Handle<Object> target) {
	target->WRAP_FUNCTION(loadGestureWorks, int, (std::string));
	target->WRAP_FUNCTION(initializeGestureWorks, void, (int, int));
	target->WRAP_FUNCTION(resizeScreen, void, (int, int));
	target->WRAP_FUNCTION(processFrame, void, (void));
	target->WRAP_FUNCTION(consumePointEvents, std::vector<gwc::PointEvent>, (void));
	target->WRAP_FUNCTION(consumeGestureEvents, std::vector<gwc::GestureEvent>, (void));
	target->WRAP_FUNCTION(registerWindowForTouchByName, bool, (std::string));
	target->WRAP_FUNCTION(registerTouchObject, void, (std::string));
	target->WRAP_FUNCTION(assignTouchPoint, bool, (std::string, int));
	target->WRAP_FUNCTION(loadGML, bool, (std::string));
	target->WRAP_FUNCTION(addGesture, bool, (std::string, std::string));
	target->WRAP_FUNCTION(addGestureSet, bool, (std::string, std::string));
	target->WRAP_FUNCTION(removeGesture, bool, (std::string, std::string));
	target->WRAP_FUNCTION(removeGestureSet, bool, (std::string, std::string));
	target->WRAP_FUNCTION(enableGesture, bool, (std::string, std::string));
	target->WRAP_FUNCTION(disableGesture, bool, (std::string, std::string));
	target->WRAP_FUNCTION(deregisterTouchObject, bool, (std::string));
	target->Set(String::NewSymbol("addEvent"),
	            FunctionTemplate::New(GWC_AddEvent)->GetFunction());
}
NODE_MODULE(gestureworks, init)