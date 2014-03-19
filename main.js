/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, $, Mustache, navigator */

define(function(require, exports, module) {
    "use strict";

    var Commands = brackets.getModule("command/Commands");
    var CommandManager = brackets.getModule("command/CommandManager");
    var Menus = brackets.getModule("command/Menus");

    var Strings = require("strings");

    var CSS_COMP_BRACKETS_RUN = 'csscomb.brackets.run'
    var editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);

    function registerMenuEntries(){
        CommandManager.register(Strings.CSS_COMP, CSS_COMP_BRACKETS_RUN, runCssComp);
        editMenu.addMenuItem(CSS_COMP_BRACKETS_RUN, null, Menus.AFTER, Commands.FILE_NEW_UNTITLED);
    }

    function runCssComp(){
        console.log('hello');
    }


    registerMenuEntries();

});