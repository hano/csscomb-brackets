(function () {
    "use strict";

    var CSScomp = require('../node_modules/csscomb/lib/csscomb');

    function processPath( path, cb ) {
        var comb = new CSScomp({ 'always-semicolon': true });
        var result = comb.processPath(path);
        cb(null, result);
    }

    function processString( cssString, cb ) {
        var comb = new CSScomp('zen');
        var result = comb.processString(cssString);
        cb(null, result);
    }

    /**
     * Initializes the test domain with several test commands.
     * @param {DomainManager} DomainManager The DomainManager for the server
     */
    function init(DomainManager) {
        if (!DomainManager.hasDomain("comb")) {
            DomainManager.registerDomain("comb", {major: 0, minor: 1});
        }

        DomainManager.registerCommand(
            "comb",
            "processPath",
            processPath,
            true,
            "",
            [],
            []
        );

        DomainManager.registerCommand(
            "comb",
            "processString",
            processString,
            true,
            "",
            [],
            []
        );
    }

    exports.init = init;

}());