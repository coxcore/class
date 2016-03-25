/**
 * Event를 관리하는 Class
 *
 * @class
 * @author cox.ascript
 */
cox.define('cox.events.EventDispatcher', function(ns) {
    "use strict";

    var getIndex = function(val, index, listener) {
        if (val === listener) {
            return index;
        }
    };

    var triggerEvent = function(listener, index, event) {
        listener.call(event.target, event);
    };

    var setDispatcher = function(ins) {
        var listeners = {};

        ins.on = function(event, listener) {
            var lis;

            if (!ns.isString(event) || !ns.isFunction(listener)) {
                return false;
            }

            lis = listeners[event];

            if (!lis) {
                listeners[event] = [listener];
                return true;
            }

            if (ns.each(lis, getIndex, listener) === undefined) {
                lis.push(listenenr);
                return true;
            }

            return false;
        };

        ins.off = function(event, listener) {
            var lis = listeners[event];
            var idx;

            if (!lis) {
                return false;
            }

            if (ns.isFunction(listener)) {
                idx = ns.each(lis, getIndex, listener);

                if (idx !== undefined) {
                    lis.splice(idx, 1);
                    return true;
                }
            } else {
                listeners[event] = null;
                return true;
            }

            return false;
        };

        ins.trigger = function(event, data) {
            var lis;

            if (ns.isString(event)) {
                event = {
                    type: event,
                    data: data
                };
            } else if (!ns.isObject(event)) {
                return;
            }

            event.target = ins;

            lis = listeners[event.type];

            if (ns.isArray(lis)) {
                ns.each(lis, triggerEvent, event);
            }
        };
    };
    
    return {

        /**
         * 생성자
         *
         * @constructor
         */
        constructor: function EventDispatcher() {
            setDispatcher(this);
        },


        /**
         * Event Listener 등록
         *
         * @public
         * @method
         * @param event
         * @param listener
         */
        on: null,


        /**
         * Event Listener 제거
         *
         * @public
         * @method
         * @param event
         * @param listener
         */
        off: null,


        /**
         * Event 생성
         *
         * @public
         * @method
         * @param event
         * @param data 이벤트 data
         */
        trigger: null,


        /**
         * listener의 현재 context를 instance로 지정
         *
         * @public
         * @method
         * @param listeners
         * @returns {object}
         */
        setProxy: function(listeners) {
            var lis;
            var prop;

            if (ns.isNull(listeners)) {
                return;
            }

            lis = {};

            for (prop in listeners) {
                if (listeners.hasOwnProperty(prop)) {
                    lis[prop] = ns.proxy(this, listeners[prop]);
                }
            }

            return lis;
        }

    };

});
