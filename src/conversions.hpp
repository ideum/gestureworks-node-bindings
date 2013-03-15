#include <v8.h>
#include "gwc/GWCUtils.h"
#include "cvv8/v8-convert.hpp"

using namespace v8;

namespace cvv8 {
	template <> struct NativeToJS<gwc::touchStatus>
		: NativeToJS<int32_t> {};

	template <> struct NativeToJS<float> : NativeToJS<double> {};

	template <> struct NativeToJS<gwc::Point> {
		Handle<Value> operator()( gwc::Point const p ) const {
			Local<Object> obj = Object::New();
			gwc::Point point(p);

			obj->Set(String::NewSymbol("x"), Number::New(point.getX()));
			obj->Set(String::NewSymbol("y"), Number::New(point.getY()));
			obj->Set(String::NewSymbol("z"), Number::New(point.getZ()));
			obj->Set(String::NewSymbol("w"), Number::New(point.getW()));
			obj->Set(String::NewSymbol("h"), Number::New(point.getH()));
			obj->Set(String::NewSymbol("r"), Number::New(point.getR()));

			return obj;
		}
	};

	template <> struct NativeToJS<gwc::PointEvent> {
		Handle<Value> operator()( gwc::PointEvent const pe ) const {
			Local<Object> obj = Object::New();

			obj->Set(String::NewSymbol("pointId"),   Number::New(pe.point_id));
			obj->Set(String::NewSymbol("status"),    CastToJS(pe.status));
			obj->Set(String::NewSymbol("position"),  CastToJS(pe.position));
			obj->Set(String::NewSymbol("timestamp"), Date::New(pe.timestamp));

			return obj;
		}
	};

	template <> struct NativeToJS<gwc::GestureEvent> {
		Handle<Value> operator()( gwc::GestureEvent const ge ) const {
			Local<Object> obj = Object::New();

			obj->Set(String::NewSymbol("ID"),           Number::New(ge.ID));
			obj->Set(String::NewSymbol("gestureType"),  CastToJS(ge.gesture_type));
			obj->Set(String::NewSymbol("gestureId"),    CastToJS(ge.gesture_id));
			obj->Set(String::NewSymbol("target"),       CastToJS(ge.target));
			obj->Set(String::NewSymbol("source"),       Number::New(ge.source));
			obj->Set(String::NewSymbol("n"),            Number::New(ge.n));
			obj->Set(String::NewSymbol("holdN"),        Number::New(ge.hold_n));
			obj->Set(String::NewSymbol("x"),            Number::New(ge.x));
			obj->Set(String::NewSymbol("y"),            Number::New(ge.y));
			obj->Set(String::NewSymbol("timestamp"),    Date::New(ge.timestamp));
			obj->Set(String::NewSymbol("phase"),        Number::New(ge.phase));
			obj->Set(String::NewSymbol("lockedPoints"), CastToJS(ge.locked_points));
			obj->Set(String::NewSymbol("values"),       CastToJS(ge.values));

			return obj;
		}
	};
};