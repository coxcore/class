/**
 * 예시 CustomClass
 *
 * @class
 * @extends SuperClass
 * @author cox.ascript
 */
cox.define('app.sample.CustomClass', function(ns) {
    "use strict";

    // 의존모듈
    var Adapter = ns.module('cox/controls.Adapter');

    return {

        __extends: Adapter,

        constructor: function CustomClass() {
            $(window).on('mousedown', ns.proxy(this, this._onMouseDown));
        },

        _onMouseDown: function(e) {
            this.trigger('testEvent', '테스트입니다.');
        }

    };

});
