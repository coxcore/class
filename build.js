/**
 * App Builder
 */
(function() {

    var builder = require('./src/js/node/cox.node.builder');

    builder.config({
        //libBanner: '/*!  APP MODULES  */',
        //libHead: '(function() {\n',
        //libSeparator: '\n\n',
        //libFoot: '\n})();\n',

        //libRoot: 'src/js/lib/',
        //src: 'src/js/lib/app/index.js',
        //dest: 'src/js/app.js',

        //devCwd: 'src/',
        //devRoot: './',
        //devDest: 'src/js/app.dev.js'
    });

    builder.build({
        //libBanner: '/*!  APP MODULES  */',
        //libHead: '(function() {\n',
        //libSeparator: '\n\n',
        //libFoot: '\n})();\n',

        //libRoot: 'src/js/lib/',
        //src: 'src/js/lib/app/index.js',
        //dest: 'src/js/app.js',

        //devCwd: 'src/',
        //devRoot: './',
        //devDest: 'src/js/app.dev.js'
    });
    

})();