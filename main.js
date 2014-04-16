/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, $, Mustache, navigator */

define(function( require, exports, module ) {
    "use strict";

    // Brackets Modules
    var Commands = brackets.getModule("command/Commands");
    var CommandManager = brackets.getModule("command/CommandManager");
    var Menus = brackets.getModule("command/Menus");
    var ProjectManager = brackets.getModule("project/ProjectManager");
    var EditorManager = brackets.getModule("editor/EditorManager");
    var DocumentManager = brackets.getModule("document/DocumentManager");
    var StatusBar = brackets.getModule("widgets/StatusBar");
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    ExtensionUtils.loadStyleSheet(module, "css/style.css");

    // Strings
    var Strings = require("strings");
//    var BracketsStrings = brackets.getModule("strings");

    // NODE BRIDGE
    var nodeBridge = require("node/nodebridge");

    // CONSTS
    var CSS_COMP_BRACKETS_RUN = 'csscomb.brackets.run';
    var CSS_COMP_BRACKETS_RUN_INLINE = 'csscomb.brackets.run.inline';
    var INDICATOR_ID = "csscomb-status-validation";

    // MENUS
    var editMenu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    var workingSetMenu = Menus.getContextMenu(Menus.ContextMenuIds.WORKING_SET_MENU);
    var projectMenu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);
//    var inlineEditorMenu = Menus.getContextMenu(Menus.ContextMenuIds.INLINE_EDITOR_MENU);
    var editorMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);


    /**
     * Register menu entries
     */
    function _registerMenuEntries() {
        // Run on full path or file
        CommandManager.register(Strings.CSS_COMP, CSS_COMP_BRACKETS_RUN, processPath);

        // register menu entry for secondary click on sidebar
        workingSetMenu.addMenuDivider();
        workingSetMenu.addMenuItem(CSS_COMP_BRACKETS_RUN);

        projectMenu.addMenuDivider();
        projectMenu.addMenuItem(CSS_COMP_BRACKETS_RUN);

        // Check first on selected text - if none run on full path or file
        // register menu entry for inline editing in editor
        CommandManager.register(Strings.CSS_COMP, CSS_COMP_BRACKETS_RUN_INLINE, processSelectedText);
        editorMenu.addMenuDivider();
        editorMenu.addMenuItem(CSS_COMP_BRACKETS_RUN_INLINE);

        // register Edit -> CSScomb
        editMenu.addMenuDivider();
        editMenu.addMenuItem(CSS_COMP_BRACKETS_RUN_INLINE, "Cmd-alt-c", Menus.AFTER);
    }

    /**
     * Call the CSScomp node script on a path or file
     */
    function processPath() {
        var dfd = $.Deferred();
        var file = ProjectManager.getSelectedItem();

        nodeBridge.processPath(file._path, function( err, resp ) {
            if( err ) {
                StatusBar.updateIndicator(INDICATOR_ID, true, "inspection-errors", err);
                dfd.reject(err);
                return;
            }
            StatusBar.updateIndicator(INDICATOR_ID, true, "inspection-valid", Strings.UPDATED + ' ' + file._path);
            dfd.resolve(resp);
        });
        return dfd.promise();
    }

    /**
     * call CSScomb node processString with the given text
     * @param text
     * @returns {*}
     */
    function processString( text ) {
        var dfd = $.Deferred();
        nodeBridge.processString(text, function( err, resp ) {
            if( err ) {
                StatusBar.updateIndicator(INDICATOR_ID, true, "inspection-errors", err);
                dfd.reject(err);
                return;
            }
            StatusBar.updateIndicator(INDICATOR_ID, true, "inspection-valid", Strings.UPDATED + ' ' + resp);
            dfd.resolve(resp);
        });
        return dfd.promise();
    }

    /**
     * Get the current selected text and CSScomb it. If no text is selected process the file or folder
     */
    function processSelectedText() {

        var editor = EditorManager.getCurrentFullEditor();
        var selectedText = editor.getSelectedText();
        // get the current document
        var doc = DocumentManager.getCurrentDocument();
        // get the current text selection
        var selection = editor.getSelection();

        // if there is a text selection
        if( selectedText.length > 0 ) {
            // try to CSScomb it
            processString(selectedText).then(function( text ) {
                doc.replaceRange(text, selection.start, selection.end);
            });
        } else {
            // otherwise try to process the current file or folder
            processPath();
        }
    }

    /**
     * Setup plugin
     * @private
     */
    function _init() {
        _registerMenuEntries();
        var statusIconHtml = Mustache.render("<div id=\"csscomb-status-validation\">&nbsp;</div>", Strings);
        StatusBar.addIndicator(INDICATOR_ID, $(statusIconHtml), true, "", "CSScomb", "status-indent");
    }

    // INIT
    _init();

    // API
    exports.processPath = processPath;
    exports.processSelectedText = processSelectedText;


    //brackets.app.showDeveloperTools();
});