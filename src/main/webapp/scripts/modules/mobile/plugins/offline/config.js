/*global WM, wm, _, FileTransfer, window*/

/**
 * @ngdoc overview
 * @name wm.plugins.offline
 * @description
 * The 'wm.plugins.offline' module provides offline support to a mobile application.
 *
 * A SQLite database is used for storing data on the device. When the device is online, data will be pushed to this
 * database. Thus stored data will be used when the device goes offline. During offline, any data changes will be
 * recorded and will be pushed to the server when the app goes online.
 *
 * Offline module also supports file upload during offline. When the device goes online, files will be actually
 * uploaded.
 */
wm.plugins.offline = WM.module('wm.plugins.offline', ['wm.plugins.database', 'ngCordova']);

/*Creating namespaces for the controllers, services etc. of the module*/
wm.plugins.offline.directives = {};
wm.plugins.offline.controllers = {};
wm.plugins.offline.services = {};
wm.plugins.offline.factories = {};

/*Defining the controllers, services etc. required for the offline services module*/
wm.plugins.offline.directive(wm.plugins.offline.directives);
wm.plugins.offline.controller(wm.plugins.offline.controllers);
wm.plugins.offline.service(wm.plugins.offline.services);
wm.plugins.offline.factory(wm.plugins.offline.factories);


wm.plugins.offline.constant('OFFLINE_WAVEMAKER_DATABASE_SCHEMA', {
    'name': 'wavemaker',
    'version': 1,
    'tables': [{
        'name': 'offlineChangeLog',
        'entityName': 'offlineChangeLog',
        'columns': [{
            'fieldName': 'id',
            'name': 'id',
            'primaryKey': true
        }, {
            'name': 'service',
            'fieldName': 'service'
        }, {
            'name': 'operation',
            'fieldName': 'operation'
        }, {
            'name': 'params',
            'fieldName': 'params'
        }, {
            'name': 'timestamp',
            'fieldName': 'timestamp'
        }]
    }]
});

wm.plugins.offline.constant('OFFLINE_SERVICE_URLS', {
    OfflineService: {
        getDatabaseSchema: {
            url: 'metadata/app/dataModel.json',
            method: 'GET'
        }
    }
});

/*Bootstrapping the offline module*/
wm.plugins.offline.run([
    '$cordovaNetwork',
    '$document',
    '$q',
    '$rootScope',
    'BaseService',
    'BaseServiceManager',
    'DatabaseService',
    'NavigationService',
    'ChangeLogService',
    'LocalDBService',
    'OfflineFileUploadService',
    'OFFLINE_SERVICE_URLS',
    'OFFLINE_WAVEMAKER_DATABASE_SCHEMA',
    'Utils',
    'wmSpinner',
    'wmToaster',
    function ($cordovaNetwork,
              $document,
              $q,
              $rootScope,
              BaseService,
              BaseServiceManager,
              DatabaseService,
              NavigationService,
              ChangeLogService,
              LocalDBService,
              OfflineFileUploadService,
              OFFLINE_SERVICE_URLS,
              OFFLINE_WAVEMAKER_DATABASE_SCHEMA,
              Utils,
              wmSpinner,
              wmToaster) {
        'use strict';
        /*
         * Intercepts FileTransfer#upload and if device is offline, then OfflineFileUploadService will handle it.
         */
        function addOfflineFileUploadSupport() {
            OfflineFileUploadService.init();
            var upload = FileTransfer.prototype.upload;
            FileTransfer.prototype.upload = function (filePath, serverUrl, onSuccess, onFail, ftOptions) {
                if ($cordovaNetwork.isOnline()) {
                    return upload.call(this, filePath, serverUrl, onSuccess, onFail, ftOptions);
                }
                return OfflineFileUploadService.upload(filePath, serverUrl, ftOptions).then(function (result) {
                    onSuccess({
                        responseCode: 200,
                        response: JSON.stringify([result])
                    });
                }, onFail);
            };
        }
        /*
         * During offline, LocalDBService will answer to all the calls. All data modifications will be recorded
         * and will be reported to DatabaseService when device goes online.
         */
        function handleOfflineDBcall(operation, params, successCallback, failureCallback) {
            LocalDBService[operation](params, function (response) {
                if (_.includes(['insertTableData', 'updateTableData', 'deleteTableData'], operation)) {
                    ChangeLogService.add('DatabaseService', operation, params).then(function () {
                        Utils.triggerFn(successCallback, response);
                    }, failureCallback);
                } else {
                    Utils.triggerFn(successCallback, response);
                }
            }, failureCallback, true);
        }

        /*
         * During online, all read operations data will be pushed to offline database. Similarly, Update and Delete
         * operations are synced with the offline database.
         */
        function handleOnlineDBcall(operation, onlineHandler, params, successCallback, failureCallback) {
            onlineHandler.call(DatabaseService, params, function (response) {
                if (_.includes(['readTableData', 'searchTableData'], operation)) {
                    _.forEach(response.content, function (r) {
                        var updateParams = {
                            dataModelName: params.dataModelName,
                            entityName: params.entityName,
                            data: r
                        };
                        LocalDBService.updateTableData(updateParams, WM.noop, WM.noop, false);
                    });
                } else if (_.includes(['updateTableData', 'deleteTableData'], operation)) {
                    LocalDBService[operation](params, WM.noop, WM.noop, false);
                }
                successCallback(response);
            }, failureCallback);
        }

        /*
         * DatabaseService calls will be routed through offline module.
         */
        function addOfflineDatabaseSupport() {
            var operations = ['insertTableData',
                              'updateTableData',
                              'deleteTableData',
                              'readTableData',
                              'searchTableData'];
            _.forEach(operations, function (operation) {
                var onlineHandler = DatabaseService[operation];
                if (onlineHandler) {
                    DatabaseService[operation] = function (params, successCallback, failureCallback) {
                        if ($cordovaNetwork.isOffline()) {
                            handleOfflineDBcall(operation, params, successCallback, failureCallback);
                        } else {
                            handleOnlineDBcall(operation, onlineHandler, params, successCallback, failureCallback);
                        }
                    };
                }
            });
        }

        /*
         * Load schema into offline database.
         */
        function loadOfflineDatabaseSchemas() {
            var defer = $q.defer();
            LocalDBService.loadSchema(OFFLINE_WAVEMAKER_DATABASE_SCHEMA);
            BaseService.send({
                target: 'OfflineService',
                action: 'getDatabaseSchema'
            }, function (schemas) {
                if (_.isArray(schemas)) {
                    _.forEach(schemas, function (schema) {
                        LocalDBService.loadSchema(schema);
                    });
                } else {
                    LocalDBService.loadSchema(schemas);
                }
                defer.resolve();
            }, function () {
                defer.reject();
            });
            return defer.promise;
        }

        /*
         * A flush will be triggered on ChangeLogService. Once the flush is completed, user will be navigated to the
         * main page.
         */
        function flushOfflineChaneLog() {
            var spinnerId = wmSpinner.show('Sending offline changes ... ');
            ChangeLogService.flush(function (stats) {
                LocalDBService.clearAll().then(function () {
                    if (stats.error > 0) {
                        wmToaster.show('error', 'ERROR', 'Offline flush failed.');
                    }
                    wmSpinner.hide(spinnerId);
                    NavigationService.goToPage('Main');
                });
            });
        }

        function init() {
            BaseServiceManager.register(OFFLINE_SERVICE_URLS);
            loadOfflineDatabaseSchemas().then(function () {
                LocalDBService.init();
                addOfflineFileUploadSupport();
                addOfflineDatabaseSupport();
                // When the device is online, flush ChangeLogService only if there are any changes to flush.
                $rootScope.$on('$cordovaNetwork:online', function () {
                    ChangeLogService.getLogLength().then(function (length) {
                        if (length > 0) {
                            flushOfflineChaneLog();
                        }
                    });

                });
            });
        }

        //Initialize offline module only if SQLite plugin is available.
        $document.one('deviceready', function () {
            if (window.SQLitePlugin) {
                init();
            }
        });
    }
]);