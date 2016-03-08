/*global WM, document, window, _ */
/*jslint todo: true */

/* adding events and event options as constants*/
WM.module('wm.widgets.base', [])
    .constant('WIDGET_CONSTANTS', {
        EVENTS_OPTIONS: ["No Event", "Javascript", "New ServiceVariable", "New LiveVariable", "New NavigationCall", "New NotificationCall"]
    })

    /**
     * @ngdoc service
     * @name wm.widgets.$PropertiesFactory
     * @description
     * The `PropertiesFactory` contains properties of all the widgets in the studio and
     * provides utility methods for getting a specific widget's property
     */
    .factory('PropertiesFactory', ['WIDGET_CONSTANTS', 'CONSTANTS', 'Utils', function (WIDGET_CONSTANTS, CONSTANTS, Utils) {
        "use strict";
        /**
         * TODO: fetch the properties from the config-properties.json
         */

        var widgetEventOptions = Utils.getClonedObject(WIDGET_CONSTANTS.EVENTS_OPTIONS), /*A copy of the variable to preserve the actual value.*/
            showInDeviceOptions = [{
                'name': 'All',
                'value': 'all'
            }, {
                'name': 'Extra Small',
                'value': 'xs'
            }, {
                'name': 'Small',
                'value': 'sm'
            }, {
                'name': 'Medium',
                'value': 'md'
            }, {
                'name': 'Large',
                'value': 'lg'
            }],
            daysOptions    = Utils.getDaysOptions(),
            nameRegex      = '^[a-zA-Z_][A-Za-z0-9_]+$',
            numberRegex    = '(^$|[0-9]+$)',
            classRegex     = '(^$|^-?[_a-zA-Z ]+[_a-zA-Z0-9- ]*)$',
            dimensionRegex = '(^$|^(auto|0)$|^[+-]?[0-9]+.?([0-9]+)?(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)?$)',
            zindexRegex    = '(^$|auto|initial|inherit|^[0-9]+$)',
            maxRatingRegex = '^(?:10|[1-9])$|^bind.*$',
            roles = [],
            dateOptions = [
                {
                    "name" : "Date",
                    "groupOptions" : {
                        "%x" : "Date(%m/%d/%Y)",
                        "%c" : "Date and Time"
                    }
                },
                {
                    "name" : "Time",
                    "groupOptions" : {
                        "%X" : "Time(%H:%M:%S)",
                        "%H" : "In 24 hours",
                        "%I" : "In 12 hours",
                        "%M" : "Mintues",
                        "%S" : "Seconds",
                        "%L" : "MilliSeconds",
                        "%p" : "AM or PM",
                        "%Z" : "Time zone offset"
                    }
                },
                {
                    "name" : "Day",
                    "groupOptions" : {
                        "%d" : "Zero padded day of month",
                        "%e" : "Space padded day of month",
                        "%j" : "Day of the year"
                    }
                },
                {
                    "name" : "Week",
                    "groupOptions" : {
                        "%a" : "Abbreviated weekday name",
                        "%A" : "Full weekday name",
                        "%U" : "Week number of the year(Sunday first day)",
                        "%W" : "Week number of the year(Monday first day)",
                        "%w" : "Week day[0(Sunday),6]"
                    }
                },
                {
                    "name" : "Month",
                    "groupOptions" : {
                        "%b" : "Abbreviated month name",
                        "%B" : "Full month name",
                        "%m" : "Month number"
                    }
                },
                {
                    "name" : "Year",
                    "groupOptions" : {
                        "%y" : "without century",
                        "%Y" : "with century"
                    }
                }
            ],
            PLATFORM_TYPE = {
                WEB      :   'WEB',
                MOBILE   :   'MOBILE',
                DEFAULT  :   'DEFAULT'
            },
            animationOptions = [" ", "bounce", "bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp", "bounceOut", "bounceOutDown", "bounceOutLeft", "bounceOutRight", "bounceOutUp", "fadeIn", "fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight", "fadeInRightBig", "fadeInUp", "fadeInUpBig", "fadeOut", "fadeOutDown", "fadeOutDownBig", "fadeOutLeft", "fadeOutLeftBig", "fadeOutRight", "fadeOutRightBig", "fadeOutUp", "fadeOutUpBig", "flash", "flipInX", "flipInY", "flipOutX", "flipOutY", "hinge", "lightSpeedIn", "lightSpeedOut", "pulse", "rollIn", "rollOut", "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight", "rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight", "rubberBand", "shake", "slideInDown", "slideInLeft", "slideInRight", "slideInUp", "slideOutDown", "slideOutLeft", "slideOutRight", "slideOutUp", "swing", "tada", "wobble", "zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp", "zoomOut", "zoomOutDown", "zoomOutLeft", "zoomOutRight", "zoomOutUp"],
            spinnerAnimationOptions = [" ", "bounce", "fadeIn", "fadeOut", "flash", "flipInX", "flipInY", "pulse", "shake", "spin", "swing", "tada", "wobble", "zoomIn", "zoomOut"],
            visibilityOptions = ["collapse", "hidden", "initial", "inherit", "visible"],
            displayOptions = ["block", "flex", "inherit", "initial", "inline", "inline-block", "inline-flex", "inline-table", "list-item", "run-in", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-header-group", "table-footer-group", "table-row", "table-row-group", "none"],
            EVERYONE = "Everyone",
            result = {
                "properties": {
                    "wm.base": {
                        "name": {"type": "string", "pattern": nameRegex, "maxlength": 32},
                        "hint": {"type": "string", "bindable": "in-bound"},
                        "show": {"type": "boolean", "value": true, "bindable": "in-bound"},
                        "class": {"type": "string", "pattern": classRegex},
                        "accessroles": {"type": "accessrolesselect", "options": roles, "value": EVERYONE},
                        "showindevice": {"type": "selectall", "options": showInDeviceOptions, "value": "all", "displaytype": 'block'}
                    },

                    "wm.base.editors": {
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "height": {"type": "string", "pattern": dimensionRegex},

                        /* ---- styles ----*/
                        "border": {"type": "string", "widget": "box"},
                        "borderunit": {"type": "string", "options": ["em", "px"], "value": "px", "widget": "icons_radio"},
                        "bordertop": {"type": "string", "pattern": numberRegex},
                        "borderright": {"type": "string", "pattern": numberRegex},
                        "borderbottom": {"type": "string", "pattern": numberRegex},
                        "borderleft": {"type": "string", "pattern": numberRegex},
                        "borderwidth": {"type": "string"},
                        "borderstyle": {"type": "string", "options": ["dashed", "dotted", "none", "solid"], "widget": "borderstyle"},
                        "bordercolor": {"type": "string", "widget": "color"},
                        "padding": {"type": "string", "widget": "box"},
                        "paddingunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "paddingtop": {"type": "string", "pattern": numberRegex},
                        "paddingright": {"type": "string", "pattern": numberRegex},
                        "paddingbottom": {"type": "string", "pattern": numberRegex},
                        "paddingleft": {"type": "string", "pattern": numberRegex},
                        "margin": {"type": "string", "widget": "box"},
                        "marginunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "margintop": {"type": "string", "pattern": numberRegex},
                        "marginbottom": {"type": "string", "pattern": numberRegex},
                        "marginright": {"type": "string", "pattern": numberRegex},
                        "marginleft": {"type": "string", "pattern": numberRegex},
                        "backgroundcolor": {"type": "string", "widget": "color"},
                        "backgroundgradient": {"type": "string"},
                        "backgroundimage": {"type": "string", "bindable": "in-bound"},
                        "backgroundrepeat": {"type": "list", "options": ["no-repeat", "repeat", "repeat-x", "repeat-y"]},
                        "backgroundsize": {"type": "string", "hint": "width, height"},
                        "backgroundposition": {"type": "string", "hint": "left, top"},
                        "backgroundattachment": {"type": "list", "options": ["fixed", "local", "scroll"]},
                        "color": {"type": "string", "hidelabel": true, "widget": "color"},
                        "fontweight": {"type": "string", "options": ["bold"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontsize": {"type": "number", "hidelabel": true, "hint": "Font size", "pattern": numberRegex},
                        "fontunit": {"type": "string", "options": ["em", "px"], "value": "px", "hidelabel": true, "widget": "icons_radio"},
                        "textalign": {"type": "string", "options": ["left", "center", "right"], "hidelabel": true, "widget": "icons_radio"},
                        "textdecoration": {"type": "string", "options": ["underline"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontstyle": {"type": "string", "options": ["italic"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontVariant": {"type": "list", "options": ["normal", "small-caps"]},
                        "fontfamily": {"type": "string", "hidelabel": true, "hint": "Arial, Geneva"},
                        "misc": {"type": "string"},
                        "whitespace": {"type": "list", "options": [" ", "normal", "nowrap", "pre", "pre-line", "pre-wrap"], "value": " "},
                        "wordbreak": {"type": "list", "options": ["break-word", "normal"]},
                        "opacity": {"type": "string", "widget": "slider"},
                        "cursor": {"type": "list", "options": ["crosshair", "default", "e-resize", "help", "move", "n-resize", "ne-resize", "nw-resize", "pointer", "progress", "s-resize", "se-resize", "sw-resize", "text", "wait", "w-resize"]},
                        "zindex": {"type": "string", "pattern": zindexRegex},
                        "visibility": {"type": "list", "options": visibilityOptions},
                        "display": {"type": "list", "options": displayOptions}
                    },
                    "wm.base.editors.abstracteditors": {
                        "disabled": {"type": "boolean", "bindable": "in-bound"},
                        "required": {"type": "boolean", "bindable": "in-bound"},
                        "tabindex": {"type": "string", "value": "0"},
                        "onClick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onTap": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseenter": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseleave": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onFocus": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onBlur": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onChange": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },
                    "wm.base.editors.captionproperties": {
                        "caption": {"type": "string", "value": "_unset_", "bindable": "in-bound", "maxlength": 256 },
                        "captionsize": {"type": "string"},
                        "paddingtop": {"value": "0"},
                        "paddingright": {"value": "0"},
                        "paddingbottom": {"value": "0"},
                        "paddingleft": {"value": "0"},
                        "bordertop": {"value": "0"},
                        "borderright": {"value": "0"},
                        "borderbottom": {"value": "0"},
                        "borderleft": {"value": "0"}
                    },

                    "wm.base.editors.dataseteditors": {
                        "startupdate": {"type": "boolean"},
                        "scopedataset": {"type": "list", "options": []},
                        "datafield": {"type": "list", "options": ["All Fields"], "datasetfilter" : "terminals", "allfields" : true},
                        "displayfield": {"type": "list", "options": [""], "datasetfilter" : "terminals"},
                        "displayexpression": {"type": "string", "bindable": "in-bound", "bindonly": "expression"},
                        "displaytype": {"type": "list", "options": ["Currency", "Date", "Number", "Text", "Time"]}
                    },

                    "wm.base.events": {
                        "onTap": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onDoubletap": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onClick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onDblclick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseenter": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseleave": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },

                    "wm.base.events.touch": {
                        "onSwipeup": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onSwipedown": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onSwipeleft": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onSwiperight": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onPinchin": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onPinchout": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },

                    "wm.base.events.keyboard": {
                        "onKeypress": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onKeydown": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onKeyup": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },
                    "wm.base.events.focus": {
                        "onFocus": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onBlur": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },

                    "wm.base.events.change": {
                        "onChange": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },

                    "wm.base.events.successerror": {
                        "onSuccess": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onError": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },

                    "wm.abstractinput": {
                        "type": {"type": "string", "value": "text"}
                    },

                    "wm.html": {
                        "content": {"type": "string", "bindable": "in-out-bound", "widget": "textarea"},
                        "autoscroll": {"type": "boolean"},
                        "height": {"type": "string", "pattern": dimensionRegex}
                    },
                    "wm.icon": {
                        "iconclass": {"type": "string", "value": "wi wi-star-border", "widget": "selecticon", "bindable": "in-out-bound", "pattern": classRegex},
                        "iconsize": {"type": "string", "pattern": dimensionRegex},
                        "animation": {"type": "list", "options": animationOptions},
                        "color": {"type": "string", "widget": "color"},
                        "opacity": {"type": "string", "widget": "slider"}
                    },
                    "wm.iframe": {
                        "iframesrc": {"type": "string", "bindable": "in-bound", "widget": "string"},
                        "width": {"type": "string", "value": '300px', "pattern": dimensionRegex},
                        "height": {"type": "string", "value": '150px', "pattern": dimensionRegex},
                        "showindevice": {"type": "selectall", "options": showInDeviceOptions, "value": "all"}
                    },
                    "wm.button": {
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-out-bound", "pattern": classRegex},
                        "badgevalue": {"type": "string", "bindable": "in-out-bound"},
                        "caption": {"type": "string", "bindable": "in-out-bound", "maxlength": 256},
                        "iconurl": {"type": "string", "bindable": "in-bound"},
                        "iconwidth": {"type": "string", "pattern": dimensionRegex},
                        "iconheight": {"type": "string", "pattern": dimensionRegex},
                        "iconmargin": {"type": "string", "pattern": dimensionRegex},
                        "iconposition": {"type": "list", "options": ["left", "top", "right"]},
                        "disabled": {"type": "boolean", "bindable": "in-bound"},
                        "type": {"type": "list", "options": ["button", "reset", "submit"], "value" : "button"},
                        "tabindex": {"type": "string", "value": "0"},
                        "showindevice": {"type": "selectall", "options": showInDeviceOptions, "value": "all", "displaytype": 'inline-block'},
                        "animation": {"type": "list", "options": animationOptions},
                        "shortcutkey": {"type": "string"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "value": "btn-default", "options": ["btn-primary", "btn-info", "btn-warning", "btn-success", "btn-danger", "btn-lg", "btn-sm", "btn-xs", "btn-raised", "btn-fab", "btn-link", "btn-transparent", "jumbotron"]}
                    },
                    "wm.rating": {
                        "maxvalue": {"type": "number", "value": 5, "pattern": maxRatingRegex, "bindable": "in-bound"},
                        "readonly": {"type": "boolean", "value": false, "bindable": "in-bound"},
                        "scopedatavalue": {"type": "string"},
                        "datavalue": {"type": "number", "value": "", "bindable": "in-out-bound"},
                        "caption": {"type": "string", "bindable": "in-out-bound", "maxlength": 256, "show": false},
                        "iconsize": {"type": "string", "pattern": dimensionRegex},
                        "onChange": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "width": {"type": "string", "pattern": dimensionRegex, "show": false},
                        "height": {"type": "string", "pattern": dimensionRegex, "show": false},
                        "tabindex": {"type": "string", "value": "0"},
                        "iconcolor": {"type": "string", "widget": "color"},
                        "scopedataset": {"type": "string"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "datafield": {"type": "list", "options": [""], "value": "", "datasetfilter" : "terminals"},
                        "displayfield": {"type": "list", "options": [""], "datasetfilter" : "terminals"},
                        "displayexpression": {"type": "string", "bindable": "in-bound", "bindonly": "expression"},
                        "showcaptions": {"type": "boolean", "value": true}
                    },
                    "wm.camera": {
                        "capturetype": {"type": "list", "options": ["IMAGE", "VIDEO"], "value" : "IMAGE"},
                        "datavalue": {"type": "string", "value": "", "bindable": "in-out-bound"},
                        "title": {"type": "string", "bindable": "in-out-bound"},
                        "iconclass": {"type": "string", "value": "wi wi-photo-camera", "widget": "selecticon", "bindable": "in-out-bound", "pattern": classRegex},
                        "iconsize": {"type": "string", "pattern": dimensionRegex, "value" : "2em"},
                        /* capture picture options*/
                        "imagequality": {"type": "number", "value": 80},
                        "imageencodingtype": {"type": "list", "options": [ "JPEG", "PNG"], "value" : "JPEG"},
                        "savetogallery": {"type": "boolean", "value" : false},
                        "allowedit": {"type": "boolean", "value" : false},
                        "imagetargetwidth": {"type": "number"},
                        "imagetargetheight": {"type": "number"},
                        /* Events */
                        "onSuccess": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },
                    "wm.barcodescanner": {
                        "datavalue": {"type": "string", "bindable": "in-out-bound"},
                        "caption": {"type": "string", "value": "", "bindable": "in-bound", "maxlength": 256 },
                        "iconclass": {"type": "string", "value": "glyphicon glyphicon-barcode", "widget": "selecticon", "bindable": "in-out-bound", "pattern": classRegex},
                        "iconsize": {"type": "string", "pattern": dimensionRegex, "value" : "2em"},
                        /* Events */
                        "onSuccess": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },
                    "wm.buttongroup": {
                        "vertical": {"type": "boolean"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["btn-group-lg", "btn-group-sm", "btn-group-xs", "btn-group-raised", "btn-toolbar", "btn-group-vertical"]}
                    },
                    "wm.switch": {
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "datavalue": {"type": "string, object", "bindable": "in-out-bound", "widget": "string"},
                        "scopedatavalue": {"type": "string"},
                        "dataset": {"type": "array, string", "bindable": "in-bound", "widget": "string", "value": "yes, no, maybe"},
                        "scopedataset": {"type": "string"},
                        "datafield": {"type": "list", "options": ["All Fields"], "value": "All Fields", "datasetfilter" : "terminals", "allfields" : true},
                        "displayfield": {"type": "list", "options": [""], "value": "", "datasetfilter": "terminals"},
                        "tabindex": {"type": "string", "value": "0"}
                    },
                    "wm.menu": {
                        "name": {"type": "string", "pattern": nameRegex, "maxlength": 32},
                        "hint": {"type": "string", "bindable": "in-bound"},
                        "show": {"type": "boolean", "value": true, "bindable": "in-bound"},
                        "accessroles": {"type": "accessrolesselect", "options": roles, "value": EVERYONE},
                        "scopedataset": {"type": "string"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string", "value": "Menu Item 1, Menu Item 2, Menu Item 3"},
                        "caption": {"type": "string", "bindable": "in-out-bound", "maxlength": 256},
                        "menulayout": {"type": "list", "options": ["vertical", "horizontal"]},
                        "menuclass": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["btn-default", "btn-primary", "btn-info", "btn-danger", "btn-warning", "btn-success", "btn-lg", "btn-sm", "btn-xs", "btn-link", "btn-transparent", "jumbotron"]},
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-out-bound", "pattern": classRegex},
                        "menuposition": {"type": "list", "options": ["", "down,right", "down,left", "up,right", "up,left", "inline"], "value": ""},
                        "onSelect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "linktarget": {"type": "list", "options": ["_blank", "_parent", "_self", "_top"], "value": "_blank", "widget": "datalist"},
                        "tabindex": {"type": "string", "value": "0"},
                        "animateitems": {"type": "list", "options": ['', 'slide', 'fade', 'scale']},
                        "shortcutkey": {"type": "string"}
                    },

                    "wm.menu.dataProps": {
                        "itemlabel": {"type": "string", "widget": "list", "options": [""], "bindable": "in-bound", "bindonly": "expression", "datasetfilter" : "terminals"},
                        "itemlink": {"type": "string", "widget": "list", "options": [""], "bindable": "in-bound", "bindonly": "expression", "datasetfilter" : "terminals"},
                        "itemicon": {"type": "string", "widget": "list", "options": [""], "bindable": "in-bound", "bindonly": "expression", "datasetfilter" : "terminals"},
                        "itemchildren": {"type": "string", "widget": "list", "options": [""], "bindable": "in-bound", "bindonly": "expression", "datasetfilter" : "objects"}
                    },

                    "wm.tree": {
                        "scopedataset": {"type": "string"},
                        "dataset": {"type": "object, array", "bindable": "in-bound", "widget": "string", "value": "node1, node2, node3"},
                        "onSelect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "selecteditem": {"type": "object", "bindable": "in-out-bound", "show": false, "widget": "string"},
                        "class": {"type": "string"},
                        "treeicons": {"type": "list", "widget": "list", "options": ["folder", "plus-minus", "circle-plus-minus", "chevron", "menu", "triangle", "expand-collapse"]},
                        "nodelabel": {"type": "list", "widget": "list", "datasetfilter" : "terminals"},
                        "nodeicon": {"type": "list", "widget": "list", "datasetfilter" : "terminals"},
                        "nodechildren": {"type": "list", "widget": "list", "datasetfilter" : "objects"},
                        "tabindex": {"type": "string", "value": "0"},
                        "levels": {"type": "number", "value": 0, "min": "0", "max": "10", "step": "1"},
                        "datavalue": {"type": "string", "bindable": "in-bound", "ignoreGetterSetters": true, "widget": "tree-datavalue"}
                    },

                    "wm.text": {
                        "autofocus": {"type": "boolean"},
                        "autocomplete": {"type": "boolean", "value": true},
                        "readonly": {"type": "boolean", "bindable": "in-bound"},
                        "updateon": {"type": "list", "value": "blur", "widget": "updateon"},
                        "updatedelay": {"type": "number", "value": 0},
                        "type": {"type": "list", "options": ["color", "date", "datetime-local", "email", "month", "number", "password", "search", "tel", "text", "time", "url", "week"], "value": "text"},
                        "accept": {"type": "datalist", "options": ["image/*", "audio/*", "video/*"], "show": false},
                        "datavalue": {"type": "string", value: "", "bindable": "in-out-bound"},
                        "scopedatavalue": {"type": "string"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["input-lg", "input-sm"]},

                        /* Properties: Validation */
                        "regexp": {"type": "string", "value": ".*"},

                        /* Properties: help */
                        "placeholder": {"type": "string", "value": "Enter text"},

                        /* Properties: Behavior */
                        "maxchars": {"type": "number", "bindable": "in-bound"},

                        /*  ---Events---  */
                        "changeOnkey": {"type": "boolean"},

                        /* Number properties */
                        "minvalue": {"type": "string", "bindable": "in-bound"},
                        "maxvalue": {"type": "string", "bindable": "in-bound"},
                        "step": {"type": "number"},
                        "shortcutkey": {"type": "string"}
                    },

                    "wm.currency": {
                        "datavalue": {"type": "number", "bindable": "in-out-bound"},
                        "scopedatavalue": {"type": "string"},
                        "minvalue": {"type": "number", "bindable": "in-bound"},
                        "maxvalue": {"type": "number", "bindable": "in-bound"},
                        "readonly": {"type": "boolean", "bindable": "in-bound"},
                        "currency": {"type": "list", "value": "USD", "options": ["AED", "AFN", "ALL", "AMD", "ARS", "AUD", "AZN", "BAM", "BDT", "BGN", "BHD", "BIF", "BND", "BOB", "BRL", "BWP", "BYR", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EEK", "EGP", "ERN", "ETB", "EUR", "GBP", "GEL", "GHS", "GNF", "GTQ", "HKD", "HNL", "HRK", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KHR", "KMF", "KRW", "KWD", "KZT", "LBP", "LKR", "LTL", "LVL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MOP", "MUR", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SDG", "SEK", "SGD", "SOS", "SYP", "THB", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VEF", "VND", "XAF", "XOF", "YER", "ZAR", "ZMK"]},
                        /* Properties: help */
                        "placeholder": {"type": "string", "value": "Enter value"},
                        /* Style: Basic */
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "backgroundcolor": {"type": "string", "widget": "color"},
                        "backgroundgradient": {"type": "string"},
                        "backgroundimage": {"type": "string", "bindable": "in-bound"},
                        "backgroundrepeat": {"type": "list", "options": ["no-repeat", "repeat", "repeat-x", "repeat-y"]},
                        "backgroundsize": {"type": "string", "hint": "width, height"},
                        "backgroundposition": {"type": "string", "hint": "top, left"},
                        "backgroundattachment": {"type": "list", "options": ["fixed", "local", "scroll"]},
                        "color": {"type": "string", "hidelabel": true, "widget": "color"},
                        "fontweight": {"type": "string", "options": ["bold"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontsize": {"type": "number", "hidelabel": true, "hint": "Font size", "pattern": numberRegex},
                        "fontunit": {"type": "string", "options": ["em", "px"], "value": "px", "hidelabel": true, "widget": "icons_radio"},
                        "textalign": {"type": "string", "options": ["left", "center", "right"], "hidelabel": true, "widget": "icons_radio"},
                        "textdecoration": {"type": "string", "options": ["underline"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontstyle": {"type": "string", "options": ["italic"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontfamily": {"type": "string", "hidelabel": true, "hint": "Arial, Geneva"},
                        "whitespace": {"type": "list", "options": [" ", "normal", "nowrap", "pre", "pre-line", "pre-wrap"], "value": " "},
                        "wordbreak": {"type": "list", "options": ["break-word", "normal"]},
                        "misc": {"type": "string"},
                        "opacity": {"type": "string", "widget": "slider"},
                        "cursor": {"type": "list", "options": ["crosshair", "default", "e-resize", "help", "move", "n-resize", "ne-resize", "nw-resize", "pointer", "progress", "s-resize", "se-resize", "sw-resize", "text", "wait", "w-resize"]},
                        "zindex": {"type": "string", "pattern": zindexRegex},
                        "shortcutkey": {"type": "string"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["input-group-sm", "input-group-lg"]}
                    },
                    "wm.base.datetime": {
                        "datavalue": {"type": "string", "bindable": "in-out-bound"},
                        "scopedatavalue": {"type": "string"},
                        "tabindex": {"type": "string", "value": "0"},
                        /* ---- styles ----*/
                        "border": {"type": "string", "widget": "box"},
                        "borderunit": {"type": "string", "options": ["em", "px"], "value": "px", "widget": "icons_radio"},
                        "bordertop": {"type": "string", "pattern": numberRegex},
                        "borderright": {"type": "string", "pattern": numberRegex},
                        "borderbottom": {"type": "string", "pattern": numberRegex},
                        "borderleft": {"type": "string", "pattern": numberRegex},
                        "borderwidth": {"type": "string"},
                        "borderstyle": {"type": "string", "options": ["dashed", "dotted", "none", "solid"], "widget": "borderstyle"},
                        "bordercolor": {"type": "string", "widget": "color"},
                        "padding": {"type": "string", "widget": "box"},
                        "paddingunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "paddingtop": {"type": "string", "pattern": numberRegex},
                        "paddingright": {"type": "string", "pattern": numberRegex},
                        "paddingbottom": {"type": "string", "pattern": numberRegex},
                        "paddingleft": {"type": "string", "pattern": numberRegex},
                        "margin": {"type": "string", "widget": "box"},
                        "marginunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "margintop": {"type": "string", "pattern": numberRegex},
                        "marginbottom": {"type": "string", "pattern": numberRegex},
                        "marginright": {"type": "string", "pattern": numberRegex},
                        "marginleft": {"type": "string", "pattern": numberRegex},
                        "color": {"type": "string", "hidelabel": true, "widget": "color"},
                        "fontweight": {"type": "string", "options": ["bold"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontsize": {"type": "number", "hidelabel": true, "hint": "Font size", "pattern": numberRegex},
                        "fontunit": {"type": "string", "options": ["em", "px"], "value": "px", "hidelabel": true, "widget": "icons_radio"},
                        "textalign": {"type": "string", "options": ["left", "center", "right"], "hidelabel": true, "widget": "icons_radio"},
                        "textdecoration": {"type": "string", "options": ["underline"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontstyle": {"type": "string", "options": ["italic"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontVariant": {"type": "list", "options": ["normal", "small-caps"]},
                        "fontfamily": {"type": "string", "hidelabel": true, "hint": "Arial, Geneva"},
                        "opacity": {"type": "string", "widget": "slider"},
                        "cursor": {"type": "list", "options": ["crosshair", "default", "e-resize", "help", "move", "n-resize", "ne-resize", "nw-resize", "pointer", "progress", "s-resize", "se-resize", "sw-resize", "text", "wait", "w-resize"]},
                        "zindex": {"type": "string", "pattern": zindexRegex}
                    },
                    "wm.date": {
                        "placeholder": {"type": "string", "value": "Select date"},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "autofocus": {"type": "boolean"},
                        "showweeks": {"type": "boolean", "value": false, "bindable": "in-bound"},
                        "readonly": {"type": "boolean", "bindable": "in-bound"},
                        "disabled": {"type": "boolean", "bindable": "in-bound"},
                        "mindate": {"type": "string", "bindable": "in-bound", "hint": "yyyy-MM-dd"},
                        "maxdate": {"type": "string", "bindable": "in-bound", "hint": "yyyy-MM-dd"},
                        "datepattern": {"value": "yyyy-MM-dd", "type": "list", "options": [], "widget": "datetimepatterns"},
                        "outputformat": {"value": "yyyy-MM-dd", "type": "list", "options": [], "widget": "datetimepatterns"},
                        "datavalue": {"type": "date, datetime, timestamp, string, number", "widget": "string", "bindable": "in-out-bound", "hint": "yyyy-MM-dd"},
                        "timestamp": {"type": "date, datetime, timestamp, string, number", "widget": "string", "show": "false", "bindable": "out-bound"},
                        "excludedays": {"type": "selectall", "options": daysOptions, "displaytype": "block", "value": " "},
                        "excludedates": {"type": "datetime, timestamp, date, array, string", "bindable": "in-bound", "widget": "string", "hint": "yyyy-MM-dd"},
                        "tabindex": {"type": "string", "value": "0"},
                        "shortcutkey": {"type": "string"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["input-group-sm", "input-group-lg"]}
                    },
                    "wm.calendar": {
                        "backgroundcolor": {"type": "string", "widget": "color"},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "scopedataset": {"type": "string"},
                        "multiselect": {"type": "boolean"},
                        "selecteddates": {"type": "object", "widget": "string", "bindable": "in-out-bound"},
                        "currentview": {"type": "object", "widget": "string", "bindable": "in-out-bound"},
                        "calendartype": {"type": "list", "options": ["basic", "agenda"], "value": "basic"},
                        "view": {"type": "list", "options": ["month", "week", "day"], "value": "month"},
                        "controls": {"type": "list", "options": ["navigation", "today", "month", "week", "day"], "value": "navigation, today, month, week, day", "widget": "selectall"},
                        "onViewrender": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onSelect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onEventdrop": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onEventresize": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onEventclick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onEventrender": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "tabindex": {"type": "string", "value": "0"}
                    },
                    "wm.time": {
                        "placeholder": {"type": "string", "value": "Select time"},
                        "autofocus": {"type": "boolean"},
                        "readonly": {"type": "boolean", "bindable": "in-bound"},
                        "disabled": {"type": "boolean", "bindable": "in-bound"},
                        "hourstep": {"type": "number", "value": 1},
                        "timepattern": {"value": "hh:mm a", "type": "list", "options": [], "widget": "timepatterns"},
                        "minutestep": {"type": "number", "value": 15},
                        "outputformat": {"value": "HH:mm:ss", "type": "list", "options": [], "widget": "timepatterns"},
                        "required": {"type": "boolean"},
                        "datavalue": {"type": "time, date, string, number", "widget": "string", "bindable": "in-out-bound", hint: "HH:mm"},
                        "timestamp": {"type": "time, date, string, number", "widget": "string", "show": "false", "bindable": "out-bound"},
                        "tabindex": {"type": "string", "value": "0"},
                        "shortcutkey": {"type": "string"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["input-group-sm", "input-group-lg"]}
                    },
                    "wm.datetime": {
                        "placeholder": {"type": "string", "value": "Select date time"},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "autofocus": {"type": "boolean"},
                        "showweeks": {"type": "boolean", "value": false},
                        "readonly": {"type": "boolean", "bindable": "in-bound"},
                        "disabled": {"type": "boolean", "bindable": "in-bound"},
                        "hourstep": {"type": "number", "value": 1},
                        "minutestep": {"type": "number", "value": 15},
                        "mindate": {"type": "string",  "bindable": "in-bound", "hint": "yyyy-MM-dd"},
                        "maxdate": {"type": "string",  "bindable": "in-bound", "hint": "yyyy-MM-dd"},
                        "datepattern": {"value": "yyyy-MM-dd hh:mm:ss a", "type": "list", "options": [], "widget": "datetimepatterns"},
                        "outputformat": {"value": "timestamp", "type": "list", "options": [], "widget": "datetimepatterns"},
                        "datavalue": {"type": "timestamp, date, time, datetime, string, number", "widget": "string", "bindable": "in-out-bound", "hint": "yyyy-MM-dd HH:mm:ss"},
                        "timestamp": {"type": "timestamp, date, time, datetime, string, number", "widget": "string", "show": "false", "bindable": "out-bound"},
                        "excludedays": {"type": "selectall", "options": daysOptions, "displaytype": "block", "value": " "},
                        "excludedates": {"type": "datetime, timestamp, date, array, string", "bindable": "in-bound", "widget": "string", "hint": "yyyy-MM-dd"},
                        "tabindex": {"type": "string", "value": "0"},
                        "shortcutkey": {"type": "string"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["input-group-sm", "input-group-lg"]}
                    },
                    "wm.message": {
                        "type": {"type": "string", "options": ["error", "info", "loading", "success", "warning"], "value": "success", "bindable": "in-out-bound", "widget": "list"},
                        "caption": {"type": "string", "value": "Message", "bindable": "in-out-bound", "maxlength": 256},
                        "onClose": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "animation": {"type": "list", "options": animationOptions},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "hideclose": {"type": "boolean", "value": false}
                    },

                    "wm.composite": {
                        "captionposition": {"type": "list", "options": ["left", "right", "top"]},
                        "required": {"type": "boolean"},
                        "margin": {"type": "string", "widget": "box"},
                        "marginunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "margintop": {"type": "string", "pattern": numberRegex},
                        "marginbottom": {"type": "string", "pattern": numberRegex},
                        "marginright": {"type": "string", "pattern": numberRegex},
                        "marginleft": {"type": "string", "pattern": numberRegex}
                    },

                    "wm.booleaneditors": {
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "height": {"type": "string", "pattern": dimensionRegex},
                        /* ---- styles ----*/
                        "padding": {"type": "string", "widget": "box"},
                        "paddingunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "paddingtop": {"type": "string", "pattern": numberRegex},
                        "paddingright": {"type": "string", "pattern": numberRegex},
                        "paddingbottom": {"type": "string", "pattern": numberRegex},
                        "paddingleft": {"type": "string", "pattern": numberRegex},
                        "margin": {"type": "string", "widget": "box"},
                        "marginunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "margintop": {"type": "string", "pattern": numberRegex},
                        "marginbottom": {"type": "string", "pattern": numberRegex},
                        "marginright": {"type": "string", "pattern": numberRegex},
                        "marginleft": {"type": "string", "pattern": numberRegex},
                        "opacity": {"type": "string", "widget": "slider"},
                        "cursor": {"type": "list", "options": ["crosshair", "default", "e-resize", "help", "move", "n-resize", "ne-resize", "nw-resize", "pointer", "progress", "s-resize", "se-resize", "sw-resize", "text", "wait", "w-resize"]},
                        "zindex": {"type": "string", "pattern": zindexRegex}
                    },
                    "wm.radio": {
                        //"readonly": {"type": "boolean", "value": false}, //commenting this property temporarily as it is not working
                        "autofocus": {"type": "boolean"},
                        "disabled": {"value": false, "bindable": "in-bound"},
                        "scopedatavalue": {"type": "string"},
                        "datavalue": {"type": "string", "bindable": "in-out-bound"},
                        "checkedvalue": {"type": "string"},
                        "radiogroup": {"type": "string"},
                        "caption": {"type": "string", "bindable": "in-out-bound", "maxlength": 256},
                        "shortcutkey": {"type": "string"}
                    },
                    "wm.radioset": {
                        "tabindex": {"type": "string", "value": "0"},
                        "disabled": {"type": "boolean", "value": false, "bindable": "in-bound"},
                        "readonly": {"type": "boolean", "value": false, "bindable": "in-bound"},
                        "layout":  {"type": "list", "options": ["", "inline", "stacked"]},
                        "itemclass": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["list-group", "media-list"]},
                        "listclass": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["list-group-item", "media"]},
                        /* ---- events ---- */

                        "onClick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onTap": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseenter": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseleave": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onFocus": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onBlur": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onChange": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},

                        "datavalue": {"type": "string", "bindable": "in-out-bound", "show": false},
                        "scopedatavalue": {"type": "string"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string", "value": "Option 1, Option 2, Option 3"},
                        "usekeys": {"type": "boolean"},
                        "required": {"type": "boolean", "bindable": "in-bound", "value": false},
                        "selectedvalue": {"type": "string, number, boolean, date, time, object", "widget": "string", "value": "", "bindable": "in-bound"}
                    },
                    "wm.colorpicker": {
                        "readonly": {"type": "boolean", "value": false, "bindable": "in-bound"},
                        "disabled": {"type": "boolean", "value": false, "bindable": "in-bound"},
                        "datavalue": {"type": "string", "bindable": "in-out-bound"},
                        "scopedatavalue": {"type": "string"},
                        "placeholder": {"type": "string", "value": "Select Color"},
                        "tabindex": {"type": "string", "value": "0"},
                        "shortcutkey": {"type": "string"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["input-group-sm", "input-group-lg"]}
                    },

                    "wm.inputcolorpicker": {
                        "defaultcolor": {"value": "#fff"}
                    },

                    "wm.inputslider": {
                        "caption": {"value": "slider", "maxlength": 256}
                    },

                    "wm.slider": {
                        "readonly": {"type": "boolean", "value": false, "bindable": "in-bound"},
                        "disabled": {"type": "boolean", "value": false, "bindable": "in-bound"},
                        "minvalue": {"type": "number", "bindable": "in-out-bound"},
                        "maxvalue": {"type": "number", "bindable": "in-out-bound"},
                        "step": {"type": "number"},
                        "datavalue": {"type": "string", "bindable": "in-out-bound"},
                        "scopedatavalue": {"type": "string"},
                        "tabindex": {"type": "string", "value": "0"},
                        "shortcutkey": {"type": "string"}
                    },

                    "wm.checkbox": {
                        "datavalue": {"type": "boolean, string", "bindable": "in-out-bound", "widget": "string"},
                        "checkedvalue": {"type": "string"},
                        "uncheckedvalue": {"type": "string"},
                        "scopedatavalue": {"type": "string"},
                        "caption": {"type": "string", "bindable": "in-out-bound", "maxlength": 256},
                        "shortcutkey": {"type": "string"}
                    },
                    "wm.checkboxset": {
                        "tabindex": {"type": "string", "value": "0"},
                        "disabled": {"type": "boolean", "value": false, "bindable": "in-bound"},
                        "readonly": {"type": "boolean", "value": false, "bindable": "in-bound"},
                        "layout":  {"type": "list", "options": ["", "inline", "stacked"]},
                        "itemclass": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["list-group", "media-list"]},
                        "listclass": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["list-group-item", "media"]},

                        /* ---- events ---- */

                        "onClick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onTap": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseenter": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseleave": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onFocus": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onBlur": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onChange": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},

                        "datavalue": {"type": "string, array", "bindable": "in-out-bound", "show": false, "widget": "string"},
                        "scopedatavalue": {"type": "string"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string", "value": "Option 1, Option 2, Option 3"},
                        "usekeys": {"type": "boolean"},
                        "selectedvalues": {"type": "string, object", "bindable": "in-bound", "widget": "string"},
                        "onReady": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },

                    "wm.select": {
                        "autofocus": {"type": "boolean"},
                        "readonly": {"type": "boolean", "value": false, "bindable": "in-bound"},
                        "scopedatavalue": {"type": "string"},
                        "datavalue": {"type": "string, number, boolean, date, time, object", "bindable": "in-out-bound", "widget": "string"},
                        "scopedataset": {"type": "string"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "allownone": {"type": "boolean"},
                        "hasdownarrow": {"type": "boolean", "value": true},
                        "restrictvalues": {"type": "boolean", "value": true},
                        "disabled": {"value": false, "bindable": "in-bound"},
                        "multiple": {"type": "boolean", "value": false},
                        "placeholder": {"type": "string", "value": ""},
                        "shortcutkey": {"type": "string"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["input-lg", "input-sm"]}
                    },

                    "wm.marquee": {
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "direction": {"type": "list", "options": ["up", "down", "left", "right"]},
                        "behavior": {"type": "list", "options": ["scroll", "slide", "alternate"]},
                        "scrolldelay": {"type": "number"},
                        "scrollamount": {"type": "number"}
                    },

                    "wm.label": {
                        "caption": {"type": "date, string, number", "widget": "string", "value": "Label", "bindable": "in-out-bound", "maxlength": 256},
                        "required": {"type": "boolean"},
                        "showindevice": {"type": "selectall", "options": showInDeviceOptions, "value": "all", "displaytype": 'inline-block'},
                        "animation": {"type": "list", "options": animationOptions},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": [ "h1", "h2", "h3", "h4", "h5", "h6", "text-left", "text-right", "text-center", "text-muted", "text-primary", "text-success", "text-info", "text-warning", "text-danger", "label-default", "label-primary", "label-success", "label-info", "label-warning", "label-danger", "lead", "badge"]}
                    },

                    "wm.picture": {
                        "picturesource": {"type": "string", "value": "resources/images/imagelists/default-image.png", "bindable": "in-out-bound"},
                        "pictureaspect": {"type": "list", "options": ["Both", "H", "None", "V"], "value": "None"},
                        "disabled": {"type": "boolean", "bindable": "in-bound"},
                        "tabindex": {"type": "string", "value": "0"},
                        "shape":  {"type": "list", "options": ["", "rounded", "circle", "thumbnail"]},
                        "showindevice": {"type": "selectall", "options": showInDeviceOptions, "value": "all", "displaytype": 'inline-block'},
                        "animation": {"type": "list", "options": animationOptions},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["img-responsive"]}
                    },

                    "wm.textarea": {
                        "autofocus": {"type": "boolean"},
                        "readonly": {"type": "boolean", "bindable": "in-bound"},
                        "datavalue": {"type": "string", "bindable": "in-out-bound"},
                        "scopedatavalue": {"type": "string"},
                        "placeholder": {"type": "string", "value": "Place your text"},
                        "maxchars": {"type": "number"},
                        "updateon": {"type": "list", "value": "blur", "widget": "updateon"},
                        "updatedelay": {"type": "number", "value": 0},
                        "shortcutkey": {"type": "string"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["input-lg", "input-sm"]}
                    },

                    "wm.basicdialog": {
                        "show": {"type": "boolean", "show": false },
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "onClose": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onOpened": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "animation": {"type": "list", "options": animationOptions},
                        "tabindex": {"type": "string", "value": "0"}
                    },
                    "wm.dialog.dialogheader": {
                        "caption": {"type": "string", "maxlength": 256, "bindable": "in-bound"},
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-out-bound", "pattern": classRegex},
                        "iconwidth": {"type": "string", "pattern": dimensionRegex},
                        "iconheight": {"type": "string", "pattern": dimensionRegex},
                        "iconmargin": {"type": "string", "pattern": dimensionRegex},
                        "closable": {"type": "boolean", "show": false}
                    },
                    "wm.dialog.onOk": {
                        "onOk": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },

                    "wm.alertdialog": {
                        "title": {"type": "string", "value": "Alert", "bindable": "in-bound"},
                        "oktext": {"type": "string", "value": "OK", "bindable": "in-bound"},
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-out-bound", "value": "wi wi-warning", "pattern": classRegex},
                        "message": {"type": "string", "value": "I am an alert box!", "bindable": "in-bound"},
                        "alerttype": {"type": "list", "options": ["error", "information", "success", "warning"], "value": "error"}
                    },
                    "wm.confirmdialog": {
                        "title": {"type": "string", "value": "Confirm", "bindable": "in-bound"},
                        "canceltext": {"type": "string", "value": "CANCEL", "bindable": "in-bound"},
                        "oktext": {"type": "string", "value": "OK", "bindable": "in-bound"},
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-out-bound", "value": "wi wi-done", "pattern": classRegex},
                        "message": {"type": "string", "value": "I am confirm box!", "bindable": "in-bound"},
                        "onCancel": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },
                    "wm.iframedialog": {
                        "title": {"type": "string", "value": "External Content", "bindable": "in-bound"},
                        "url": {"type": "string", "value": "http://www.wavemaker.com", "bindable": "in-out-bound"},
                        "height": {"type": "string", "value": "400", "pattern": dimensionRegex},
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-out-bound", "value": "wi wi-globe", "pattern": classRegex},
                        "oktext": {"type": "string", "value": "OK", "bindable": "in-bound"},
                        "closable": {"type": "boolean", "value": true}
                    },
                    "wm.pagedialog": {
                        "title": {"type": "string", "value": "Page Content", "bindable": "in-bound"},
                        "oktext": {"type": "string", "value": "OK", "bindable": "in-bound"},
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-out-bound", "value" : "wi wi-file", "pattern": classRegex},
                        "closable": {"type": "boolean", "value": true}
                    },
                    "wm.logindialog": {
                        "height": {"type": "string", "show": false, "pattern": dimensionRegex},
                        "closable": {"type": "boolean", "value": true},
                        "modal": {"type": "boolean", "value": true},
                        "onSubmit": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },
                    "wm.designdialog": {
                        "modal": {"type": "boolean", "value": false},
                        "closable": {"type": "boolean", "value": true},
                        "title": {"type": "string", "show": false} //for backward compatibility
                    },
                    "wm.spinner": {
                        "show": {"type": "boolean", "value": false},
                        "caption": {"type": "string", "value": "Loading...", "maxlength": 256},
                        "servicevariabletotrack": {"type": "list", "options": []},
                        "iconclass": {"type": "string", "value": "fa fa-spinner", "widget": "selecticon", "bindable": "in-out-bound", "pattern": classRegex},
                        "iconsize": {"type": "string", "pattern": dimensionRegex},
                        "image": {"type": "string", "bindable": "in-bound"},
                        "imagewidth": {"type": "string", "value":"20px"},
                        "imageheight": {"type": "string"},
                        "animation" : {"type": "list", "value": "spin", "options": spinnerAnimationOptions},
                        "type" : {"type": "list", "value": "icon", "options": ["image", "icon"]},
                        "backgroundcolor": {"type": "string", "widget": "color"},
                        "backgroundgradient": {"type": "string"},
                        "backgroundimage": {"type": "string", "bindable": "in-bound"},
                        "backgroundrepeat": {"type": "list", "options": ["no-repeat", "repeat", "repeat-x", "repeat-y"]},
                        "backgroundsize": {"type": "string", "hint": "width, height"},
                        "backgroundposition": {"type": "string", "hint": "top, left"},
                        "backgroundattachment": {"type": "list", "options": ["fixed", "local", "scroll"]},
                        "color": {"type": "string", "hidelabel": true, "widget": "color"},
                        "fontweight": {"type": "string", "options": ["bold"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontsize": {"type": "number", "hidelabel": true, "hint": "Font size", "pattern": numberRegex},
                        "fontunit": {"type": "string", "options": ["em", "px"], "value": "px", "hidelabel": true, "widget": "icons_radio"},
                        "textdecoration": {"type": "string", "options": ["underline"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontstyle": {"type": "string", "options": ["italic"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontVariant": {"type": "list", "options": ["normal", "small-caps"]},
                        "fontfamily": {"type": "string", "hidelabel": true, "hint": "Arial, Geneva"},
                        "misc": {"type": "string"},
                        "opacity": {"type": "string", "widget": "slider"},
                        "zindex": {"type": "string", "pattern": zindexRegex}
                    },

                    'wm.layouts': {

                        "hint": {"type": "string", "bindable": "in-bound"},
                        "name": {"type": "string", "pattern": nameRegex, "maxlength": 32},
                        "class": {"type": "string", "pattern": classRegex},
                        "border": {"type": "string", "widget": "box"},
                        "borderunit": {"type": "string", "options": ["em", "px"], "value": "px", "widget": "icons_radio"},
                        "bordertop": {"type": "string", "pattern": numberRegex},
                        "borderright": {"type": "string", "pattern": numberRegex},
                        "borderbottom": {"type": "string", "pattern": numberRegex},
                        "borderleft": {"type": "string", "pattern": numberRegex},
                        "borderwidth": {"type": "string"},
                        "borderstyle": {"type": "string", "options": ["dashed", "dotted", "none", "solid"], "widget": "borderstyle"},
                        "bordercolor": {"type": "string", "widget": "color"},
                        "padding": {"type": "string", "widget": "box"},
                        "paddingunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "paddingtop": {"type": "string", "pattern": numberRegex},
                        "paddingright": {"type": "string", "pattern": numberRegex},
                        "paddingbottom": {"type": "string", "pattern": numberRegex},
                        "paddingleft": {"type": "string", "pattern": numberRegex},
                        "backgroundcolor": {"type": "string", "widget": "color"},
                        "backgroundgradient": {"type": "string"},
                        "backgroundimage": {"type": "string", "bindable": "in-bound"},
                        "backgroundrepeat": {"type": "list", "options": ["no-repeat", "repeat", "repeat-x", "repeat-y"]},
                        "backgroundsize": {"type": "string", "hint": "width, height"},
                        "backgroundposition": {"type": "string", "hint": "top, left"},
                        "backgroundattachment": {"type": "list", "options": ["fixed", "local", "scroll"]},
                        "color": {"type": "string", "hidelabel": true, "widget": "color"},
                        "text": {"type": "string"},
                        "fontweight": {"type": "string", "options": ["bold"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontsize": {"type": "number", "hidelabel": true, "hint": "Font size", "pattern": numberRegex},
                        "fontunit": {"type": "string", "options": ["em", "px"], "value": "px", "hidelabel": true, "widget": "icons_radio"},
                        "horizontalalign": {"type": "string", "options": ["left", "center", "right"], "widget": "icons_radio"},
                        "textdecoration": {"type": "string", "options": ["underline"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontstyle": {"type": "string", "options": ["italic"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontVariant": {"type": "list", "options": ["normal", "small-caps"]},
                        "fontfamily": {"type": "string", "hidelabel": true, "hint": "Arial, Geneva"},
                        "misc": {"type": "string"},
                        "whitespace": {"type": "list", "options": [" ", "normal", "nowrap", "pre", "pre-line", "pre-wrap"], "value": " "},
                        "wordbreak": {"type": "list", "options": ["break-word", "normal"]},
                        "opacity": {"type": "string", "widget": "slider"},
                        "overflow": {"type": "list", "options": ["visible", "hidden", "scroll", "auto", "initial", "inherit"]},
                        "cursor": {"type": "list", "options": ["crosshair", "default", "e-resize", "help", "move", "n-resize", "ne-resize", "nw-resize", "pointer", "progress", "s-resize", "se-resize", "sw-resize", "text", "wait", "w-resize"]},
                        "zindex": {"type": "string", "pattern": zindexRegex},
                        "accessroles": {"type": "accessrolesselect", "options": roles, "value": EVERYONE}
                    },
                    'wm.containers': {
                        "class": {"type": "string", "pattern": classRegex},
                        "show": {"type": "boolean", "value": true, "bindable": "in-bound"},
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "accessroles": {"type": "accessrolesselect", "options": roles, "value": EVERYONE},
                        "overflow": {"type": "list", "options": ["visible", "hidden", "scroll", "auto", "initial", "inherit"]},
                        "visibility": {"type": "list", "options": visibilityOptions},
                        "display": {"type": "list", "options": displayOptions},
                        "showindevice": {"type": "selectall", "options": showInDeviceOptions, "value": "all", "displaytype": 'block'}
                    },

                    'wm.containers.lazy' : {
                        "loadmode" : {"type" : "list", "options" : ["", "after-select", "after-delay"], "value" : ""},
                        "loaddelay" : {"type" : "number", "min": "10", "value" : "10"},
                        "onReady" : {"type" : "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },

                    'wm.layouts.header': {
                        "height": {"type": "string", "pattern": dimensionRegex}
                    },
                    'wm.layouts.list': {
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "show": {"type": "boolean", "value": true, "bindable": "in-out-bound"},
                        "layout":  {"type": "list", "options": ["inline", "vertical"], "value": "vertical"},
                        "showindevice": {"type": "selectall", "options": showInDeviceOptions, "value": "all", "displaytype": 'block'},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["well", "alert", "alert-success", "alert-info", "alert-warning", "alert-danger"]}
                    },
                    'wm.layouts.breadcrumb': {
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "show": {"type": "boolean", "value": true, "bindable": "in-out-bound"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "scopedataset": {"type": "string"}
                    },
                    'wm.layouts.nav': {
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "show": {"type": "boolean", "value": true, "bindable": "in-out-bound"},
                        "layout":  {"type": "list", "options": ["", "stacked", "justified"]},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "scopedataset": {"type": "string"},
                        "type":  {"type": "list", "options": ["navbar", "pills", "tabs"]},
                        "itemicon": {"type": "list", "options": [""], "datasetfilter" : "terminals"},
                        "itemlabel": {"type": "list", "options": [""], "datasetfilter" : "terminals"},
                        "itemlink": {"type": "list", "options": [""], "datasetfilter" : "terminals"},
                        "itemchildren": {"type": "list", "options": [""], "datasetfilter" : "objects"},
                        "addchild": {"hidelabel": true, "options": [{'label': 'Anchor', 'widgettype': 'wm-anchor', 'defaults': {'wm-anchor': {'iconclass': 'wi wi-file'} } }, {'label': 'Menu', 'widgettype': 'wm-menu', 'defaults': {'wm-menu': {'iconclass': 'wi wi-file', 'type': 'anchor'} } }, {'label': 'Popover', 'widgettype': 'wm-popover', 'defaults': {'wm-popover': {'iconclass': 'wi wi-file'} } }, {'label': 'Button', 'widgettype': 'wm-button', 'defaults': {'wm-button': {'iconclass': 'wi wi-file'} } }], "widget": "add-widget"},
                        "selecteditem": {"type": "object", "bindable": "in-out-bound", "show": false, "widget": "string"},
                        "onSelect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["nav-justified", "nav-tabs-justified"]}
                    },
                    'wm.layouts.navbar': {
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "show": {"type": "boolean", "value": true, "bindable": "in-out-bound"},
                        "title": {"type": "string", "bindable": "in-bound"},
                        "imgsrc": {"type": "string", "bindable": "in-bound"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["navbar-inverse", "navbar-header", "navbar-right", "navbar-left", "navbar-fixed-top", "navbar-fixed-bottom", "navbar-static-top"]}
                    },
                    'wm.layouts.mobile.navbar': {
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "show": {"type": "boolean", "value": true, "bindable": "in-out-bound"},
                        "title": {"type": "string", "bindable": "in-bound"},
                        "leftnavpaneliconclass": {"type": "string", "widget": "selecticon", "pattern": classRegex, "value": "wi wi-menu"},
                        "backbutton":  {"type": "boolean", "value": true},
                        "backbuttoniconclass": {"type": "string", "widget": "selecticon", "pattern": classRegex, "value": "wi wi-back"},
                        "backbuttonlabel":  {"type": "string"},
                        "searchbutton":  {"type": "boolean", "value": false},
                        "searchbuttoniconclass": {"type": "string", "widget": "selecticon", "pattern": classRegex, "value": "wi wi-search", "show": false},
                        "searchbuttonlabel":  {"type": "string", "show": false},
                        "searchplaceholder": {"type": "string", "value": "Search", "show": false},
                        "onSearch": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onBackbtnclick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "imgsrc": {"type": "string", "bindable": "in-bound"},
                        "scopedatavalue": {"type": "string"},
                        "datavalue": {"type": "string, object", "widget": "string", "bindable": "in-out-bound"},
                        "scopedataset": {"type": "string"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "searchkey": {"type": "list", "options": [""], "datasetfilter": "terminals"},
                        "displaylabel": {"type": "list", "options": [""], "datasetfilter": "terminals"},
                        "displayimagesrc": {"type": "list", "options": [""], "datasetfilter": "terminals"},
                        "datafield": {"type": "list", "options": ["All Fields"], "value": "All Fields", "datasetfilter" : "terminals", "allfields" : true},
                        "defaultview": {"type": "selectByObject", "options": [{"label": "action-view", "value": "actionview"}, {"label": "search-view", "value": "searchview"}], "value": "actionview", "displayfield": "label", "datafield": "value" },
                        "query": {"type": "string", "bindable": "in-out-bound", "value": ""},
                        "addchild": {"hidelabel": true, "options": [{"label": "Anchor", "widgettype": "wm-anchor", "defaults": {"iconclass": "wi wi-plus", "caption": ""}}, {"label": "Menu", "widgettype": "wm-menu", "defaults": {"iconclass": "wi wi-plus", "type": "anchor", "caption": ""}}, {"label": "Popover", "widgettype": "wm-popover", "defaults": {"iconclass": "wi wi-plus", "caption": ""}}, {"label": "Button", "widgettype": "wm-button", "defaults": {"iconclass": "wi wi-plus", "class": "navbar-btn btn-primary", "caption": ""}}], "widget": "add-widget"}
                    },
                    'wm.layouts.listtemplate': {
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "class": {"type": "string", "show": false, "pattern": classRegex}
                    },
                    'wm.layouts.mediatemplate': {
                        "width": {"type": "string", "pattern": dimensionRegex, "value": 100},
                        "height": {"type": "string", "pattern": dimensionRegex, "value": 100}
                    },
                    'wm.layouts.listitem': {
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "margin": {"type": "string", "widget": "box"},
                        "marginunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "margintop": {"type": "string", "pattern": numberRegex},
                        "marginbottom": {"type": "string", "pattern": numberRegex},
                        "marginright": {"type": "string", "pattern": numberRegex},
                        "marginleft": {"type": "string", "pattern": numberRegex}
                    },
                    'wm.layouts.topnav': {
                        "height": {"type": "string", "pattern": dimensionRegex}
                    },
                    'wm.layouts.leftpanel': {
                        "columnwidth": {"type": "list", "options": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], "value": "2"},
                        "animation" : {"type": "list", "options": ["slide-in", "slide-over"], "value" : "slide-in"}
                    },
                    'wm.layouts.rightpanel': {
                        "columnwidth": {"type": "list", "options": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], "value": "2"}
                    },
                    'wm.layouts.content': {
                        "height": {"type": "string", "pattern": dimensionRegex}
                    },
                    'wm.layouts.panel': {
                        "title": {"type": "string", "value": "Title", "bindable": "in-bound"},
                        "description": {"type": "string", "bindable": "in-bound", "widget": "textarea"},
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-out-bound", "pattern": classRegex},
                        "collapsible": {"type": "boolean"},
                        "enablefullscreen": {"type": "boolean"},
                        "expanded": {"type": "boolean", "value": true},
                        "closable": {"type": "boolean"},
                        "helptext": {"type": "string", "bindable": "in-out-bound", "widget": "textarea"},
                        "actions": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "badgevalue": {"type": "string", "bindable": "in-out-bound"},
                        "badgetype": {"type": "list", "options": ["default", "primary", "success", "info", "warning", "danger"], "value": "default", "bindable": "in-out-bound"},
                        "marginunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "margin": {"type": "string", "widget": "box"},
                        "margintop": {"type": "string", "pattern": numberRegex},
                        "marginbottom": {"type": "string", "pattern": numberRegex},
                        "marginright": {"type": "string", "pattern": numberRegex},
                        "marginleft": {"type": "string", "pattern": numberRegex},
                        /*Events*/
                        "onEnterkeypress": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseenter": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseleave": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseout": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseover": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onClose": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onExpand": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onCollapse": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onFullscreen": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onExitfullscreen": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onActionsclick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "animation": {"type": "list", "options": animationOptions},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "value": "panel-default", "options": ["panel-primary", "panel-success", "panel-info", "panel-warning", "panel-danger"]}
                    },
                    'wm.layouts.container': {
                        "marginunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "margin": {"type": "string", "widget": "box"},
                        "margintop": {"type": "string", "pattern": numberRegex},
                        "marginbottom": {"type": "string", "pattern": numberRegex},
                        "marginright": {"type": "string", "pattern": numberRegex},
                        "marginleft": {"type": "string", "pattern": numberRegex},
                        /*Events*/
                        "onEnterkeypress": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onClick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onDblclick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onTap": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onDoubletap": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseenter": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseleave": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseout": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseover": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "animation": {"type": "list", "options": animationOptions},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["well", "alert", "alert-success", "alert-info", "alert-warning", "alert-danger"]}
                    },
                    'wm.layouts.tile': {
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "marginunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "margin": {"type": "string", "widget": "box"},
                        "margintop": {"type": "string", "pattern": numberRegex},
                        "marginbottom": {"type": "string", "pattern": numberRegex},
                        "marginright": {"type": "string", "pattern": numberRegex},
                        "marginleft": {"type": "string", "pattern": numberRegex},
                        /*Events*/
                        "onEnterkeypress": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onClick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onDblclick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onTap": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onDoubletap": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseenter": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseleave": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseout": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onMouseover": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "animation": {"type": "list", "options": animationOptions},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["card", "well", "alert", "alert-success", "alert-info", "alert-warning", "alert-danger"]}
                    },
                    'wm.layouts.footer': {
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["card-footer"]}
                    },
                    'wm.layouts.layoutgrid': {
                        "name": {"type": "string", "pattern": nameRegex, "maxlength": 32},
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "width": {"type": "string", "value": '100%', "pattern": dimensionRegex},
                        "marginunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "margin": {"type": "string", "widget": "box"},
                        "margintop": {"type": "string", "pattern": numberRegex},
                        "marginbottom": {"type": "string", "pattern": numberRegex},
                        "marginright": {"type": "string", "pattern": numberRegex},
                        "marginleft": {"type": "string", "pattern": numberRegex},
                        "show": {"type": "boolean", "value": true, "bindable": "in-bound"},
                        "insert": {"type": "toolbar", "actions": [{'action': 'addrow', 'label': 'LABEL_PROPERTY_ADDROW', 'icon': 'add-row'}]},
                        "columns": {"type": "list", "options": ["1", "2", "3", "4", "6", "12"]}
                    },
                    'wm.layouts.gridcolumn': {
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "columnwidth": {"type": "list", "options": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]},
                        "insert": {"type": "toolbar", "actions": [{'action': 'addcolumnleft', 'label': 'LABEL_PROPERTY_ADDCOLUMNLEFT', 'icon': 'add-column-left'}, {'action': 'addcolumnright', 'label': 'LABEL_PROPERTY_ADDCOLUMNRIGHT', 'icon': 'add-column-right'}]},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["visible-xs-block", "visible-sm-block", "visible-md-block", "visible-lg-block", "hidden-xs", "hidden-sm", "hidden-md", "hidden-lg"]}
                    },
                    'wm.layouts.gridrow': {
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "insert": {"type": "toolbar", "actions": [{'action': 'addrowbelow', 'label': 'LABEL_PROPERTY_ADDROWBELOW', 'icon': 'add-row-below'}, {'action': 'addrowabove', 'label': 'LABEL_PROPERTY_ADDROWABOVE', 'icon': 'add-row-above'}, {'action': 'addcolumn', 'label': 'LABEL_PROPERTY_ADDCOLUMN', 'icon': 'add-column'}]}
                    },
                    'wm.layouts.column': {
                        "columnwidth": {"type": "list", "options": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
                    },
                    'wm.layouts.pagecontent': {
                        "columnwidth": {"type": "list", "options": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
                    },
                    'wm.layouts.row': {
                        "show": {"type": "boolean", "value": true}
                    },
                    'wm.layouts.view': {
                        "show": {"type": "boolean", "value": true, "bindable" : "in-out-bound"},
                        "viewgroup": {"type": "string", "value": "default"},
                        "animation": {"type": "list", "options": animationOptions}
                    },
                    'wm.layouts.form': {
                        "title": {"type": "string",  "bindable": "in-bound"},
                        "novalidate": {"type": "boolean", "value": false},
                        "autocomplete": {"type": "boolean", "value": true},
                        "action": {"type": "string", "bindable": "in-bound"},
                        "target": {"type": "list", "options": ["_blank", "_parent", "_self", "_top"], "value": "", "widget": "datalist"},
                        "margin": {"type": "string", "widget": "box"},
                        "marginunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "margintop": {"type": "string", "pattern": numberRegex},
                        "marginbottom": {"type": "string", "pattern": numberRegex},
                        "marginright": {"type": "string", "pattern": numberRegex},
                        "marginleft": {"type": "string", "pattern": numberRegex},
                        "method": {"type": "list", "options": ["post", "put", "delete"]},
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "captionsize": {"type": "string"},
                        "formdata": {"type": "object", "show": false, "bindable": "out-bound", "widget": "string"},
                        "postmessage": {"type": "string", "value": "Data posted successfully", "bindable": "in-out-bound"},
                        "captionalign": {"type": "list", "options": ["left", "center", "right"], "value": "left"},
                        "enctype": {"type": "list", "options": ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]},
                        "captionposition": {"type": "list", "options": ["left", "right", "top"], "value": "left"},
                        "onSubmit": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "tabindex": {"type": "string", "value": "0"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["panel-primary", "panel-success", "panel-info", "panel-warning", "panel-danger"]}
                    },
                    'wm.layouts.liveform': {
                        "title": {"type": "string",  "bindable": "in-bound"},
                        "formlayout": {"type": "switch", "options":  [{"label": "INLINE", "value": "inline"}, {"label": "PAGE", "value": "page"}], "value": "inline", "show" : false, "displayfield": "label", "datafield": "value"},
                        "autocomplete": {"type": "boolean", "value": true, "showindesigner": true},
                        "captionsize": {"type": "string", "value": "", "showindesigner": true},
                        "captionalign": {"type": "string", "options": ["left", "center", "right"], "value": "left", "showindesigner": true, "widget": "icons_radio"},
                        "captionposition": {"type": "string", "options": ["left", "right", "top"], "value": "left", "showindesigner": true, "widget": "icons_radio", "prefix": "position-"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "advancedsettings": {"type": "button", "hidelabel": true, "disabled": true, "iconclass": "settings"},
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "rowdata": {"type": "string"},
                        "formdata": {"type": "object", "bindable": "in-bound", "widget": "string"},
                        "dataoutput": {"type": "object", "bindable": "out-bound", "widget": "string"},
                        "name": {"type": "string", "pattern": nameRegex, "maxlength": 32},
                        "novalidate": {"type": "boolean", "value": true, "showindesigner": true},
                        "show": {"type": "boolean", "value": true},
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-bound", "pattern": classRegex},
                        "horizontalalign": {"type": "string", "options": ["left", "center", "right"], "widget": "icons_radio", "show": false},
                        "defaultmode": {"type": "switch", "options": [{"label": "READ ONLY", "value": "View"}, {"label": "EDITABLE", "value": "Edit"}], "value": "View", "showindesigner": true, "displayfield": "label", "datafield": "value"},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "messagelayout": {"type": "list", "options": ["Inline", "Toaster"], "value": "Toaster", "showindesigner": true},
                        "insertmessage": {"type": "string", "value": "Record added successfully", "bindable": "in-out-bound", "showindesigner": true},
                        "updatemessage": {"type": "string", "value": "Record updated successfully", "bindable": "in-out-bound", "showindesigner": true},
                        "deletemessage": {"type": "string", "value": "Record deleted successfully", "bindable": "in-out-bound", "showindesigner": true},
                        "errormessage": {"type": "string", "value": "An error occured. Please try again!", "bindable": "in-out-bound", "showindesigner": true},
                        /*Events*/
                        "onBeforeservicecall": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onResult": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onError": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onSuccess": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "tabindex": {"type": "string", "value": "0"},
                        // property specific to mobile with formlayout page
                        "onBackbtnclick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist", "show": false},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["panel-default", "panel-primary", "panel-success", "panel-info", "panel-warning", "panel-danger"]}
                    },
                    "wm.layouts.segmentedcontrol" : {
                        "onBeforeSegmentChange": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onSegmentChange": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "width": {"show": false},
                        "height": {"pattern": dimensionRegex},
                        "tabindex": {"type": "string", "value": "0"},
                        "addchild": {"hidelabel": true, "options": [{"label": "Segmented Content", "widgettype": "wm-segment-content"}], "widget": "add-widget"}
                    },
                    "wm.layouts.segmentcontent" : {
                        "caption": {"type": "string", "bindable": "in-out-bound", "maxlength": 256},
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-out-bound", "pattern": classRegex}
                    },
                    'wm.grid': {
                        "width": {"value": "100%", "pattern": dimensionRegex},
                        "height": {"value": "200px", "pattern": dimensionRegex},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "scopedataset": {"type": "string"},
                        "pagesize": {"type": "number"},
                        "advancedsettings": {"type": "button", "hidelabel": true, "iconclass": "settings"},
                        "gridfirstrowselect": {"type": "boolean", "showindesigner": true},
                        "confirmdelete": {"type": "string", "value": "Are you sure you want to delete this?", "bindable": "in-out-bound", "show": false, "showindesigner": false},
                        "deleterow": {"type": "boolean", "bindable": "in-out-bound", "showindesigner": true},
                        "updaterow": {"type": "boolean", "bindable": "in-out-bound", "showindesigner": true},
                        "showheader": {"type": "boolean", "value": true, "showindesigner": true},
                        "gridsearch": {"type": "boolean", "showindesigner": true},
                        "searchlabel": {"type": "string", "value": "Search", "bindable": "in-out-bound", "show": false, "showindesigner": false, "alignright": true},
                        "enablesort": {"type": "boolean", "value": true, "showindesigner": true},
                        "showrowindex": {"type": "boolean", "showindesigner": true},
                        "multiselect": {"type": "boolean", "showindesigner": true},
                        "radioselect": {"type": "boolean", "showindesigner": true},
                        "insertrow": {"type": "boolean", "bindable": "in-out-bound", "showindesigner": true},
                        "readonlygrid": {"type": "boolean", "value": true, "show": false, "bindable": "in-bound"},
                        "showrecordcount": {"type": "boolean", "show": false, "showindesigner": true},
                        "shownavigation": {"type": "boolean", "value": true, "showindesigner": true},
                        "filternullrecords": {"type": "boolean", "value": true},
                        "nodatamessage": {"type": "string", "value": "No data found.", "bindable": "in-out-bound", "showindesigner": true},
                        "loadingdatamsg": {"type": "string", "value": "Loading...", "bindable": "in-out-bound", "showindesigner": true},
                        "deletemessage": {"type": "string", "value": "Record deleted successfully", "bindable": "in-out-bound", "show": false, "showindesigner": false},
                        "selecteditem": {"type": "object", "bindable": "in-out-bound", "show": false, "widget": "string"},
                        "title": {"type": "string", "bindable": "in-bound"},
                        "spacing": {"type": "list", "options": ["normal", "condensed"], "value": "normal"},

                        /* Events */
                        "onClick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onTap": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onSelect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onDeselect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onSort": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onHeaderclick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onShow": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onHide": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onRowdeleted": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onBeforerowinsert": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onRowinsert": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onRowclick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onRowdblclick": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onColumnselect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onColumndeselect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onEnterkeypress": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onSetrecord": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},

                        /* Styles */
                        "gridclass": {"type": "string", "value": "table-bordered table-striped table-hover", "pattern": classRegex, "widget": "list-picker", "options": ["table-hover", "table-bordered", "table-striped"]},
                        "tabindex": {"type": "string", "value": "0"}
                    },
                    'wm.livegrid': {
                        'formlayout': {"type": "list", "options": ["inline", "dialog"], "value": "inline"}
                    },
                    'wm.fileupload': {
                        "service": {"type": "list", "widget": "list"},
                        "operation": {"type": "list", "widget": "list"},
                        "multiple": {"type": "boolean", "value": false},
                        "contenttype": {"type": "list", "widget" : "list-picker", "options": ["image/*", "audio/*", "video/*", ".txt", ".zip", ".rar", ".js", ".json", ".xls", ".xlsx", ".pdf", ".csv", ".xml", ".doc", ".docx", ".log", ".rtf", ".bmp", ".gif", ".jpe", ".jpg", ".jpeg", ".tif", ".tiff", ".pbm", ".png", ".ico", "mp3", ".ogg", ".webm", ".wma", ".3gp", ".wav", "mp4", ".ogg", ".webm", ".wmv", ".mpeg", ".mpg", ".avi"]},
                        "fileuploadmessage": {"type": "string", "bindable": "in-out-bound", "value": "You can also browse for files"},
                        "tabindex": {"type": "string", "value": "0"},
                        "uploadedFiles": {"type": "array", "bindable": "in-out-bound"},
                        "selectedFiles": {"type": "array, file", "bindable": "in-out-bound", "show" : "false"},
                        "mode": {"type": "list", "options": ["Upload", "Select"], "value": "Upload"},
                        "destination": {"type": "string", "widget": "fileupload-relativepath", "bindable": "in-out-bound", "value": "", "info": "/resources/uploads/"},
                        "maxfilesize": {"type": "string", "widget": "fileupload-relativepath", "value": "",  "info": "size in MB"},
                        "caption": {"type": "string", "value": "Upload", "bindable": "in-out-bound", "maxlength": 256},
                        "disabled": {"type": "boolean", "value": false, "bindable": "in-bound"},
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-out-bound", "value" : "wi wi-file-upload", "pattern": classRegex},

                        /* ---- events ---- */
                        "onSelect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onProgress": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onAbort": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },
                    'wm.youtube': {
                        "width": { "value": "800px", "pattern": dimensionRegex},
                        "height": {"value": "125px", "pattern": dimensionRegex},
                        "uploadpath": {"type": "string"}
                    },
                    "wm.anchor": {
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-out-bound", "pattern": classRegex},
                        "iconurl": {"type": "string", "bindable": "in-bound"},
                        "iconwidth": {"type": "string", "pattern": dimensionRegex},
                        "iconheight": {"type": "string", "pattern": dimensionRegex},
                        "iconmargin": {"type": "string", "pattern": dimensionRegex},
                        "iconposition": {"type": "list", "options": ["left", "top", "right"]},
                        "caption": {"type": "string", "value": "Link", "bindable": "in-out-bound", "maxlength": 256},
                        "badgevalue": {"type": "string", "bindable": "in-out-bound"},
                        "hyperlink": {"type": "string", "bindable": "in-out-bound"},
                        "target": {"type": "list", "options": ["_blank", "_parent", "_self", "_top"], "value": "_self", "widget": "datalist"},
                        "tabindex": {"type": "string", "value": "0"},
                        "whitespace": {"type": "list", "options": [" ", "normal", "nowrap", "pre", "pre-line", "pre-wrap"], "value": " "},
                        "wordbreak": {"type": "list", "options": ["break-word", "normal"]},
                        "misc": {"type": "string"},
                        "opacity": {"type": "string", "widget": "slider"},
                        "cursor": {"type": "list", "options": ["crosshair", "default", "e-resize", "help", "move", "n-resize", "ne-resize", "nw-resize", "pointer", "progress", "s-resize", "se-resize", "sw-resize", "text", "wait", "w-resize"]},
                        "zindex": {"type": "string", "pattern": zindexRegex},
                        "showindevice": {"type": "selectall", "options": showInDeviceOptions, "value": "all", "displaytype": 'inline'},
                        "animation": {"type": "list", "options": animationOptions},
                        "shortcutkey": {"type": "string"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["h1", "h2", "h3", "h4", "h5", "h6", "btn-primary", "btn-success", "btn-info", "btn-warning", "btn-danger", "btn-lg", "btn-sm", "btn-xs", "btn-link", "text-left", "text-right", "text-center", "text-muted", "text-primary", "text-success", "text-info", "text-warning", "text-danger", "lead", "badge"]}
                    },
                    "wm.popover": {
                        "contentsource": {"type": "list", "options": ['inline', 'partial'], value: "partial"},
                        "content": {"type": "list", "options": [], "widget": "pages-list", value: "", "bindable": "in-bound"},
                        "inlinecontent": {"type": "string", "widget": "textarea"},
                        "hyperlink": {"type": "string", "value": "", "show": false},
                        "target": {"type": "string", "value" : "", "show": false},
                        "popoverwidth" :  {"type": "string"},
                        "popoverheight" :  {"type": "string"},
                        "popoverarrow" :  {"type": "boolean", "value" : true},
                        "popoverautoclose": {"type": "boolean", "value" : true},
                        "popoverplacement": {"type": "list", "options": ["bottom", "left", "right", "top"], "value": "bottom"},
                        "title": {"type": "string", "bindable": "in-bound"},
                        "onShow": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onHide": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },
                    "wm.prefabs": {
                        "margin": {"type": "string", "widget": "box"},
                        "debugurl": {"type": "string", "show": false},
                        "marginunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "onLoad": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onDestroy": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "animation": {"type": "list", "options": animationOptions},
                        "tabindex": {"type": "string", "value": "0"}
                    },

                    "wm.accordion": {
                        "addchild": {"hidelabel": true, "options": [{"label": "Accordion pane", "widgettype": "wm-accordionpane"}], "widget": "add-widget"},
                        "closeothers": { "type": "boolean", "value": true},
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "tabindex": {"type": "string", "value": "0"}
                    },

                    "wm.accordionpane": {
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["panel-primary", "panel-success", "panel-info", "panel-warning", "panel-danger"]},
                        "onExpand": {"type": "event", "options": widgetEventOptions, "widget": "eventlist", "show": false},
                        "onCollapse": {"type": "event", "options": widgetEventOptions, "widget": "eventlist", "show": false}
                    },
                    "wm.accordionheader": {
                        "heading": {"type": "string", "value": "Heading", "bindable": "in-bound"},
                        "description": {"type": "string", "bindable": "in-bound", "widget": "textarea"},
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-out-bound", "pattern": classRegex},
                        "badgevalue": {"type": "string", "bindable": "in-out-bound"},
                        "badgetype": {"type": "list", "options": ["default", "primary", "success", "info", "warning", "danger"], "value": "default", "bindable": "in-out-bound"},
                        "tabindex": {"type": "string", "value": "0"},
                        "isdefaultpane": {"type": "boolean", "bindable": "in-bound"},
                        "onExpand": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onCollapse": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },

                    "wm.richtexteditor": {
                        "show": {"type": "boolean", "value": true},
                        "readonly": {"type": "boolean", "bindable": "in-bound"},
                        "overflow": {"type": "list", "options": ["visible", "hidden", "scroll", "auto", "initial", "inherit"]},
                        "datavalue": {"type": "string", value: "", "bindable": "in-out-bound"},
                        "showpreview": {"type": "boolean", "value": false},
                        "placeholder": {"type": "string"},
                        "tabindex": {"type": "string", "value": "0"},
                        "scopedatavalue": {"type": "string"},
                        "onChange": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },

                    "wm.tabs": {
                        "addchild": {"hidelabel": true, "options": [{"label": "Tab pane", "widgettype": "wm-tabpane"}], "widget": "add-widget"},
                        "tabsposition": {"type": "list",  "options": ["left", "top", "right", "bottom"], "value": "top"},
                        "taborder": {"type": "list", "widget": "tabordering", "dataset": []},
                        "transition": {"type": "list", "options": ["none", "slide"], "value": "none"}
                    },

                    "wm.tab": {
                        "heading": {"type": "string", "bindable": "in-bound"}
                    },
                    "wm.tabpane": {
                        "disabled": {"type": "boolean", "bindable": "in-bound"},
                        "onSelect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist", "show": false},
                        "onDeselect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist", "show": false}
                    },
                    "wm.tabheader": {
                        "heading": {"type": "string", "value": "Tab Title", "bindable": "in-bound"},
                        "paneicon": {"type": "string", "widget": "selecticon", "bindable": "in-bound", "pattern": classRegex},
                        "isdefaulttab": {"type": "boolean", "bindable": "in-bound"},
                        "tabindex": {"type": "string", "value": "0"},
                        "onSelect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onDeselect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },
                    "wm.carousel" : {
                        "addchild": {"hidelabel": true, "options": [{"label": "Carousel", "widgettype": "wm-carousel-content"}], "widget": "add-widget"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string", "show": false},
                        "animationinterval" : {"type" : "number", "value" : "3"},
                        "type" : {"type" : "string", "show" : false}
                    },
                    "wm.tabbar" : {
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "dropposition": {"type": "list", "options": ["down", "up"], "value": "up"},
                        "onSelect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "morebuttoniconclass": {"type": "string", "widget": "selecticon", "pattern": classRegex, "value": "wi wi-more-horiz"},
                        "morebuttonlabel":  {"type": "string", "value": "more"}
                    },
                    "wm.tabbar.dataProps": {
                        "itemlabel": {"type": "string", "widget": "list", "options": [""], "bindable": "in-bound", "bindonly": "expression", "datasetfilter" : "terminals"},
                        "itemlink": {"type": "string", "widget": "list", "options": [""], "bindable": "in-bound", "bindonly": "expression", "datasetfilter" : "terminals"},
                        "itemicon": {"type": "string", "widget": "list", "options": [""], "bindable": "in-bound", "bindonly": "expression", "datasetfilter" : "terminals"}
                    },
                    "wm.livelist": {
                        "name": {"type": "string", "pattern": nameRegex, "maxlength": 32},
                        "title": {"type": "string", "bindable": "in-bound"},
                        "show": {"type": "boolean", "value": true, "bindable": "in-bound"},
                        "enablereorder": {"type": "boolean"},
                        "accessroles": {"type": "accessrolesselect", "options": roles, "value": EVERYONE},
                        "onSelectionlimitexceed" : {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onReorder" : {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "pagesize": {"type": "number"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "scopedataset": {"type": "string"},
                        "selectionlimit": {"type": "number", "bindable": "in-bound"},
                        "itemsperrow": {"type": "list", "options": ["1", "2", "3", "4", "6", "12"], "value": "1"},
                        "selecteditem": {"type": "object", "bindable": "in-out-bound", "show": false, "widget": "string"},
                        "onEnterkeypress": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onSetrecord": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "itemclass": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["list-group-item", "media"]},
                        "listclass": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["list-group", "list-inline", "media-list"]},
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-bound", "value": "", "pattern": classRegex},
                        "navigation": {"type": "list", "options": ["None", "Basic", "Advanced", "Scroll"], "value": "None"},
                        "selectfirstitem": {"type": "boolean", "value": false, "bindable": "in-out-bound"},
                        "tabindex": {"type": "string", "value": "0"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["panel-default","panel-primary", "panel-success", "panel-info", "panel-warning", "panel-danger"]},
                        "groupby": {"type": "list", "show": true},
                        "match": {"type": "list", "options": ["alphabet", "word"], "show": false, "value": "word"}
                    },
                    "wm.medialist": {
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "thumbnailurl": {"type": "list", "options": ["All Fields"], "value": "All Fields", "datasetfilter" : "terminals"},
                        "mediaurl": {"type": "list", "options": ["All Fields"], "value": "All Fields", "datasetfilter" : "terminals"},
                        "layout": {"type": "list", "options": ["Single-row", "Multi-row"], "value": "Single-row"},
                        "tabindex": {"type": "string", "value": "0"}
                    },
                    "wm.livefilter": {
                        "title": {"type": "string"},
                        "autocomplete": {"type": "boolean", "value": true, "showindesigner": true},
                        "captionsize": {"type": "string", "value": "", "showindesigner": true},
                        "captionalign": {"type": "string", "options": ["left", "center", "right"], "value": "left", "showindesigner": true, "widget": "icons_radio"},
                        "captionposition": {"type": "string", "options": ["left", "right", "top"], "value": "left", "showindesigner": true, "widget": "icons_radio", "prefix": "position-"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "scopedataset": {"type": "string"},
                        "advancedsettings": {"type": "button", "hidelabel": true, "disabled": true, "iconclass": "settings"},
                        "result": {"type": "object", "bindable": "out-bound", "widget": "string", "show": "false"},
                        "pagesize": {"type": "number", "value": 20},
                        "horizontalalign": {"type": "string", "options": ["left", "center", "right"], "widget": "icons_radio", "show": false},
                        "iconclass": {"type": "string", "widget": "selecticon", "bindable": "in-bound", "value": "wi wi-filter-list", "pattern": classRegex},
                        /* Events */
                        "onBeforeservicecall": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onError": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onSuccess": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "tabindex": {"type": "string", "value": "0"},
                        "collapsible": {"type": "boolean", "showindesigner": true},
                        "expanded": {"type": "boolean", "value": true, "showindesigner": true},
                        "enableemptyfilter": {"type": "selectall", "options": ["null", "empty"], "displaytype": "block", "value": " ", "showindesigner": true},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["panel-default", "panel-primary", "panel-success", "panel-info", "panel-warning", "panel-danger"]}
                    },
                    "wm.search": {
                        "scopedatavalue": {"type": "string"},
                        "datavalue": {"type": "string, object", "widget": "string", "bindable": "in-out-bound"},
                        "scopedataset": {"type": "string"},
                        "query": {"type": "string", "bindable": "out-bound"},
                        "searchkey": {"type": "string", "widget": "list", "options": [""], "bindable": "in-bound", "datasetfilter" : "terminals"},
                        "displaylabel": {"type": "list", "options": [""], "bindable": "in-bound", "bindonly": "expression", "datasetfilter" : "terminals"},
                        "displayimagesrc": {"type": "list", "options": [""], "bindable": "in-bound", "bindonly": "expression", "datasetfilter" : "terminals"},
                        "datafield": {"type": "list", "options": ["All Fields"], "value": "All Fields", "datasetfilter" : "terminals", "allfields" : true},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "limit": {"type": "number"},
                        "placeholder": {"type": "string", "value": "Search"},
                        "onSubmit": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "show": {"type": "boolean", "value": true, "bindable": "in-out-bound"},
                        "tabindex": {"type": "string", "value": "0"},
                        "showindevice": {"type": "selectall", "options": showInDeviceOptions, "value": "all", "displaytype": 'inline-block'},
                        "width": {"type": "string", "value": '100%', "pattern": dimensionRegex},
                        "shortcutkey": {"type": "string"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["input-group-sm", "input-group-lg"]},
                        "casesensitive": {"type": "boolean", "show": "false", "value": false},
                        /* searchbar in mobile-navbar*/
                        "navsearchbar": {"type": "string", "show": "false"}
                    },
                    "wm.chart": {
                        "height": {"type": "string", value: "210px", "pattern": dimensionRegex},
                        "width": {"type": "string", "pattern": dimensionRegex},
                        "type": {"type": "string", "widget": "list", "options": ["Column", "Line", "Area", "Cumulative Line", "Bar", "Pie", "Donut", "Bubble"], "bindable": "in-out-bound"},
                        "scopedataset": {"type": "string"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "xaxisdatakey": {"type": "list", "widget": "list"},
                        "xaxislabel": {"type": "string"},
                        "xunits": {"type": "string"},
                        "xnumberformat": {"type": "list", "show": false, "options": ["Decimal Digits", "Precision", "Exponential", "Percentage", "Round", "Round Percentage", "Round to Thousand", "Round to Million", "Round to Billion"]},
                        "xdigits": {"type": "number", "show": false, "value": 1},
                        "xdateformat": {"type": "listGroup", "show": false, "options": dateOptions, "value": "%x"},
                        "yaxisdatakey": {"type": "list", "widget": "multiselect"},
                        "yaxislabel": {"type": "string"},
                        "yunits": {"type": "string"},
                        "ynumberformat": {"type": "list", "show": false, "options": ["Decimal Digits", "Precision", "Exponential", "Percentage", "Round", "Round Percentage", "Round to Thousand", "Round to Million", "Round to Billion"]},
                        "ydigits": {"type": "number", "show": false, "value": 1},
                        "ydateformat": {"type": "listGroup", "show": false, "options": dateOptions, "value": "%x"},
                        "bubblesize": {"type": "string", "widget": "list"},
                        "shape": {"type": "string", "widget": "list", "options": ["circle", "square", "diamond", "cross", "triangle-up", "triangle-down", "random"], value: "circle"},
                        "show": {"type": "boolean", "value": true, "bindable": "in-out-bound"},
                        "highlightpoints": {"type": "boolean"},
                        "linethickness": {"type": "string"},
                        "tooltips": {"type": "boolean", "value": true},
                        "showlegend": {"type": "boolean", "value": true},
                        "captions": {"type": "boolean", "value": true},
                        "showxaxis": {"type": "boolean", "value": true},
                        "showyaxis": {"type": "boolean", "value": true},
                        "legendposition": {"type": "list", "options": ["Top", "Bottom"], "value": "Top", "disabled": false},
                        "legendtype": {"type": "list", "options": ["furious", "classic"], "value": "furious", "disabled": false},
                        "showvalues": {"type": "boolean", "value": false},
                        "showlabels": {"type": "boolean", "value": true},
                        "showcontrols": {"type": "boolean", "value": false},
                        "useinteractiveguideline": {"type": "boolean", "value": false},
                        "staggerlabels": {"type": "boolean", "value": false},
                        "reducexticks": {"type": "boolean", "value": true},
                        "labeltype": {"type": "list", "options": ["key", "value", "percent"], "value": "percent"},
                        "offset": {"type": "string", "widget": "box"},
                        "offsettop": {"type": "number", "value": 25, "pattern": numberRegex},
                        "offsetbottom": {"type": "number", "value": 55, "pattern": numberRegex},
                        "offsetleft": {"type": "number", "value": 75, "pattern": numberRegex},
                        "offsetright": {"type": "number", "value": 25, "pattern": numberRegex},
                        "barspacing": {"type": "number", "value": 0.5, "min": "0.1", "max": "0.9", "step": "0.1"},
                        "donutratio": {"type": "number", "value": 0.6, "min": "0.1", "max": "1", "step": "0.1"},
                        "title": {"type": "string", "bindable": "in-out-bound"},
                        "showlabelsoutside": {"type": "boolean", "value": true},
                        "xaxislabeldistance": {"type": "number", "value": 12, "show": false},
                        "yaxislabeldistance": {"type": "number", "value": 12, "show": false},
                        "showxdistance": {"type": "boolean", "value": false},
                        "showydistance": {"type": "boolean", "value": false},
                        "aggregation": {"type": "list", "options": ["average", "count", "maximum", "minimum", "none", "sum"], "value": "none"},
                        "aggregationcolumn": {"type": "list", "widget": "list"},
                        "groupby": {"type": "list", "widget": "multiselect"},
                        "orderby": {"type": "list", "widget": "order-by"},
                        "theme": {"type": "list", "options": ["Terrestrial", "Annabelle", "Azure", "Retro", "Mellow", "Orient", "GrayScale", "Flyer", "Luminosity"]},
                        "customcolors": {"type": "array", "bindable": "in-bound", "widget": "string"},
                        "nodatamessage": {"type": "string", "value": "No Data Available.", "bindable": "in-out-bound"},
                        "xdomain" : {"type": "list", "options": ["Default", "Min"], "value": "Default"},
                        "ydomain" : {"type": "list", "options": ["Default", "Min"], "value": "Default"},
                        /**Style**/
                        "border": {"type": "string", "widget": "box"},
                        "borderunit": {"type": "string", "options": ["em", "px"], "value": "px", "widget": "icons_radio"},
                        "bordertop": {"type": "string", "pattern": numberRegex},
                        "borderright": {"type": "string", "pattern": numberRegex},
                        "borderbottom": {"type": "string", "pattern": numberRegex},
                        "borderleft": {"type": "string", "pattern": numberRegex},
                        "borderwidth": {"type": "string"},
                        "borderstyle": {"type": "string", "options": ["dashed", "dotted", "none", "solid"], "widget": "borderstyle"},
                        "bordercolor": {"type": "string", "widget": "color"},
                        "padding": {"type": "string", "widget": "box"},
                        "paddingunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "paddingtop": {"type": "string", "pattern": numberRegex},
                        "paddingright": {"type": "string", "pattern": numberRegex},
                        "paddingbottom": {"type": "string", "pattern": numberRegex},
                        "paddingleft": {"type": "string", "pattern": numberRegex},
                        "margin": {"type": "string", "widget": "box"},
                        "marginunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "margintop": {"type": "string", "pattern": numberRegex},
                        "marginbottom": {"type": "string", "pattern": numberRegex},
                        "marginright": {"type": "string", "pattern": numberRegex},
                        "marginleft": {"type": "string", "pattern": numberRegex},
                        "backgroundcolor": {"type": "string", "widget": "color"},
                        "backgroundimage": {"type": "string", "bindable": "in-bound"},
                        "color": {"type": "string", "hidelabel": true, "widget": "color"},
                        "fontweight": {"type": "string", "options": ["bold"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontsize": {"type": "number", "hidelabel": true, "hint": "Font size", "value": 12, "pattern": numberRegex},
                        "fontunit": {"type": "string", "options": ["em", "px"], "value": "px", "hidelabel": true, "widget": "icons_radio"},
                        "textdecoration": {"type": "string", "options": ["underline"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontstyle": {"type": "string", "options": ["italic"], "hidelabel": true, "widget": "icons_checkbox"},
                        "fontfamily": {"type": "string", "hidelabel": true, "hint": "Arial, Geneva"},
                        "opacity": {"type": "string", "widget": "slider"},
                        "cursor": {"type": "list", "options": ["crosshair", "default", "e-resize", "help", "move", "n-resize", "ne-resize", "nw-resize", "pointer", "progress", "s-resize", "se-resize", "sw-resize", "text", "wait", "w-resize"]},
                        "zindex": {"type": "string", "pattern": zindexRegex},
                        "selecteditem": {"type": "object", "bindable": "out-bound", "widget": "string"},
                        "onTransform": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onSelect": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "tabindex": {"type": "string", "value": "0"}
                    },
                    "wm.datanavigator": {
                        "show": {"type": "boolean", "value": true, "bindable": "in-bound"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "showrecordcount": {"type": "boolean", "value": false},
                        "result": {"type": "object", "bindable": "out-bound", "widget": "string", "show": "false"},
                        "onSetrecord": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "tabindex": {"type": "string", "value": "0"},
                        "class": {"type": "string", "pattern": classRegex, "widget": "list-picker", "options": ["pagination-sm", "pagination-lg"]}
                    },
                    "wm.login": {
                        "show": {"type": "boolean", "value": true, "bindable": "in-bound"},
                        "errormessage": {"type": "string"},
                        "onSubmit": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"}
                    },
                    "wm.pagecontainer": {
                        "content": {"type": "list", "options": [], "widget": "pages-list", value: "", "bindable": "in-bound"}
                    },
                    "wm.video": {
                        "mp4format": {"type": "string", "value": "", "bindable": "in-out-bound"},
                        "oggformat": {"type": "string", "value": "", "bindable": "in-out-bound"},
                        "webmformat": {"type": "string", "value": "", "bindable": "in-out-bound"},
                        "subtitlelang": {"type": "string", "value": "en", "bindable": "in-out-bound"},
                        "subtitlesource": {"type": "string", "value": "", "bindable": "in-out-bound"},
                        "videoposter": {"type": "string", "value": "resources/images/imagelists/default-image.png", "bindable": "in-out-bound"},
                        "controls":  {"type": "boolean"},
                        "videosupportmessage":  {"type": "string", "value": "Your browser does not support the video tag."},
                        "autoplay": {"type": "boolean"},
                        "loop": {"type": "boolean"},
                        "muted": {"type": "boolean"},
                        "videopreload": {"type": "list", "options": ["none", "metadata", "auto"], "value": "none"},
                        "tabindex": {"type": "string", "value": "0"},
                        "showindevice": {"type": "selectall", "options": showInDeviceOptions, "value": "all", "displaytype": 'inline-block'}
                    },
                    "wm.audio": {
                        "mp3format": {"type": "string", "value": "", "bindable": "in-out-bound"},
                        "controls": {"type": "boolean"},
                        "audiosupportmessage": {"type": "string", "value": "Your browser does not support the audio tag."},
                        "autoplay": {"type": "boolean"},
                        "loop": {"type": "boolean"},
                        "muted": {"type": "boolean", "value": false},
                        "audiopreload": {"type": "list", "options": ["none", "metadata", "auto"], "value": "none"},
                        "tabindex": {"type": "string", "value": "0"},
                        "showindevice": {"type": "selectall", "options": showInDeviceOptions, "value": "all", "displaytype": 'inline-block'}
                    },
                    "wm.progress": {
                        "minvalue": {"type": "number", "value": 0, "bindable": "in-bound"},
                        "maxvalue": {"type": "number", "value": 100, "bindable": "in-bound"},
                        "datavalue": {"type": "number, string, array", "value": 30, "bindable": "in-out-bound", "widget": "string"},
                        "dataset": {"type": "array, object", "bindable": "in-bound", "widget": "string"},
                        "pollinterval": {"type": "number"},
                        "displayformat": {"type": "list", "options": ["percentage", "absolute"], "value": "percentage"},
                        "type": {"type": "list", "options": ["default", "default-striped", "success", "success-striped", "info", "info-striped", "warning", "warning-striped", "danger", "danger-striped"], "value": "default"},

                        "width": {"type": "string", "pattern": dimensionRegex},
                        "height": {"type": "string", "pattern": dimensionRegex},
                        "onStart": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onComplete": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},
                        "onBeforeupdate": {"type": "event", "options": widgetEventOptions, "widget": "eventlist"},

                        /* ---- styles ----*/
                        "padding": {"type": "string", "widget": "box"},
                        "paddingunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "paddingtop": {"type": "string", "pattern": numberRegex},
                        "paddingright": {"type": "string", "pattern": numberRegex},
                        "paddingbottom": {"type": "string", "pattern": numberRegex},
                        "paddingleft": {"type": "string", "pattern": numberRegex},
                        "margin": {"type": "string", "widget": "box"},
                        "marginunit": {"type": "string", "options": ["%", "em", "px"], "value": "px", "widget": "icons_radio"},
                        "margintop": {"type": "string", "pattern": numberRegex},
                        "marginbottom": {"type": "string", "pattern": numberRegex},
                        "marginright": {"type": "string", "pattern": numberRegex},
                        "marginleft": {"type": "string", "pattern": numberRegex},
                        "opacity": {"type": "string", "widget": "slider"},
                        "cursor": {"type": "list", "options": ["crosshair", "default", "e-resize", "help", "move", "n-resize", "ne-resize", "nw-resize", "pointer", "progress", "s-resize", "se-resize", "sw-resize", "text", "wait", "w-resize"]},
                        "zindex": {"type": "string", "pattern": zindexRegex},
                        "tabindex": {"type": "string", "value": "0"}
                    },
                    "wm.template": {
                        "header": {"type": "list", "options": [], "widget": "templates-list", value: "_nocontent"},
                        "topnav": {"type": "list", "options": [], "widget": "templates-list", value: "_nocontent"},
                        "leftnav": {"type": "list", "options": [], "widget": "templates-list", value: "_nocontent"},
                        "rightnav": {"type": "list", "options": [], "widget": "templates-list", value: "_nocontent"},
                        "footer": {"type": "list", "options": [], "widget": "templates-list", value: "_nocontent"}
                    }
                }
            },
            properties,
            propertyGroups;

        if (CONSTANTS.isStudioMode) {
            result.propertyGroups = [
                {"name": "properties", "parent": "", "show": true, "feature": "project.editor.design.basic"},
                {"name": "styles", "parent": "", "show": true, "feature": "project.editor.design.style"},
                {"name": "events", "parent": "", "show": true, "feature": "project.editor.design.events"},
                {"name": "mobile", "parent": "", "show": true, "feature": "project.editor.design.mobile"},
                {"name": "security", "parent": "", "show": true, "feature": "project.editor.design.security"},
                {"properties": ["widget", "caption", "gridcaption", "title", "displayname", "heading", "name", "debugurl", "type", "inputtype", "accept", "filetype", "extensions", "placeholder", "currency",  "hint", "tabindex", "target",  "description", "message", "oktext", "canceltext", "servicevariabletotrack", "valuetype", "alerttype", "iframesrc", "insert", "dropposition", "spacing", "advancedsettings"], "parent": "properties"},
                {"name": "layout", "properties": ["width", "height", "treeicons", "menulayout", "menuposition", "levels", "pictureaspect", "imgsrc", "shape", "layoutkind", "columns", "layout", "navtype", "stacked", "justified", "formlayout", "itemsperrow", "showheader", "header", "topnav", "leftnav", "rightnav", "footer", "offset", "addrow", "addcolumn", "popoverwidth", "popoverheight", "tabsposition", "addchild", "gridsearch", "searchlabel"], "parent": "properties"},
                {"name": "video", "properties": ["videoposter", "mp4format", "oggformat", "webmformat", "videopreload", "videosupportmessage", "subtitlesource", "subtitlelang"], "parent": "properties"},
                {"name": "audio", "properties": ["mp3format", "audiopreload", "audiosupportmessage"], "parent": "properties"},
                {"name": "content", "properties": ["contentsource", "content", "inlinecontent", "url"], "parent": "properties"},
                {"name": "display", "properties": ["picturesource", "modal", "vertical"], "parent": "properties"},
                {"name": "values", "properties": [ "scopedatavalue", "datavalue", "defaultvalue", "minvalue", "maxvalue", "displayformat", "updateon", "updatedelay", "formdata", "selectedvalue", "selectedvalues", "discretevalues", "integervalues", "minimum", "maximum", "step", "defaultcolor", "checkedvalue", "uncheckedvalue"], "parent": "properties"},
                {"name": "valuedisplay", "properties": ["datepattern", "timepattern", "hourstep", "minutestep", "limit"], "parent": "properties"},
                {"name": "output", "properties": ["outputformat"], "parent": "properties"},
                {"name": "dataset", "properties": ["service", "operation", "scopedataset", "dataset", "options",  "hyperlink", "formfield", "method", "action", "enctype", "searchkey", "displaylabel", "displayimagesrc", "usekeys", "actions",  "datafield", "itemlabel", "itemicon", "itemlink", "itemchildren", "displayfield", "displayexpression", "groupby", "aggregation", "aggregationcolumn", "orderby", "orderbycolumn", "nodelabel", "nodeicon", "nodechildren",  "badgevalue",  "badgetype", "thumbnailurl", "mediaurl", "match"], "parent": "properties"},
                {"name": "xaxis", "properties": ["xaxisdatakey", "xaxislabel", "xunits", "xnumberformat", "xdigits", "xdateformat", "xaxislabeldistance"], "parent": "properties"},
                {"name": "yaxis", "properties": ["yaxisdatakey", "yaxislabel", "yunits", "ynumberformat", "ydigits", "ydateformat", "yaxislabeldistance"], "parent": "properties"},
                {"name": "zaxis", "properties": ["bubblesize"], "parent": "properties"},
                {"name": "validation", "properties": ["required", "regexp", "mindate", "maxdate", "excludedays", "excludedates", "novalidate", "maxchars"], "parent": "properties"},
                {"name": "help", "properties": ["helptext"], "parent": "properties"},
                {"name": "behavior", "properties": ["defaultview", "defaultmode", "navigation", "pollinterval", "radiogroup", "viewgroup", "showweeks", "autofocus", "readonly", "ignoreparentreadonly", "readonlygrid", "scrolldelay", "scrollamount", "direction",
                    "multiple", "enablereorder", "fileuploadmessage", "mode", "show", "hideclose", "calendartype", "controls", "view", "disabled", "pagesize", "dynamicslider", "selectionclick", "closeothers", "collapsible", "enablefullscreen",
                    "lock", "freeze", "autoscroll", "closable", "expanded",  "destroyable", "showDirtyFlag", "link", "linktarget",
                    "uploadpath", "contenttype", "origin", "destination", "maxfilesize", "isdefaulttab", "isdefaultpane", "autocomplete", "showpreview", "tooltips", "showlegend", "legendposition", "legendtype", "captions", "showxaxis", "showyaxis", "xdomain", "ydomain", "showvalues",
                    "showlabels", "showcontrols", "useinteractiveguideline", "staggerlabels", "highlightpoints", "linethickness", "reducexticks", "barspacing", "labeltype", "autoplay", "loop", "muted", "donutratio", "showlabelsoutside",
                    "showxdistance", "showydistance", "xpadding", "ypadding", "popoverplacement", "popoverarrow", "popoverautoclose", "transition", "animation","animateitems", "animationinterval", "leftnavpaneliconclass", "backbutton", "backbuttoniconclass", "backbuttonlabel", "searchbutton",
                    "morebuttoniconclass", "morebuttonlabel", "capturetype", "loadmode", "loaddelay", "selectionlimit", "shortcutkey", "showcaptions", "multiselect", "radioselect", "enablesort", "gridfirstrowselect", "selectfirstitem", "enableemptyfilter"], "parent": "properties"},
                {"name": "searchproperties", "properties": ["searchbuttoniconclass", "searchbuttonlabel", "searchplaceholder"], "parent": "properties"},
                {"name": "datagrid", "properties": ["showrowindex"], "parent": "properties"},
                {"name": "caption", "properties": ["captionalign", "captionposition", "captionsize", "mineditorwidth"], "parent": "properties"},
                {"name": "graphics", "properties": ["imagelist", "imageindex", "paneicon", "iconclass", "iconsize", "iconurl", "iconwidth", "iconheight", "iconmargin", "iconposition", "image", "imagewidth", "imageheight"], "parent": "properties"},
                {"name": "format", "properties": [ "showtooltip", "horizontalalign", "verticalalign", "columnwidth", "taborder"], "parent": "properties"},
                {"name": "selection", "properties": ["selectionmode"], "parent": "properties"},
                {"name": "operations", "properties": ["insertrow", "deleterow", "updaterow", "submitbutton", "resetbutton"], "parent": "properties"},
                {"name": "navigation", "properties": ["shownavigation", "showrecordcount"], "parent": "properties"},
                {"name": "message", "properties": ["messagelayout", "errormessage", "insertmessage", "updatemessage", "confirmdelete", "deletemessage", "nodatamessage", "loadingdatamsg", "postmessage"], "parent": "properties"},
                {"properties": [ "class", "menuclass", "listclass", "itemclass", "gridclass",  "theme", "customcolors"], "parent": "styles"},
                {"name": "textstyle", "properties": [ "fontsize", "fontunit", "fontfamily", "color", "fontweight", "fontstyle", "textdecoration", "textalign", "whitespace"], "parent": "styles"},
                {"name": "backgroundstyle", "properties": ["backgroundcolor", "backgroundimage", "backgroundrepeat", "backgroundposition", "backgroundsize", "backgroundattachment"], "parent": "styles"},
                {"name": "border", "properties": ["bordercolor", "borderstyle", "border", "borderunit"], "parent": "styles"},
                {"name": "displaystyle", "properties": ["iconcolor", "padding", "paddingunit", "margin", "marginunit", "opacity", "overflow", "cursor", "zindex", "visibility", "display"], "parent": "styles"},
                {"name": "prefablifecycleevents", "properties": ["onLoad", "onDestroy"], "parent": "events"},
                {"name": "event", "properties": ["onChange",  "onFocus", "onBlur"], "parent": "events"},
                {"name": "mouseevents", "properties": ["onClick", "onDblclick", "onMousedown", "onMouseup", "onMouseover", "onMouseout", "onMousemove", "onMouseenter", "onMouseleave"], "parent": "events", "platforms": [PLATFORM_TYPE.WEB, PLATFORM_TYPE.DEFAULT]},
                {"name": "touchevents", "properties": ["onTap", "onDoubletap", "onSwipeup", "onSwipedown", "onSwipeleft", "onSwiperight", "onPinchin", "onPinchout"], "parent": "events"},
                {"name": "keyboardevents", "properties": ["onKeydown", "onKeypress", "onKeyup", "onEnterkeypress"], "parent": "events"},
                {"name": "callbackevents", "properties": ["onReady", "onStart", "onComplete", "onBeforeupdate", "onShow", "onHide", "onSuccess", "onError", "onOk", "onSubmit", "onCancel", "onClose", "onOpened", "onExpand", "onCollapse", "onSelect", "onDeselect", "onViewrender",
                    "onProgress", "onTransform", "onAbort", "onSort", "onGridbuttonclick", "onHeaderclick", "onRowclick", "onRowdblclick", "onColumnselect", "onColumndeselect", "onRowdeleted", "onBeforerowinsert", "onRowinsert", "onResult", "onBeforeservicecall", "onSetrecord", "onActionsclick",
                    "onBeforeSegmentChange", "onSegmentChange", "onSearch", "onBackbtnclick", "onEventdrop", "onEventresize", "onEventclick", "onEventrender", "onReorder", "onSelectionlimitexceed", "onFullscreen", "onExitfullscreen"], "parent": "events"},
                {"name": "security", "properties": ["accessroles"], "parent": "security"},
                {"name": "devicesize", "properties": ["showindevice"], "parent": "mobile"},
                {"name": "imageproperties", "properties": ["imagetargetwidth", "imagetargetheight", "imagequality", "imageencodingtype", "correctorientation", "sourcetype", "savetogallery", "allowedit"], "parent": "properties"}
            ];
        }
        properties = result.properties;
        propertyGroups = result.propertyGroups;

        /**
         * @ngdoc function
         * @name wm.widgets.$PropertiesFactory#getPropertiesOf
         * @methodOf wm.widgets.$PropertiesFactory
         * @function
         *
         * @description
         * This method returns a widget's properties.
         * If parents array is provided, injects the properties of the parents into widget,
         * else returns only the properties of the widget.
         * @param {String} widget Name of the widget for which the properties are to be returned
         * @param {Array} parents Name of the widgets, the given widget inherits properties from.
         * @returns {Object} widget with its properties.
         */

        /*
         If parents array is provided, inject the properties of from the parents into widget and return,
         else return only the properties of the widget.
         */
        function getPropertiesOf(widget, parents) {
            var widgetProps, parentsArr;

            if (!parents) {
                /* This widget doesn't inherit from other widgets. Fetch the properties of only this widget */
                widgetProps = Utils.getClonedObject(properties[widget]);
            } else {
                parentsArr = WM.isArray(parents) ? parents : [parents];
                parentsArr.push(widget);
                widgetProps = {};

                /* construct the properties object by inheriting from parents*/
                parentsArr.forEach(function (parent) {
                    if (!WM.isObject(properties[parent])) {
                        return;
                    }
                    _.keys(properties[parent])
                        .forEach(function (propName) {
                            var propObj = properties[parent][propName];
                            if (!widgetProps[propName]) {
                                widgetProps[propName] = {};
                            }
                            Object.keys(propObj).forEach(function (key) {
                                widgetProps[propName][key] = propObj[key];
                            });
                        });
                });
            }

            /* Inject show and disabled fields into each property object */
            if (CONSTANTS.isStudioMode) {
                _.keys(widgetProps)
                    .forEach(function (key) {
                        var property = widgetProps[key];
                        if (!property.hasOwnProperty('show')) {
                            property.show = true;
                        }
                        property.disabled = property.disabled || false;
                    });
            } else {
                _.keys(widgetProps).forEach(function (propName) {
                    var propDetails = widgetProps[propName];
                    widgetProps[propName] = _.pick(propDetails, ['type', 'value', 'bindable', 'displaytype']);
                });
            }

            return widgetProps;
        }

        function getPropertyGroups() {
            return propertyGroups;
        }

        function getPrimaryPropertyGroups() {
            var primaryPropertyGroups = [];
            propertyGroups.forEach(function (propertyGroup) {
                /*Check for groups that do not have parents to get primary groups.*/
                if (!propertyGroup.parent) {
                    primaryPropertyGroups.push(propertyGroup);
                }
            });
            return primaryPropertyGroups;
        }

        function getGroupProperties(group) {
            var groupProperties = [];
            propertyGroups.forEach(function (propertyGroup) {
                /*Check for the property groups that have the specified group as the parent.*/
                if (propertyGroup.parent === group) {
                    groupProperties = groupProperties.concat(propertyGroup.properties);
                }
            });
            return groupProperties;
        }

        function getPropertyGroup(name) {
            return _.find(propertyGroups, function (group) { return group.name === name; });
        }

        function setRoles(pRoles) {
            /* reset the existing roles array (keeping the actual reference to the roles array)*/
            roles.length = 0;

            /* push the provided roles into the existing roles */
            if (WM.isArray(pRoles)) {
                pRoles.forEach(function (pRole) {
                    roles.push(pRole);
                });
            }
        }

        /* function to return the access-roles */
        function getRoles() {
            /* return the roles array */
            return roles || [];
        }

        return {
            getPropertiesOf          : getPropertiesOf,
            getPropertyGroups        : getPropertyGroups,
            getPrimaryPropertyGroups : getPrimaryPropertyGroups,
            getGroupProperties       : getGroupProperties,
            getPropertyGroup         : getPropertyGroup,
            getRoles                 : getRoles,
            setRoles                 : setRoles
        };
    }])

    .directive('ngController', function ($rootScope, CONSTANTS) {
        'use strict';

        if (CONSTANTS.isRunMode) {
            $rootScope.Widgets = {};
        }

        return {
            'restrict': 'A',
            'compile': function () {
                return {
                    'pre': function (scope) {
                        scope.ctrlScope = scope;
                    }
                };
            }
        };
    })

    /*directive to handle on-change event for file input */
    .directive('onFileChange', function () {
        'use strict';
        return {
            link: function (scope, element, attrs) {
                element[0].onchange = function () {
                    scope[attrs.onFileChange](element[0]);
                };
            }
        };
    })

    /**
     * @ngdoc directive
     * @name wm.widgets.directive:wmtransclude
     * @restrict A
     * @element ANY
     *
     * @description
     * When this attribute directive is applied on an element, the elements transcluded content is processed and appended to the element.
     */
    .directive('wmtransclude', ['CONSTANTS', '$timeout', function (CONSTANTS, $timeout) {
        "use strict";

        return {
            "restrict": "A",
            "link": function (scope, element, attrs, nullCtrl, transcludeFn) {

                /*
                 * add data-droptarget-for attribute on the element.
                 * this attribute is useful in studio. it is used to find out the droptarget on an element.
                 */
                if (scope.widgetid) {
                    element.attr("data-droptarget-for", scope.widgettype);
                }

                var eleScope = element.scope(),
                    onTranscludeFn = scope.__onTransclude || WM.noop;

                if (eleScope.hasOwnProperty('$$isolateBindings') && !eleScope.__compileWithIScope) {
                    eleScope = eleScope.$parent;
                }
                scope.__load = WM.noop;
                if (CONSTANTS.isRunMode && scope.loadmode === 'after-select') {
                    scope.__load = function () {
                        transcludeFn(eleScope, function (clone) {
                            element.append(clone);
                            scope.__load = WM.noop;
                            $timeout(onTranscludeFn, undefined, false);
                        });
                    };
                } else if (CONSTANTS.isRunMode &&  scope.loadmode === 'after-delay') {
                    $timeout(function () {
                        transcludeFn(eleScope, function (clone) {
                            element.append(clone);
                            $timeout(onTranscludeFn, undefined, false);
                        });
                    }, scope.loaddelay);
                } else {
                    transcludeFn(eleScope, function (clone) {
                        element.append(clone);
                        onTranscludeFn();
                    });
                }
            }
        };
    }])
    // directive to disable animation on an element.
    .directive('noAnimate', function ($animate) {
        'use strict';
        return {
            'link': function ($s, $el) {
                $animate.enabled($el, false);
            }
        };
    })

    /**
     * @ngdoc directive
     * @name wm.widgets.directive:roles
     * @restrict A
     * @element ANY
     * @requires CONSTANTS
     * @requires $rootScope
     * @requires $compile
     * @description
     * This directive is for the widgets having 'roles' attribute in their raw markup.
     * It comes into action when security is enabled in the application being designed through studio.
     * It matches the roles associated with the widget with the roles of the user currently logged in.
     * If match is satisfied, the widget is properly compiled and displayed in the UI
     * Else the element is cleared from the DOM
     */
    .directive('accessroles', function (CONSTANTS, $rootScope, $compile) {
        "use strict";
        var directive = {};

        function matchRoles(widgetRoles, userRoles) {
            return widgetRoles.some(function (item) {
                return _.includes(userRoles, item);
            });
        }

        /*Decides whether the current logged in user has access to widget or not*/
        function hasAccessToWidget(widgetRoles, userRoles) {
            /* access the widget when 'Everyone' is chosen */
            if (_.includes(widgetRoles, 'Everyone')) {
                return true;
            }

            /* access the widget when 'Anonymous' is chosen and user is not authenticated */
            if (_.includes(widgetRoles, 'Anonymous') && !$rootScope.isUserAuthenticated) {
                return true;
            }

            /* access the widget when 'Only Authenticated Users' is chosen and user is authenticated */
            if (_.includes(widgetRoles, 'Authenticated') && $rootScope.isUserAuthenticated) {
                return true;
            }

            /* access the widget when widget role and logged in user role matches */
            /* TODO(Vineela): to remove isUserAuthenticated check and clean userRoles from $rs on logout */
            return $rootScope.isUserAuthenticated && matchRoles(widgetRoles, userRoles);
        }

        /* the directive is required only in RUN mode and when security is enabled */
        if (CONSTANTS.isRunMode && $rootScope.isSecurityEnabled) {
            directive = {
                "restrict": "A",
                "priority": 10000,
                "terminal": true,
                "link": {
                    "pre": function (scope, element, attrs) {
                        var userRoles = $rootScope.userRoles || [],
                            widgetRoles = attrs.accessroles ? attrs.accessroles.split(",") : [],
                            clonedElement;

                        if (hasAccessToWidget(widgetRoles, userRoles)) {
                            clonedElement = element.clone();
                            clonedElement.removeAttr("accessroles");
                            element.replaceWith(clonedElement);
                            $compile(clonedElement)(scope);
                        } else {
                            element.remove();
                        }
                    }
                }
            };
        }

        return directive;
    })

    /**
     * @ngdoc service
     * @name wm.widgets.$WidgetUtilService
     * @description
     * The `WidgetUtilService` provides utility methods for the widgets
     */
    .service('WidgetUtilService', ['$parse', '$rootScope', 'CONSTANTS', 'Utils', '$templateCache',
        function ($parse, $rootScope, CONSTANTS, Utils, $templateCache) {
            "use strict";

            var deviceSizeArray = {
                "all": {
                    "class": '',
                    "classToRemove": ["visible-xs-", "visible-sm-", "visible-md-", "visible-lg-"]
                },
                "xs": {
                    "class": "visible-xs-"
                },
                "sm": {
                    "class": "visible-sm-"
                },
                "md": {
                    "class": "visible-md-"
                },
                "lg": {
                    "class": "visible-lg-"
                }
            },
                EventsMap = {
                    'onClick':          {'name': 'data-ng-click',       'value': 'onClick({$event: $event, $scope: this})'},
                    'onDblclick':       {'name': 'data-ng-dblclick',    'value': 'onDblclick({$event: $event, $scope: this})'},
                    'onMouseenter':     {'name': 'data-ng-mouseenter',  'value': 'onMouseenter({$event: $event, $scope: this})'},
                    'onMouseleave':     {'name': 'data-ng-mouseleave',  'value': 'onMouseleave({$event: $event, $scope: this})'},
                    'onMouseover':      {'name': 'data-ng-mouseover',   'value': 'onMouseover({$event: $event, $scope: this})'},
                    'onMouseout':       {'name': 'data-ng-mouseout',    'value': 'onMouseout({$event: $event, $scope: this})'},

                    'onFocus':          {'name': 'data-ng-focus',       'value': 'onFocus({$event: $event, $scope: this})'},
                    'onBlur':           {'name': 'data-ng-blur',        'value': 'onBlur({$event: $event, $scope: this})'},

                    'onKeypress':       {'name': 'data-ng-keypress',    'value': 'onKeypress({$event: $event, $scope: this})'},
                    'onKeydown':        {'name': 'data-ng-keydown',     'value': 'onKeydown({$event: $event, $scope: this})'},
                    'onKeyup':          {'name': 'data-ng-keyup',       'value': 'onKeyup({$event: $event, $scope: this})'},

                    'onSwipeup':        {'name': 'hm-swipe-up',         'value': 'onSwipeup({$event: $event, $scope: this})'},
                    'onSwipedown':      {'name': 'hm-swipe-down',       'value': 'onSwipedown({$event: $event, $scope: this})'},
                    'onSwipeleft':      {'name': 'hm-swipe-left',       'value': 'onSwipeleft({$event: $event, $scope: this})'},
                    'onSwiperight':     {'name': 'hm-swipe-right',      'value': 'onSwiperight({$event: $event, $scope: this})'},
                    'onPinchin':        {'name': 'hm-pinch-in',         'value': 'onPinchin({$event: $event, $scope: this})'},
                    'onPinchout':       {'name': 'hm-pinch-out',        'value': 'onPinchout({$event: $event, $scope: this})'},
                    'onTap':            {'name': 'data-ng-click',       'value': 'onTap({$event: $event, $scope: this})'},
                    'onDoubletap':      {'name': 'data-ng-dblclick',    'value': 'onDoubletap({$event: $event, $scope: this})'}

                },
                triggerFn,
                attrsToBeRemoved;

            attrsToBeRemoved =
                ' data-ng-style data-ng-change data-ng-click data-ng-dblclick data-ng-mouseout data-ng-mouseover data-ng-blur data-ng-focus' +
                ' data-ng-show data-ng-hide data-ng-readonly data-ng-disabled data-ng-required data-ng-attr-placeholder ng-attr-name' +
                ' on-change on-focus on-blur on-click on-dblclick on-mouseover on-mouseout on-rowclick on-columnselect on-columndeselect ' +
                ' backgroundattachment backgroundcolor backgroundgradient backgroundposition backgroundrepeat backgroundsize bordercolor borderradius ' +
                ' borderstyle color cursor display fontfamily fontstyle fontvariant fontweight horizontalalign lineheight ' +
                ' opacity overflow paddingbottom paddingleft paddingright paddingtop picturesource textalign textdecoration verticalalign visibility ' +
                ' whitespace wordbreak zindex bordertop borderright borderbottom borderleft borderunit paddingtop paddingright paddingbottom paddingleft' +
                ' paddingunit margintop marginright marginbottom marginleft marginunit fontsize fontunit show hint caption animation backgroundimage iconposition iconclass';

            function cleanupMarkup(element) {
                element.removeAttr(attrsToBeRemoved);
            }

            function onScopeValueChangeProxy(scope, element, attrs, key, newVal, oldVal) {

                if (key === "placeholder" || key === "type") {
                    if (element.is('input') || element.is('textarea')) {
                        attrs.$set(key, newVal);
                    } else {
                        element.find('input').attr(key, newVal);
                    }
                } else if (key === "backgroundimage") {
                    scope.picturesource = Utils.getBackGroundImageUrl(newVal);
                } else if (key === "backgroundcolor") {
                    /* setting background image as none when background color is set. This is done because background
                    gradients are set as background image and have precedence over background color.*/
                    if (!scope.picturesource) {
                        scope.picturesource = 'none';
                    }
                } else if (key === "class") {
                    element.removeClass(oldVal).addClass(newVal);
                } else if (key === "name") {
                    attrs.$set("name", newVal);
                } else if (key === "showindevice") {
                    /*Apply the corresponding classes only in runMode*/
                    if (CONSTANTS.isRunMode) {
                        var newValues = newVal ? newVal.split(',') : newVal;
                        if (WM.element.inArray("all", newValues) === 0) {
                            WM.forEach(deviceSizeArray.all.classToRemove, function (device) {
                                element.removeClass(device + scope.widgetProps.showindevice.displaytype || 'block');
                            });
                        } else {
                            /*If others are selected, add classes accordingly */
                            WM.forEach(newValues, function (value) {
                                element.addClass(deviceSizeArray[value].class + (scope.widgetProps.showindevice.displaytype || 'block'));
                            });
                        }
                    }
                } else if (key === "animation") {
                    /*add the animated class only in the run mode since it will break the ui in design mode*/
                    if (CONSTANTS.isRunMode) {
                        element.addClass("animated " + newVal);
                    }
                }

                triggerFn = Utils.triggerFn;

                scope.propertyManager
                    .get(scope.propertyManager.ACTIONS.CHANGE)
                    .forEach(function (handler) {
                        var notifyFor = handler.notifyFor;
                        if ((notifyFor && notifyFor[key]) || !notifyFor) {
                            triggerFn(handler, key, newVal, oldVal);
                        }
                    });
            }

            /*
             This method will handle the initialization stuff when called from widget's (directive) post method.
             1. assign a name to a widget
             2. cleanupMarkup -- removes few attributes from the markup
             3. triggers onScopeValueChange function for the initial state of the widget(default values and attributes specified on the element).
             */
            function postWidgetCreate(scope, element, attrs) {
                cleanupMarkup(element);

                if (!scope || !scope._initState) {
                    return;
                }

                function triggerInitValueChange() {
                    Object.keys(scope._initState)
                        .forEach(function (key) {
                            var value = scope[key];
                            if (WM.isDefined(value)) {
                                onScopeValueChangeProxy(scope, element, attrs, key, value);
                            }
                        });
                    scope._isInitialized = true;
                    if (!scope.__onTransclude) {
                        Utils.triggerFn(scope.onReady, scope, element, attrs);
                    }
                }

                triggerInitValueChange();
            }

            /* find the scope of the controller using the scope passed */
            function findCtrlScope(scope) {
                /*for unit test cases, scope is rootScope, so in that case, we return*/
                if (scope.ctrlScope || scope.$id === $rootScope.$id) {
                    /* able to find ctrlScope from scope */
                    return;
                }

                var tScope = scope;
                do {
                    tScope = tScope.$parent;
                    if (tScope.ctrlScope) { /* found the ctrlScope */
                        scope.ctrlScope = tScope.ctrlScope;
                        /* save a reference to ctrlScope in scope */
                        break;
                    }
                } while (tScope.$id !== $rootScope.$id);
                /* loop exit condition */
            }

            /* when the model is provided, this function will create a two way binding between model(controller's scope) and view(input element) */
            function injectModelUpdater(element, model) {

                var isolateScope = element.isolateScope(), /* reference to the isolateScope of the element */
                    ctrlScope = element.scope(), /* reference to the scope which inherits from the controller */
                    _model,
                    dotIdx,
                    braceIdx,
                    idx,
                    name;


                if (model) { /* if the model is provided as an attribute on element parse it */
                    _model = $parse(model);
                    /* using _model we will be able to update the model in the controller */
                }

                /* not able to access ctrlScope from tScope(element.scope()). let me try to find it. */
                if (!ctrlScope.ctrlScope) {
                    findCtrlScope(ctrlScope);
                }

                if (!ctrlScope.ctrlScope) {
                    return;
                    /* not able to find the ctrlScope */
                }

                if (model) {
                    dotIdx = model.indexOf(".");
                    braceIdx = model.indexOf("[");
                    if (dotIdx === -1 && braceIdx === -1) {
                        /* model is provided with a variable name eg. model = x, we need to update in the controller directly */
                        ctrlScope = ctrlScope.ctrlScope;
                        /* refer to the scope of controller */
                    } else {
                        /* model might be provided as obj.variable name or obj[key] */
                        if (braceIdx === -1) {
                            idx = dotIdx;
                            /* dot is present in the model value*/
                        } else if (dotIdx === -1) {
                            idx = braceIdx;
                            /* brace is present in the model value*/
                        } else {
                            /* both dot and brace are present i.e a.b[x] */
                            idx = Math.min(dotIdx, braceIdx);
                            /* extract the object name from the model */
                        }
                        if (idx > 0) {
                            /* if the object specified is not defined in the controller's scope. create a new object with the extracted name */
                            name = model.substring(0, idx);
                            /* name of the object to be created */
                            if (!WM.isDefined(ctrlScope.ctrlScope[name])) { /* object is not defined in controller's scope */

                                /*
                                 * we will always define a Object ie. {} if the controller's scope doesn't have it.
                                 * if other than Object is expected i.e, Array, user must initialize it in controller's scope
                                 */
                                ctrlScope.ctrlScope[name] = {};
                                /* define the object in controller's scope */
                            }

                            if (WM.isUndefined(ctrlScope[name])) { /* not able to access object from ctrlScope */
                                Object.defineProperty(ctrlScope, name, {
                                    get: function () {
                                        return ctrlScope.ctrlScope[name];
                                        /* whenever object is accessed from scope, read it from controller's scope and return */
                                    }
                                });
                            }
                        }
                    }
                }

                /* this method will update the view value in the controller's scope */
                function updateModel() {
                    /*if (element.hasClass('app-calendar')) {
                        *//* if model for Calendar or Date widget and model is a valid date, update the model with the primitive value
                         * else make it undefined *//*
                        var formattedDate = new Date(isolateScope._model_);
                        isolateScope._model_ = $filter('date')(formattedDate, isolateScope.datepattern);
                    }*/

                    if (_model && ctrlScope) {
                        /* update the model value in the controller if the controller scope is available */
                        _model.assign(ctrlScope, isolateScope._model_);
                    }
                }

                /* _onChange is a wrapper fn for onChange. */
                isolateScope._onChange = function ($event) {
                    updateModel();
                    /* update the view value in the controller */
                    if ($event && isolateScope.onChange) {
                        isolateScope.onChange({$event: $event, $scope: isolateScope});
                        /* trigger the onChange fn */
                    }
                };

                /* update the view value when the model is updated */
                if (model && ctrlScope) {
                    /* watch the model */

                    isolateScope.$on('$destroy', ctrlScope.$watch(model, function (newVal) {
                        if (isolateScope._model_ === newVal) {
                            return;
                        }

                        /* update the view value if the model is updated */
                        isolateScope._model_ = newVal;

                    }, true));
                }

            }

            /*Function that returns all the internal object keys in the bound dataset*/
            function extractDataSetFields(dataset, propertiesMap, options) {
                var columns = [],
                    columnDefs,
                    properties,
                    keys = {'terminals' : {}, 'objects' : {}},
                    filterOptions;

                if (WM.isString(dataset)) {
                    return;
                }
                if (!options) {
                    options = {};
                }
                filterOptions = WM.copy(options);
                /*In case of live variable getting the properties map*/
                if (dataset && propertiesMap) {
                    columns = Utils.fetchPropertiesMapColumns(propertiesMap, null, {'filter' : 'all'});
                    properties = [Utils.resetObjectWithEmptyValues(columns.objects)];
                    keys.objects = Object.keys(properties[0]);
                    properties = [Utils.resetObjectWithEmptyValues(columns.terminals)];
                    keys.terminals = Object.keys(properties[0]);
                } else {
                    filterOptions.noModifyTitle = true;
                    keys = {'terminals' : [], 'objects' : []};
                    filterOptions.filter = 'all';
                    columnDefs = Utils.prepareFieldDefs(dataset, filterOptions);
                    columnDefs.objects.forEach(function (columnDef) {
                        keys.objects.push(columnDef.field);
                    });
                    columnDefs.terminals.forEach(function (columnDef) {
                        keys.terminals.push(columnDef.field);
                    });
                }
                if (options.sort) {
                    keys.objects = keys.objects.sort();
                    keys.terminals = keys.terminals.sort();
                }
                if (!options || (options && !options.filter)) {
                    return keys.terminals;
                }
                switch (options.filter) {
                case 'all':
                    return keys;
                case 'objects':
                    return keys.objects;
                case 'terminals':
                    return keys.terminals;
                }
            }

            function addEventAttributes($template, tAttrs, customEventsMap) {

                if (tAttrs.widgetid) { // widget is inside canvas
                    return;
                }
                var eventsMap = customEventsMap || EventsMap;
                Object.keys(eventsMap).forEach(function (evtName) {
                    var evtDetails = eventsMap[evtName];
                    if (tAttrs[evtName]) {
                        $template.attr(evtDetails.name, evtDetails.value);
                    }
                });

                return $template;
            }

            function getPreparedTemplate(templateId, tElement, tAttrs) {
                var isInsideCanvs = tAttrs.widgetid,
                    template,
                    $template;

                template =  $templateCache.get(templateId);

                if (isInsideCanvs) {
                    return template;
                }

                $template = WM.element(template);
                addEventAttributes($template, tAttrs);

                return $template[0].outerHTML;
            }

            function registerPropertyChangeListener(listener, iScope, notifyFor) {
                listener.notifyFor = notifyFor;
                /* register the property change handler */
                iScope.propertyManager.add(iScope.propertyManager.ACTIONS.CHANGE, listener);
            }

            function getObjValueByKey(obj, strKey) {
                /* check for the key-string */
                if (strKey) {
                    var val;
                    /* convert indexes to properties, so as to work for even 'key1[0].child1'*/
                    strKey.replace(/\[(\w+)\]/g, '.$1').split('.').forEach(function (key) {
                        val = (val && val[key]) || obj[key];
                    });
                    return val;
                }
                return obj;
            }
            /*
            * Function evaluates passed key(expression/bound expression) and returns corresponding value of dataObj
            * @params: {dataObj} object from which values are extracted
            * @params: {scope} scope of the function called. Used for eval
            * @params: {propertyObj} Ex :{fieldName : "displayfield", expressionName : "displayexpression" }
            * @params: {value} previously computed key passed as an extra argument
            * Priority : boundExpressionName >> expressionName >> value >> fieldName
            * */
            function getEvaluatedData(scope, dataObj, propertyObj, value) {
                var boundExpressionName = propertyObj ? ("bind" + propertyObj.expressionName) : undefined,
                    expressionValue;
                /* if key is bound expression*/
                if (scope[boundExpressionName]) {
                    /*remove 'bind:' prefix from the boundExpressionName*/
                    expressionValue = scope[boundExpressionName].replace("bind:", "");
                    /* parse the expressionValue for replacing all the expressions with values in the object */
                    return scope.$eval(expressionValue.replace(/\$\[(\w)+(\w+(\[\$i\])?\.+\w+)*\]/g, function (expr) {
                        var val;
                        /*remove '$[' prefix & ']' suffix from each expression pattern */
                        expr = expr.replace(/[\$\[\]]/gi, '');
                        /*split to get all keys in the expr*/
                        expr.split('.').forEach(function (key) {
                            /* get the value for the 'key' from the dataObj first & then value itself,
                             * as it will be the object to scan
                             * */
                            val = (val && val[key]) || dataObj[key];
                            /*if val is a string, append single quotes to it */
                            if (WM.isString(val)) {
                                val = "'" + val + "'";
                            }
                        });
                        /* return val to the original string*/
                        return val;
                    }));
                }
                /*If key is expression*/
                if (propertyObj && scope[propertyObj.expressionName]) {
                    return Utils.getEvaluatedExprValue(dataObj, scope[propertyObj.expressionName], scope);
                }
                /*If value is passed*/
                if (value) {
                    return getObjValueByKey(dataObj, value);
                }
                /*If fieldName is defined*/
                if (propertyObj && scope[propertyObj.fieldName]) {
                    return getObjValueByKey(dataObj, scope[propertyObj.fieldName]);
                }
            }

            /**
             * @ngdoc function
             * @name wm.widgets.form.FormWidgetUtils#updatePropertyPanelOptions
             * @methodOf wm.widgets.form.FormWidgetUtils
             * @function
             *
             * @description
             * function to update datafield, display field in the property panel
             *
             * @param {object} dataset data set of the widget
             * @param {object} propertiesMap properties map of the data set
             * @param {object} scope isolate scope of the widget
             * @param {boolean} removeNull removeNull determines to remove the null values or not from the keys
             */
            function updatePropertyPanelOptions(dataset, propertiesMap, scope, removeNull) {
                var keys,
                    allKeys = [],
                    filter,
                    ALLFIELDS = ['All Fields'];
                /* on binding of data*/
                if (dataset && WM.isObject(dataset)) {
                    dataset = dataset[0] || dataset;
                    keys = extractDataSetFields(dataset, propertiesMap, {'filter' : 'all'}) || [];
                }

                /*removing null values from the variableKeys*/
                if (removeNull && keys) {
                    _.forEach(keys.objects, function (variableKey, index) {
                        if (dataset[variableKey] === null || WM.isObject(dataset[variableKey])) {
                            keys.objects.splice(index, 1);
                        }
                    });
                    _.forEach(keys.terminals, function (variableKey, index) {
                        if (dataset[variableKey] === null || WM.isObject(dataset[variableKey])) {
                            keys.terminals.splice(index, 1);
                        }
                    });
                }

                /* re-initialize the property values */
                if (scope.newcolumns) {
                    scope.newcolumns = false;
                    scope.datafield = ALLFIELDS;
                    scope.displayfield = '';
                    scope.$root.$emit("set-markup-attr", scope.widgetid, {'datafield': ALLFIELDS, 'displayfield': ''});
                }
                if (keys) {
                    allKeys = _.union(keys.objects, keys.terminals);
                    _.forEach(scope.widgetProps, function (prop) {
                        filter = prop.datasetfilter;
                        if (filter) {
                            switch (filter) {
                            case 'all':
                                prop.options = allKeys;
                                break;
                            case 'objects':
                                prop.options = keys.objects;
                                break;
                            case 'terminals':
                                prop.options = keys.terminals;
                                break;
                            }
                            if (prop.allfields) {
                                prop.options = ALLFIELDS.concat(prop.options);
                            }
                            prop.options = [''].concat(prop.options);
                        }
                    });
                }
                return keys;
            }

            return {

                /**
                 * @ngdoc function
                 * @name wm.widgets.$WidgetUtilService#postWidgetCreate
                 * @methodOf wm.widgets.$WidgetUtilService
                 * @function
                 *
                 * @description
                 * This method will handle the initialization stuff when called from widget's (directive) post method.
                 * 1. assign a name to a widget
                 * 2. cleanupMarkup -- removes few attributes from the markup
                 */
                postWidgetCreate: postWidgetCreate,

                /**
                 * @ngdoc function
                 * @name wm.widgets.$WidgetUtilService#injectModelUpdater
                 * @methodOf wm.widgets.$WidgetUtilService
                 * @function
                 *
                 * @description
                 * when the model is provided, this function will create a two way binding between model(controller's scope) and view(input element)
                 */
                injectModelUpdater: injectModelUpdater,

                onScopeValueChangeProxy: onScopeValueChangeProxy,

                extractDataSetFields: extractDataSetFields,


                /**
                 * @ngdoc function
                 * @name wm.widgets.$WidgetUtilService#getPreparedTemplate
                 * @methodOf wm.widgets.$WidgetUtilService
                 * @function
                 *
                 * @description
                 * returns the widget template after adding event related attributes
                 */
                getPreparedTemplate: getPreparedTemplate,

                /**
                 * @ngdoc function
                 * @name wm.widgets.$WidgetUtilService#addEventAttributes
                 * @methodOf wm.widgets.$WidgetUtilService
                 * @function
                 *
                 * @description
                 * returns the widget template after adding event related attributes
                 */
                addEventAttributes: addEventAttributes,
                /**
                 * @ngdoc function
                 * @name wm.widgets.$WidgetUtilService#registerPropertyChangeListener
                 * @methodOf wm.widgets.$WidgetUtilService
                 * @function
                 *
                 * @description
                 * registers a property change listener
                 */
                registerPropertyChangeListener: registerPropertyChangeListener,

                /**
                 * @ngdoc function
                 * @name wm.widgets.$WidgetUtilService#getObjValueByKey
                 * @methodOf wm.widgets.$WidgetUtilService
                 * @function
                 *
                 * @description
                 * Returns the value for the provided key in the object
                 */
                getObjValueByKey: getObjValueByKey,

                /**
                 * @ngdoc function
                 * @name wm.widgets.$WidgetUtilService#getDisplayFieldData
                 * @methodOf wm.widgets.$WidgetUtilService
                 * @function
                 *
                 * @description
                 * returns the display field data for select, radioboxset and checkboxset widgets
                 * Based on the bind display expression or display expression or display name,
                 * data is extracted and formatted from the passed option object
                 */
                getEvaluatedData: getEvaluatedData,

                updatePropertyPanelOptions: updatePropertyPanelOptions
            };
        }])
    .directive('applyStyles', [
        'WidgetUtilService',

        function (WidgetUtilService) {
            'use strict';

            var notifyFor = {},
                DIMENSION_PROPS,

                propNameCSSKeyMap,
                SHELL_TYPE_IGNORE_LIST,
                CONTAINER_TYPE_IGNORE_LIST,
                SCROLLABLE_CONTAINER_TYPE_IGNORE_LIST;


            propNameCSSKeyMap = {
                'backgroundattachment'  : 'backgroundAttachment',
                'backgroundcolor'       : 'backgroundColor',
                'backgroundgradient'    : 'backgroundGradient',
                'backgroundposition'    : 'backgroundPosition',
                'backgroundrepeat'      : 'backgroundRepeat',
                'backgroundsize'        : 'backgroundSize',
                'bordercolor'           : 'borderColor',
                'borderradius'          : 'borderRadius',
                'borderstyle'           : 'borderStyle',
                'color'                 : 'color',
                'cursor'                : 'cursor',
                'display'               : 'display',
                'fontfamily'            : 'fontFamily',
                'fontstyle'             : 'fontStyle',
                'fontvariant'           : 'fontVariant',
                'fontweight'            : 'fontWeight',
                'height'                : 'height',
                'horizontalalign'       : 'textAlign',
                'lineheight'            : 'lineHeight',
                'opacity'               : 'opacity',
                'overflow'              : 'overflow',
                'picturesource'         : 'backgroundImage',
                'textalign'             : 'textAlign',
                'textdecoration'        : 'textDecoration',
                'verticalalign'         : 'verticalAlign',
                'visibility'            : 'visibility',
                'whitespace'            : 'whiteSpace',
                'width'                 : 'width',
                'wordbreak'             : 'wordbreak',
                'zindex'                : 'zIndex'
            };
            SHELL_TYPE_IGNORE_LIST     = 'height overflow paddingunit paddingtop paddingright paddingbottom paddingleft';
            CONTAINER_TYPE_IGNORE_LIST = 'textalign';
            SCROLLABLE_CONTAINER_TYPE_IGNORE_LIST = 'textalign width';

            _.keys(propNameCSSKeyMap)
                .concat(SHELL_TYPE_IGNORE_LIST.split(' '))
                .concat(CONTAINER_TYPE_IGNORE_LIST.split(' '))
                .forEach(function (propName) {
                    notifyFor[propName] = true;
                });

            DIMENSION_PROPS = _.flatten(_.map(['padding', 'border', 'margin'], function (prop) {
                return [prop + 'top', prop + 'right', prop + 'bottom', prop + 'left', prop + 'unit'];
            }));

            // add dimension related properties to notifyFor
            _.forEach(DIMENSION_PROPS, function (prop) {
                notifyFor[prop] = true;
            });

            // few extra properties which need some calculation/manipulations before applying as CSS.
            notifyFor.fontsize        = true;
            notifyFor.fontunit        = true;
            notifyFor.backgroundimage = true;

            function isDimensionProp(key) {
                return _.includes(DIMENSION_PROPS, key);
            }

            function setDimensionProp($is, cssObj, key) {
                var prefix,
                    suffix,
                    unit;

                prefix = prefix || (_.startsWith(key, 'border') && 'border');
                suffix = prefix ? 'Width' : '';
                prefix = prefix || (_.startsWith(key, 'margin') && 'margin');
                prefix = prefix || (_.startsWith(key, 'padding') && 'padding');

                if (!prefix) {
                    return;
                }

                unit = $is[prefix + 'unit'];

                cssObj[prefix + 'Top' + suffix]    = $is[prefix + 'top']    + unit;
                cssObj[prefix + 'Right' + suffix]  = $is[prefix + 'right']  + unit;
                cssObj[prefix + 'Bottom' + suffix] = $is[prefix + 'bottom'] + unit;
                cssObj[prefix + 'Left' + suffix]   = $is[prefix + 'left']   + unit;
            }

            function applyCSS($is, $el, applyType, key, nv) {

                var obj = {},
                    cssName = propNameCSSKeyMap[key],
                    keys,
                    resetObj;

                // if the type is `shell` and the key is in the SHELL_TYPE_IGNORE_LIST, return
                if (applyType === 'shell' && _.includes(SHELL_TYPE_IGNORE_LIST, key)) {
                    return;
                }

                // if the type is `inner-shell` and the key is NOT in the SHELL_TYPE_IGNORE_LIST, return
                if (applyType === 'inner-shell') {
                    if (!_.includes(SHELL_TYPE_IGNORE_LIST, key)) {
                        return;
                    }
                    if (key === 'height') {
                        obj.overflow = nv ? 'auto' : '';
                    }
                }

                // if the type is `container` and the key is in the CONTAINER_TYPE_IGNORE_LIST, return
                if (applyType === 'container' && _.includes(CONTAINER_TYPE_IGNORE_LIST, key)) {
                    return;
                }
                if (applyType === 'scrollable-container') {
                    if (_.includes(SCROLLABLE_CONTAINER_TYPE_IGNORE_LIST, key)) {
                        return;
                    }

                    if (key === 'height') {
                        obj.overflow = nv ? 'auto' : '';
                    }
                }

                if (isDimensionProp(key)) {
                    setDimensionProp($is, obj, key);
                } else {
                    if (cssName) {
                        obj[cssName] = nv;
                    } else if (key === 'fontsize' || key === 'fontunit') {
                        obj.fontSize = $is.fontsize === '' ? '' : $is.fontsize + $is.fontunit;
                    } else if (key === 'backgroundimage') {
                        obj.backgroundImage = $is.picturesource;
                    }
                }

                keys = _.keys(obj);

                if (keys.length) {
                    //reset obj;
                    resetObj = _.zipObject(keys, _.range(keys.length).map(function () { return ''; }));
                    $el.css(resetObj);
                    $el.css(obj);
                }
            }

            function onCSSPropertyChange($is, $el, attrs, key, nv) {
                applyCSS($is, $el, attrs.applyStyles, key, nv);
            }

            return {
                'link': function ($is, $el, attrs) {
                    WidgetUtilService.registerPropertyChangeListener(onCSSPropertyChange.bind(undefined, $is, $el, attrs), $is, notifyFor);
                }
            };
        }
    ])

    /**
     * @ngdoc service
     * @name wm.widgets.$Widgets
     * @description
     * The `Widgets` provides utility methods for the accessing the scope of the widgets.
     */
    .service('Widgets', ["$rootScope", 'wmToaster', 'CONSTANTS',
        function ($rootScope, wmToaster, CONSTANTS) {
            "use strict";

            var registry = {}, /* widgetId - scope map */
                nameIdMap = {}, /* name - widgetId map */
                returnObj = {};
            /* return value of the Widgets service */

            /* returns the scope of the widget by widgetId */
            function byId(widgetId) {
                return registry[widgetId];
            }

            /* returns the scope of the widget by name */
            function byName(name) {
                return byId(nameIdMap[name]);
            }

            function byType(types) {
                /* if type not provided, return all widgets */
                if (!types) {
                    return registry;
                }

                /* if comma separated types are provided, make it an array*/
                if (typeof types === "string") {
                    /* if form-widgets required */
                    if (types === "form-widgets") {
                        types = ["wm-label",
                            "wm-text",
                            "wm-checkbox",
                            "wm-checkboxset",
                            "wm-radio",
                            "wm-radioset",
                            "wm-textarea",
                            "wm-select",
                            "wm-button",
                            "wm-picture",
                            "wm-anchor",
                            "wm-popover",
                            "wm-date",
                            "wm-calendar",
                            "wm-time",
                            "wm-datetime",
                            "wm-currency",
                            "wm-colorpicker",
                            "wm-slider",
                            "wm-fileupload",
                            "wm-grid",
                            "wm-livefilter",
                            "wm-livelist",
                            "wm-datanavigator",
                            "wm-html",
                            "wm-prefab",
                            "wm-richtexteditor",
                            "wm-search",
                            "wm-menu",
                            "wm-switch",
                            "wm-nav",
                            "wm-tree",
                            "wm-liveform",
                            "wm-rating",
                            "wm-camera",
                            "wm-barcodescanner",
                            "wm-mobile-navbar ",
                            "wm-chart",
                            "wm-view",
                            "wm-form"
                            ];
                    } else if (types === 'page-container-widgets') {
                        types = [
                            'wm-accordionpane',
                            'wm-container',
                            'wm-panel',
                            'wm-tabcontent',
                            'wm-footer',
                            'wm-header',
                            'wm-left-panel',
                            'wm-right-panel',
                            'wm-top-nav'
                        ];
                    } else {
                        types = types.split(",");
                    }
                }

                var collection = {};

                WM.forEach(types, function (type) {
                    type = type.trim();
                    WM.forEach(registry, function (widget) {
                        if (widget.widgettype === type) {
                            collection[widget.name] = widget;
                        }
                    });
                });
                return collection;
            }

            /* checks for the unique constraint of the name, if the given name is not used returns true else false */
            function isValidName(name) {
                var isValid = true, errMsgTitle, errMsgDesc;

                /* isEmpty? */
                if (!name) {
                    isValid = false;
                    errMsgTitle = "MESSAGE_ERROR_INVALID_WIDGETNAME_TITLE";
                    errMsgDesc = "MESSAGE_ERROR_INVALID_WIDGETNAME_DESC";
                } else if (nameIdMap[name]) { /* check for duplicate name */
                    isValid = false;
                    errMsgTitle = "MESSAGE_ERROR_DUPLICATE_WIDGETNAME_TITLE";
                    errMsgDesc = "MESSAGE_ERROR_DUPLICATE_WIDGETNAME_DESC";
                }

                /* name is not valid, show the error message */
                if (!isValid) {
                    wmToaster.show("error", $rootScope.locale[errMsgTitle], $rootScope.locale[errMsgDesc]);
                }

                return isValid;
            }

            /* checks if the widget name already exists */
            function isExists(name) {
                var _isExists = false;
                /* check for the name */
                if (nameIdMap[name]) {
                    _isExists = true;
                }
                return _isExists;
            }

            /* this is a private method to the Widgets service. This function unregisters the widget by its name. So that we can re-use the name */
            function unregister(name) {
                var widgetId = nameIdMap[name];

                delete registry[widgetId];
                /* delete the entry from the registry */
                delete nameIdMap[name];
                /* delete the entry from the nameIdMap */
            }

            /* byId, byName, isValidName methods will be exposed by this service */

            /**
             * @ngdoc function
             * @name wm.widgets.$Widgets#byId
             * @methodOf wm.widgets.$Widgets
             * @function
             *
             * @description
             * returns the scope of the widget by widgetid
             */
            returnObj.byId = byId;

            /**
             * @ngdoc function
             * @name wm.widgets.$Widgets#byName
             * @methodOf wm.widgets.$Widgets
             * @function
             *
             * @description
             * returns the scope of the widget by name
             */
            returnObj.byName = byName;

            /**
             * @ngdoc function
             * @name wm.widgets.$Widgets#isValidName
             * @methodOf wm.widgets.$Widgets
             * @function
             *
             * @description
             * checks for the unique constraint of the name, if the given name is not used returns true else false
             */
            returnObj.isValidName = isValidName;

            /**
             * @ngdoc function
             * @name wm.widgets.$Widgets#isExists
             * @methodOf wm.widgets.$Widgets
             * @function
             *
             * @description
             * checks for the widget with the provided name, if the widget exists return true else false
             */
            returnObj.isExists = isExists;
            /**
             * @ngdoc function
             * @name wm.widgets.$Widgets#byType
             * @methodOf wm.widgets.$Widgets
             * @function
             *
             * @description
             * returns an array of scopes of widgets of specified type(returns all if no type specified)
             */
            returnObj.byType = byType;

            /* listen for the changes in name and update the registry accordingly */
            $rootScope.$on("name-change", function (evt, widgetId, newName, oldName, scope) {

                /* process only canvas widgets in STUDIO mode (assumption: only widgets in canvas will have widgetId) */
                if (CONSTANTS.isStudioMode && !widgetId) {
                    return;
                }

                delete nameIdMap[oldName];
                /* delete the entry with old name */
                delete returnObj[oldName];
                /* delete the name entry from the service */

                /*In run mode we do not have the widgetId hence using the newName*/
                widgetId = widgetId || newName;

                nameIdMap[newName] = widgetId;
                /* update the new name value with the widgetId */

                registry[widgetId] = scope;

                /* define a property with the name on service. with this users will be able to access a widget by its name. e.b, Widgets.test */
                Object.defineProperty(returnObj, newName, {
                    configurable: true,
                    get: function () {
                        return byName(newName);
                    }
                });

                /* unregister the widget when it is deleted or when the scope is destroyed */
                scope.$on("$destroy", function () {
                    unregister(scope.name);
                });
            });

            return returnObj;
        }]);
