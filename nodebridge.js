define(function( require, exports, module ) {
    "use strict";

    // Load Brackets modules
    var NodeConnection = brackets.getModule("utils/NodeConnection");
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

    var nodeConnection = null;

    function processString( cssString, cb ) {
        runNode(function() {

          var promise = nodeConnection.domains.comb.processString(cssString);
            promise.fail(function( err ) {
                cb(err);
            });
            promise.done(function(combed) {
                cb(null, combed);
            });
            return promise;
        });
    };

    function processPath( path, cb ) {
        runNode(function() {

          var promise = nodeConnection.domains.comb.processPath(path);
            promise.fail(function( err ) {
                cb(err);
            });
            promise.done(function() {
                cb(null);
            });
            return promise;
        });
    };

    function runNode( nodeFunc ) {

        nodeConnection = new NodeConnection();

        function connect() {
            var promise = nodeConnection.connect(true);
            promise.fail(function( err ) {
                console.log("[brackets-node] Failed to connect to node. Error:", err);
            });
            return promise;
        };

        function loadDomain() {
            var path = ExtensionUtils.getModulePath(module, "./node/comb");
            var promise = nodeConnection.loadDomains([path], true);
            promise.fail(function( err ) {
                console.log("[brackets-node] Failed to load domain. Error:", err);
            });
            return promise;
        };

        var chain = function() {
            var functions = Array.prototype.slice.call(arguments, 0);
            if( functions.length > 0 ) {
                var firstFunction = functions.shift();
                var firstPromise = firstFunction.call();
                firstPromise.done(function() {
                    chain.apply(null, functions);
                });
            }
        };

        chain(connect, loadDomain, nodeFunc);
    };

    exports.processString = processString;
    exports.processPath = processPath;
});