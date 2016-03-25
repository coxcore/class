/**
 * 외부 인스턴스와 연결하는 Class
 *
 * @class
 * @extends EventDispatcher
 * @author cox.ascript
 */
cox.define('cox.controls.Adapter', function(ns) {
    "use strict";

    // 의존모듈
    var EventDispatcher = ns.module('cox/events.EventDispatcher');

    return {

        /**
         * Super Class
         */
        __extends: EventDispatcher,


        /**
         * 생성자
         *
         * @constructor
         */
        constructor: function Adapter() {
        },


        /**
         * 외부 instance에 event listener 등록
         * listeners를 { change: function(e, data) {} } 형태로 전달하면,
         * 'change' 이벤트에 listener를 등록한다.
         *
         * @public
         * @method
         * @param DataType instance의 데이터 타입
         * @param instance
         * @param listeners
         * @returns {object} 데이터 타입이 일치하면 instance, 그렇지 않으면 null
         */
        addAdapter: function(DataType, instance, listeners) {
            var prop;

            // DataType을 전달하지 않으면 DataType을 체크하지 않는다.
            if (!DataType || ns.isInstance(instance, DataType)) {
                for (prop in listeners) {
                    if (listeners.hasOwnProperty(prop)) {
                        instance.on(prop, listeners[prop]);
                    }
                }

                return instance;
            } else if (instance) {
                throw new Error('Invalid instance data type.');
            }

            return null;
        },


        /**
         * 외부 instance에 event listener 제거
         *
         * @public
         * @method
         * @param instance
         * @param listeners
         */
        removeAdapter: function(instance, listeners) {
            var prop;

            if (instance) {
                for (prop in listeners) {
                    if (listeners.hasOwnProperty(prop)) {
                        instance.off(prop, listeners[prop]);
                    }
                }
            }
        }

    };

});
