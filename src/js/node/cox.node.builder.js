/**
 * COXCORE Module Manager Builder - coxcore.com
 *
 * @author cox.ascript
 */
module.exports = (function() {

    var fs = require('fs');

    var options = {
        libBanner: '/*!  APP MODULES  */',
        libHead: '(function() {\n',
        libSeparator: '\n\n',
        libFoot: '\n})();\n',

        libRoot: 'src/js/lib/',
        src: 'src/js/lib/app/index.js',
        dest: 'src/js/app.js',

        devCwd: 'src/',
        devRoot: './',
        devDest: 'src/js/app.dev.js'
    };

    var regModule = /\.module\(\s*['"](.+?)['"]\s*\)/g;
    var regVarsName = /.*?([^.\/]+$)/;
    var regModName = /@([^@]+)(?=@)/g;
    var regSep = /([.\/])/g;
    var regTrim = /^\s+|\s+$/g;
    var regPath = /([^\/])$/;

    var setOptions = function(obj, opt, def) {
        var prop;
        var val;

        if (!opt) {
            return def;
        }

        if (!obj) {
            obj = {};
        }

        if (opt) {
            for (prop in def) {
                val = opt[prop];

                if (val === undefined) {
                    val = def[prop];
                }

                obj[prop] = val;
            }
        }

        return obj;
    };

    var getFilePath = function(path, name) {
        return path.replace(regPath, '$1/') + name + '.js';
    };

    var loadFiles = function(filePath, codes, list, opt) {
        var code;
        var devPath;

        list.loaded = list.loaded || '@';

        if (checkLoadedList(list, filePath)) {
            return;
        }

        try {
            code = fs.readFileSync(filePath, 'utf8');
            code.replace(regModule, function(str, name) {
                loadFiles(getFilePath(opt.libRoot, name), codes, list, opt);
                return str;
            });

            if (opt.devCwd && filePath.indexOf(opt.devCwd) === 0) {
                devPath = filePath.replace(opt.devCwd, '');
            } else {
                devPath = filePath;
            }

            codes.push(code);
            list.push(devPath);

            console.log('[CoxBuilder:Loaded] ' + filePath);
        } catch(e) {
            console.log('\n[CoxBuilder:Error] ' + filePath + '\n>>> no such file or directory.\n');
        }
    };

    var checkLoadedList = function(list, file) {
        if (list.loaded.indexOf('@' + file + '@') === -1) {
            list.loaded += file + '@';
            return false;
        }

        return true;
    };

    var getJs = function(list, opt) {
        var header = 'document.write(\'<script src="' + opt.devRoot;
        var footer = '"></script>\');\n';

        return header + list.join(footer + header) + footer;
    };

    var getRegLibs = function(libs) {
        var regStr = [];

        libs.replace(regModName, function(str, module) {
            var varsName = module.replace(regVarsName, '$1');

            regStr.push([
                '\\s*var\\s+',
                varsName,
                '\\s*=\\s*\\w+\\.module\\(\\s*[\'"]',
                module.replace(regSep, '\\$1'),
                '[\'"]\\s*\\);'
            ].join(''));
        });

        return new RegExp(regStr.join('|'), 'g');
    };

    var createLibrary = function(codes, opt) {
        var result = [
            opt.libBanner,
            opt.libHead,
            codes.join(opt.libSeparator),
            opt.libFoot
        ].join('\n');

        fs.writeFileSync(opt.dest, result, 'utf8');
    };


    return {

        /**
         * 옵션 설정
         *
         * @param opt
         */
        config: function(opt) {
            setOptions(options, opt, options);
        },


        /**
         * 의존성에 따라 Library Module 들이 병합된 js 파일 생성
         *
         * @param opt
         */
        build: function(opt) {
            var codes = [];
            var list = [];
            var dev;
            
            opt = setOptions({}, opt, options);

            [
                getFilePath(opt.libRoot, 'cox.module'),
                getFilePath(opt.libRoot, 'cox.class'),
            ].concat(opt.src).forEach(function(filePath) {
                loadFiles(filePath, codes, list, opt);
            });

            createLibrary(codes, opt);
            console.log('\n[CoxBuilder:Complete]\n + ' + opt.dest);

            if (opt.devDest) {
                dev = getJs(list, opt);
                fs.writeFileSync(opt.devDest, dev, 'utf8');
                console.log(' + ' + opt.devDest);
            }
        }
    };

})();