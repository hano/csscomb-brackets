/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, $, Mustache, navigator */

define(function( require, exports, module ) {
    "use strict";

    // Brackets Modules
    var Commands = brackets.getModule("command/Commands");
    var CommandManager = brackets.getModule("command/CommandManager");
    var Menus = brackets.getModule("command/Menus");
    var ProjectManager = brackets.getModule("project/ProjectManager");

    // Strings
    var Strings = require("strings");
    var BracketsStrings = brackets.getModule("strings");

    // NODE BRIDGE
    var nodeBridge = require("node/nodebridge");

    // CONSTS
    var CSS_COMP_BRACKETS_RUN = 'csscomb.brackets.run'

    // MENUS
    var editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);

    /**
     * Register menu entries
     */
    function _registerMenuEntries() {
        // register Edit -> CSScomb
        CommandManager.register(Strings.CSS_COMP, CSS_COMP_BRACKETS_RUN, runCssComp);
        contextMenu.addMenuDivider();
        editMenu.addMenuItem(CSS_COMP_BRACKETS_RUN, null, Menus.AFTER, Commands.FILE_NEW_UNTITLED);

        // register menu entry for secondary click on sidebar
        CommandManager.register(Strings.CSS_COMP, CSS_COMP_BRACKETS_RUN, runCssComp);
        contextMenu.addMenuItem(CSS_COMP_BRACKETS_RUN);
    }

    /**
     * Call the CSScomp node script
     */
    function runCssComp() {
        var dfd = $.Deferred();
        var file = ProjectManager.getSelectedItem();
        nodeBridge.processPath(file._path, function( err, resp ) {
            if( err ) {
                console.log(err);
                return;
            }
        });
        return dfd.promise();
    }

    // INIT
    _registerMenuEntries();

    // API
    exports.runCssComp = runCssComp;


    //brackets.app.showDeveloperTools();
});