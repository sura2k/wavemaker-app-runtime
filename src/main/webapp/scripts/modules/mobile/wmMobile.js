/*global WM, window, _, cordova, document*/

WM.module('wm.mobile', ['wm.variables', 'wm.layouts', 'wm.widgets', 'ngCordova'])
    //Initialize project
    .run(['$rootScope', '$location', 'CONSTANTS', 'Utils', 'AppAutoUpdateService',
        function ($rootScope, $location, CONSTANTS, Utils, AppAutoUpdateService) {
            'use strict';
            /* Mark the mobileApplication type to true */
            $rootScope.isMobileApplicationType = true;

            if ($location.protocol() === 'file') {
                CONSTANTS.hasCordova = true;
                $rootScope.$on('application-ready', function () {
                    AppAutoUpdateService.start();
                    /* Set root url */
                    Utils.fetchContent(
                        'json',
                        Utils.preventCachingOf('./config.json'),
                        function (response) {
                            if (!response.error) {
                                $rootScope.project.deployedUrl = response.baseUrl;
                            }
                        },
                        WM.noop,
                        true
                    );
                });
            }
            if (CONSTANTS.isRunMode) {
                $rootScope.$on('$routeChangeStart', function () {
                    WM.element('body >.app-spinner:first').removeClass('ng-hide');
                });
                $rootScope.$on('page-ready', function () {
                    WM.element('body >.app-spinner:first').addClass('ng-hide');
                });
            }
        }])
    //Initialize variables
    .run(['Variables', 'WIDGET_CONSTANTS', 'BaseVariablePropertyFactory', 'DeviceVariableService', 'NavigationVariableService',
        function (Variables, WIDGET_CONSTANTS, BaseVariablePropertyFactory, DeviceVariableService) {
            'use strict';

            /* Register Mobile specific Variables*/
            Variables.addVariableConfig({
                'collectionType': 'data',
                'category': 'wm.DeviceVariable',
                'labelKey': 'LABEL_VARIABLE_DEVICE',
                'defaultName': 'deviceVariable'
            });
            /* Add additional event options.*/
            WIDGET_CONSTANTS.EVENTS_OPTIONS.push('New DeviceVariable');
            /* Add segment navigation option */
            BaseVariablePropertyFactory.addNavigationOption('gotoSegment', 'gotoSegment');
            //Register the Mobile variable.
            BaseVariablePropertyFactory.register('wm.DeviceVariable',
                {'invoke': DeviceVariableService.invoke},
                ['wm.DeviceVariable'],
                {});
            /* enable page transitions.*/
            BaseVariablePropertyFactory.getPropertyMap('wm.NavigationVariable').pageTransitions.hide = false;
        }])
    //Apply platform OS specific stylesheets
    .run(['$rootScope', 'CONSTANTS', 'Utils', function ($rootScope, CONSTANTS, Utils) {
        'use strict';
        var selectedOs = '';

        function applyOSTheme(os) {
            var themeUrl = '';
            selectedOs = os || selectedOs;
            themeUrl = 'themes/' + $rootScope.project.activeTheme + '/' + selectedOs.toLowerCase() + '/' + 'style.css';
            if (CONSTANTS.isStudioMode) {
                themeUrl = Utils.getProjectResourcePath($rootScope.project.id) + themeUrl;
            }
            WM.element('link[theme="wmtheme"]').remove();
            Utils.loadStyleSheet(themeUrl, {name: 'theme', value: 'wmtheme'});
        }
        if (CONSTANTS.isStudioMode) {
            $rootScope.$on('switch-device', function (event, device) {
                applyOSTheme(device.os);
            });
        } else if (CONSTANTS.isRunMode) {
            //This is for preview page
            window.onmessage = function (msg) {
                if (WM.isObject(msg.data) && msg.data.key === 'switch-device') {
                    applyOSTheme(msg.data.device.os);
                }
            };
            //On Application start
            $rootScope.$on('application-ready', function () {
                //Notify preview window that application is ready. Otherwise, identify the OS.
                if (window.top !== window) {
                    window.top.postMessage({key: 'on-load'}, '*');
                } else if (Utils.isAndroid()) {
                    applyOSTheme('android');
                } else if (Utils.isIphone()) {
                    applyOSTheme('ios');
                }
            });
        }
    }]);
