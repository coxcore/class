/**
 * Sample Project
 *
 * @author cox.ascript
 */
cox.define(function(ns) {
    "use strict";

    // 의존모듈
    var CustomClass = ns.module('app/sample.CustomClass');


    // CustomClass 객체 생성
    var custom = new CustomClass();

    // bind testEvent
    custom.on('testEvent', function(e) {
        console.log(e.data);
    });

});