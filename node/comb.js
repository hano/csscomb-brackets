(function() {
    "use strict";

    var Comb = require('csscomb');

    function processPath( path, cb ) {
        var comb = new Comb();
        var result = comb.processPath(path);
        cb(result);
    }

    function processString( cssString, cb ) {
        var comb = new Comb();
        var combed = comb.processString(cssString);
        cb(null, combed);
    }

    /**
     * Initializes the test domain with several test commands.
     * @param {DomainManager} DomainManager The DomainManager for the server
     */
    function init( DomainManager ) {
        if( !DomainManager.hasDomain("comb") ) {
            DomainManager.registerDomain("comb", {major: 0, minor: 1});
        }

        DomainManager.registerCommand("comb", "processPath", processPath, true, "", [], []);
        DomainManager.registerCommand("comb", "processString", processString, true, "", [], []);
    }

    exports.init = init;

}());