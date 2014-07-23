/**
 * loads sub modules and wraps them up into the main module
 * this should be used for top-level module definitions only
 */

// Uncomment relevant lines to add filters

define([
    'angular',
    'angular-route',
    './controllers/index',
    './directives/index',
    // './filters/index',
    './services/index'
], function (angular) {
    'use strict';

    var app = angular.module('app', [
        'app.controllers',
        'app.directives',
        // 'app.filters',
        'app.services',
        'ngRoute'
    ]);

    app.run(function(applicationService) {
        applicationService.initialize();
    });

    return app;
});
