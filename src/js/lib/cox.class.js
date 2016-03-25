/**
 * COXCORE Class - coxcore.com
 *
 * @author cox.ascript
 */
(function(factory) {

    if (typeof define === 'function' && define.amd) {
        define(function() {
            return this.cox = factory(this.cox || {});
        });
    } else {
        this.cox = factory(this.cox || {});

        if (typeof exports === 'object') {
            module.exports = this.cox;
        }
    }

})(function(ns) {
    "use strict";

    var slice = Array.prototype.slice;

    var forEach = function(arr, fnc, param) {
        var i;
        var len;
        var val;

        if (!isArray(arr) || !isFunction(fnc)) {
            return;
        }

        len = arr.length;

        for (i = 0; i < len; i++) {
            val = fnc.call(arr, arr[i], i, param);

            if (val !== undefined) {
                return val;
            }
        }
    };

    var isArray = Array.isArray || function(arr) {
        return arr instanceof Array;
    };

    var isFunction = function(fnc) {
        return typeof fnc === 'function';
    };

    var isNull = function(val) {
        return val === null || val === undefined;
    };

    var isString = function(val) {
        return typeof val === 'string';
    };

    var isObject = function(obj) {
        return obj !== null && typeof obj === 'object' && !isArray(obj);
    };


    /**
     * Context를 설정한 function 반환
     * bind를 사용할 수 없는 경우는 apply를 이용하는 대체함수를 반환한다.
     *
     * @param context
     * @param fnc
     * @returns {Function}
     */
    var proxy = (function() {
        if (isFunction(Function.prototype.bind)) {
            return function(context, fnc) {
                return isFunction(fnc) ? fnc.bind(context) : null;
            };
        } else {
            return function(context, fnc) {
                var proxyFn = null;

                if (isFunction(fnc)) {
                    if (isFunction(fnc.__proxyTarget)) {
                        fnc = fnc.__proxyTarget;
                    }

                    proxyFn = function() {
                        fnc.apply(context, arguments);
                    };

                    proxyFn.__proxyTarget = fnc;
                }

                return proxyFn;
            };
        }
    })();


    /**
     * Super Class의 Method를 호출
     * Class.prototype.__origin에 참조되는 함수로,
     * super class의 method를 호출한다.
     *
     * @param method
     * @returns {*}
     */
    var superMethod = function(method) {
        var fn = this[method];
        var par = this.__parent;
        var sfn = par && par[method];
        var val;

        fn = fn.__fn || fn;

        while(par && isFunction(sfn) && fn === sfn) {
            par = par.__parent;
            sfn = par && par[method];
        }

        fn.__fn = sfn;
        val = sfn.apply(this, slice.call(arguments, 1));
        fn.__fn = null;

        return val;
    };


    /**
     * 객체들을 병합
     *
     * @param arguments
     * @returns {Object}
     */
    var mergeObject = function() {
        var length = arguments.length;
        var i;
        var base = arguments[0];
        var obj;
        var prop;

        for (i = 1; i < length; i++) {
            obj = arguments[i];

            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    base[prop] = obj[prop];
                }
            }
        }

        return base;
    };


    /**
     * 전달된 객체를 prototype으로 설정한 새로운 객체 반환
     * Object.create를 사용할 수 없는 경우, 대체 함수를 사용한다.
     *
     * @type {Object}
     */
    var createObject = Object.create || function(object) {
        var F = function(){};
        F.prototype = object.prototype || object;
        return new F();
    };


    /**
     * 전달된 객체를 prototype용 새로운 객체로 반환
     * 조건에 따라 prototype chain을 사용하지 않는 상태로 처리한다.
     *
     * @type {Object}
     */
    var createProto;


    /**
     * Class의 Instance 여부를 체크
     * Prototype을 사용하지 않는 경우 instanceof 대신 사용한다.
     *
     * @type {Boolean}
     */
    var isInstance;


    // 상속에 prototype chain을 사용하려면 true, 그렇지 않으면 false
    if (false) {
        createProto = createObject;

        isInstance = function(ins, Cls) {
            return ins instanceof Cls;
        };
    } else {
        createProto = function(object) {
            var obj = {};
            var prop;

            for (prop in object) {
                if (object.hasOwnProperty(prop)) {
                    obj[prop] = object[prop];
                }
            }

            return obj;
        };

        isInstance = function(ins, Cls) {
            var proto = Cls.prototype;
            var parent;

            if (!ins) {
                return false;
            }

            if (!ins.__parent || !proto) {
                return ins instanceof Cls;
            }

            if (Cls.prototype.constructor === ins.constructor || Cls === Object) {
                return true;
            }

            parent = ins.__parent;

            while (parent && parent !== proto) {
                parent = parent.__parent;
            }

            return Boolean(parent);
        };
    }


    /**
     * Super Class의 생성자를 호출하는지 체크하는 정규식
     * 생성자 함수에서 super class 생성자 함수를 호출하는지를 체크하기 위한 정규식
     *
     * @type {RegExp}
     */
    var regSup = /\.__super\(/m;


    /**
     * 주석을 찾는 정규식
     * 생성자 함수에서 정규식을 찾아 제거하기 위한 정규식
     *
     * @type {RegExp}
     */
    var regCmt = /\/\/.*|\/\*[\s\S]*(?!(\/\*))\1/g;


    /**
     * 전달된 객체를 Prototype으로 하는 생성자 함수 생성
     *
     * @param proto
     * @returns {Class}
     */
    var getConstructor = function(proto) {
        var _Class_;

        if (!isFunction(proto.__extends)) {
            _Class_ = function _Class_() {
                _Class_.prototype.constructor.apply(this, arguments);
            };
        } else {
            _Class_ = function _Class_() {
                var construct = _Class_.prototype.constructor;
                var parent = this.__super || _Class_.__super;
                
                if (this.__auto) {
                    parent = parent.__super;
                }

                this.__auto = _Class_.__auto;
                this.__super = parent;

                if (!_Class_.__auto && typeof parent === 'function') {
                    this.__super = parent.__super;
                    parent.apply(this, arguments);
                }

                construct.apply(this, arguments);

                if (this.hasOwnProperty('__super')){
                    delete this.__super;
                    delete this.__auto;
                }
            };

            _Class_.__auto =
                regSup.test(proto.constructor.toString().replace(regCmt, ''));
        }

        return _Class_;
    };


    /**
     * Class 생성
     *
     * @param proto
     * @returns {Class}
     */
    var createClass = function(proto) {
        var Cls = getConstructor(proto);
        var construct = proto.constructor;
        var statics = proto.__static;
        var Parent;
        var prop;

        if (construct === Object) {
            construct = function() {};
            proto.constructor = construct;
        }

        construct.prototype = proto;

        Cls.prototype = proto;
        Cls.prototype.__parent = null;
        Cls.prototype.__origin = null;

        for (prop in statics) {
            if (statics.hasOwnProperty(prop)) {
                Cls[prop] = statics[prop];
            }
        }

        Parent = proto.__extends;

        if (isFunction(Parent) && Parent !== Cls) {
            extendClass(Cls);
        }

        return Cls;
    };


    /**
     * Class 상속
     *
     * @param Cls
     * @returns {Class}
     */
    var extendClass = function(Cls) {
        var childProto = Cls.prototype;
        var ExtendsCls = childProto.__extends;
        var parentProto = ExtendsCls.prototype;
        var extendProto = createProto(parentProto);
        var Child = childProto.constructor;
        var prop;
        
        for (prop in childProto) {
            if (childProto.hasOwnProperty(prop) && prop !== '__extends') {
                extendProto[prop] = childProto[prop];
            }
        }

        Child.prototype = extendProto;

        Cls.prototype = extendProto;
        Cls.prototype.constructor = Child;
        Cls.prototype.__parent = parentProto;
        Cls.prototype.__origin = superMethod;

        Cls.__super = ExtendsCls;

        return Cls;
    };


    // init method
    ns.each = forEach;
    ns.isArray = isArray;
    ns.isFunction = isFunction;
    ns.isString = isString;
    ns.isNull = isNull;
    ns.isObject = isObject;
    ns.proxy = proxy;
    ns.mergeObject= mergeObject;
    ns.createObject = createObject;
    ns.isInstance = isInstance;
    ns.createClass = createClass;

    return ns;

});
