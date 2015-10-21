/*global WM*/
/*Directive for Navbar*/

WM.module('wm.layouts.containers')
    .run(['$templateCache', function ($templateCache) {
        'use strict';
        $templateCache.put('template/layouts/containers/mobile/navbar.html',
                '<header data-role="mobile-navbar" has-model init-widget class="app-header app-mobile-navbar {{class}}" data-ng-show="show" apply-styles>' +
                    '<nav class="navbar ng-show" ng-show="!showSearchbar">' +
                        '<div class="col-xs-4">' +
                            '<ul class="nav navbar-nav navbar-left">' +
                                '<li data-ng-if="leftNavPanel != undefined" >' +
                                    '<a data-ng-click="leftNavPanel.toggle();">' +
                                        '<i data-ng-class="leftnavpaneliconclass"></i>' +
                                    '</a>' +
                                '</li>' +
                                '<li data-ng-if="backbutton">' +
                                    '<a class="btn-back" type="button" data-ng-click="goBack();">' +
                                        '<i data-ng-class="backbuttoniconclass"></i><span>{{backbuttonlabel}}</span>' +
                                    '</a>' +
                                '</li>' +
                            '</ul>' +
                        '</div>' +
                        '<div class="col-xs-4">' +
                            '<div class="navbar-header"><h1 class="navbar-brand">{{title}}</h1></div>' +
                        '</div>' +
                        '<div class="col-xs-4">' +
                            '<ul class="nav navbar-nav navbar-right">' +
                                '<li wmtransclude></li>' +
                                '<li data-ng-if="searchbutton">' +
                                    '<a class="btn-search btn-transparent" type="button" data-ng-click="search();">' +
                                        '<i data-ng-class="searchbuttoniconclass"></i><span>{{searchbuttonlabel}}</span>' +
                                    '</a>' +
                                '</li>' +
                            '</ul>' +
                        '</div>' +
                    '</nav>' +
                    '<nav class="navbar searchbar ng-show" ng-show="showSearchbar">' +
                            '<input type="search" data-ng-model="_model_" class="searchInput" id="search" placeholder="{{searchplaceholder}}">' +
                            '<i class="btn-close glyphicon glyphicon-remove" data-ng-click="close();"></i>' +
                    '</nav>' +
                '</header>'
                );
    }]).directive('wmMobileNavbar', ['$templateCache', 'PropertiesFactory', 'WidgetUtilService', '$window', 'CONSTANTS', 'Utils', '$timeout', function ($templateCache, PropertiesFactory, WidgetUtilService, $window, CONSTANTS, Utils, $timeout) {
        'use strict';
        var widgetProps = PropertiesFactory.getPropertiesOf('wm.layouts.mobile.navbar', ['wm.layouts']);
        return {
            'restrict': 'E',
            'replace': true,
            'scope': {},
            'transclude': true,
            'template': $templateCache.get('template/layouts/containers/mobile/navbar.html'),
            'compile': function () {
                return {
                    'pre': function (scope) {
                        /*Applying widget properties to directive scope*/
                        scope.widgetProps = widgetProps;
                        scope.showSearchbar = false;
                    },
                    'post': function (scope, element, attrs) {
                        scope.leftNavPanel = WM.element(element.closest('.app-page').find('.app-left-panel:first')).isolateScope();
                        if (CONSTANTS.isRunMode) {
                            scope.goBack = function () {
                                $window.history.go(-1);
                            };
                            scope.search = function () {
                                scope.showSearchbar = true;
                                $timeout(function () {
                                    element.find('.searchInput').focus();
                                }, undefined, false);
                            };
                            scope.close = function () {
                                if (element.find('.searchInput').val()) {
                                    element.find('.searchInput').val('');
                                }
                                if (scope._model_) {
                                    scope._model_ = '';
                                } else {
                                    scope.showSearchbar = false;
                                }
                            };
                            element.bind('keydown', function (event) {
                                if (Utils.getActionFromKey(event) === "ENTER") {
                                    scope._model_ = element.find('.searchInput').val();
                                    scope.onSearch({ $scope: scope});
                                }
                            });
                        }
                        /*Cleaning the widget markup such that the widget wrapper is not cluttered with unnecessary property or
                         * style declarations.*/
                        WidgetUtilService.postWidgetCreate(scope, element, attrs);
                    }
                };
            }
        };
    }]);

/**
 * @ngdoc directive
 * @name wm.layouts.containers.directive:wmMobileNavbar
 * @restrict E
 * @element ANY
 * @description
 * The 'wmMobileNavbar' directive defines a dynamic navigation bar for a mobile applicatino.
 * wmNavbar is internally used by wmTopNav.
 *
 * @param {string=} title
 *                  Title to show at the center.
 * @param {string=} name
 *                  Name of the navbar.
 * @param {string=} height
 *                  Height of the navabr.
 * @param {string=} backbutton
 *                  if true, back button will be shown. Default true.
 * @param {string=} backbuttonlabel
 *                  back button label.
 * @param {string=} show
 *                  This property determines whether or not the navbar is visible. This property is a bindable property.
 *
 * @example
    <example module="wmCore">
        <file name="index.html">
            <div data-ng-controller="Ctrl" class="wm-app">
                <wm-top-nav>
                    <wm-mobile-navbar title="XMobile" fontweight="bold" fontsize="2" fontunit="em" paddingtop="5">
                        <wm-button caption="Users" type="button" iconclass="fa fa-trash-o"></wm-button>
                    </wm-mobile-navbar>
                </wm-top-nav>
            </div>
        </file>
        <file name="script.js">
            function Ctrl($scope) {}
        </file>
    </example>
 */





