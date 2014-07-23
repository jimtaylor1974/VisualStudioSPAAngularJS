/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./app'], function (app) {
    'use strict';

    return app.config(['$routeProvider', function ($routeProvider) {

        // http://stackoverflow.com/questions/11541695/angular-js-redirecting-to-a-certain-route-based-on-condition
        var checkRouting = function ($q, $rootScope, $location) {
            if ($rootScope.user) {
                return true;
            } else {
                $location.path("login");
                return false;
            }
        };

        $routeProvider.when('/login', {
            templateUrl: 'app/templates//login.html',
            controller: 'LoginCtrl'
        });

        $routeProvider.when('/home', {
            templateUrl: 'app/templates//home.html',
            controller: 'HomeCtrl',
            resolve: {
                factory: checkRouting
            }
        });

        $routeProvider.when('/manage/:externalAccessToken?/:externalError?', {
            templateUrl: 'app/templates//manage.html',
            controller: 'ManageCtrl',
            resolve: {
                factory: checkRouting
            }
        });

        $routeProvider.when('/register', {
            templateUrl: 'app/templates//register.html',
            controller: 'RegisterCtrl'
        });

        $routeProvider.when('/registerExternal/:userName/:loginProvider/:externalAccessToken/:loginUrl/:state', {
            templateUrl: 'app/templates//registerExternal.html',
            controller: 'RegisterExternalCtrl'
        });

        $routeProvider.otherwise({
            redirectTo: '/home',
            resolve: {
                factory: checkRouting
            }
        });
    }]);
});
