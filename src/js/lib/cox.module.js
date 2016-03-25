/**
 * COXCORE Module Manager - coxcore.com
 *
 * @author cox.ascript
 */
(function(factory) {
    var bln;

    if (typeof define === 'function' && define.amd) {
        define(function() {
            return this.cox = factory(this.cox || {});
        });
    } else {
        bln = typeof exports === 'object';
        this.cox = factory(this.cox || {}, bln ? require : null);

        if (bln) {
            module.exports = this.cox;
        }
    }

})(function(ns, require) {
    "use strict";

    /**
     * 정의한 Module를 저장하는 객체
     *
     * @type {object}
     */
    var MODULE = {};

    /**
     * Node에서 파일 경로
     *
     * @type {string}
     */
    var ROOT = './';

    /**
     * Slash를 찾는 정규식
     * Module의 path는 무조건 dot으로 처리한다.
     *
     * @type {RegExp}
     */
    var regPath = /\//g;

    /**
     * Module의 앞, 뒤에 불필요한 문자를 찾는 정규식
     *
     * @type {RegExp}
     */
    var regTrim = /^[\/.]*|\/$|\.(?:js)?$/g;


    /**
     * 전달된 Module을 MODULE에 저장
     *
     * @param path
     * @param fnc
     */
    var defineModule = function(path, fnc) {
        if (typeof fnc !== 'function') {
            throw getError(path, '모듈을 정의할 수 없습니다.');
        }

        fnc.___defined = false;
        MODULE[path.replace(regTrim, '').replace(regPath, '.')] = fnc;
    };


    /**
     * Error Message 출력
     *
     * @param path
     * @param message
     * @returns {string}
     */
    var getError = function(path, message) {
        return '[' + path + '] ' + message;
    };


    /**
     * Module Creator 저장
     * Module을 생성하는 wrapper 함수를 저장한다.
     *
     * @param path
     * @param fnc
     */
    ns.define = function(path, fnc) {
        var type = typeof path;

        if (type === 'string') {
            if (MODULE.hasOwnProperty(path)) {
                throw getError(path, '이미 사용중인 모듈명입니다.');
            }

            defineModule(path, fnc);
        } else if (type === 'function') {
            path(ns);
        } else {
            throw getError('모듈 경로는 문자로 입력해야 합니다.');
        }
    };


    /**
     * Module 저장
     * Module을 생성하는 wrapper 함수를 설정한 후 저장ㅎ나다.
     *
     * @param path
     * @param module
     */
    ns.defineModule = function(path, module) {
        defineModule(path, function(ns) {
            return module;
        });
    };


    /**
     * Module 반환
     * MODULE에 저장된 module을 반환하는데,
     * wrapper 함수인 경우는 함수를 실행해서 모듈을 생성한 후 반환한다.
     *
     * @param path
     * @returns {*}
     */
    ns.module = function(path) {
        var name = (path || '').replace(regTrim, '').replace(regPath, '.');
        var module = MODULE[name];

        if (module === undefined && require) {
            require(ROOT + path);
            module = MODULE[name];
        }

        if (!path || module === undefined) {
            throw getError(path, '모듈을 찾을 수 없습니다.');
        }

        if (module.___defined === undefined) {
            return module;
        }

        if (module.___defined !== false) {
            throw getError(path, '상호참조 할 수 없습니다.');
        }

        module.___defined = true;
        module = module(ns, ns.module);

        if (module.hasOwnProperty('constructor') && ns.createClass) {
            module = ns.createClass(module);
            module.prototype.__package = name;
        }

        MODULE[name] = module;

        return module;
    };


    return ns;

});
