define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('LoginCtrl', ['$scope', 'authenticationService', 'applicationService', function($scope, authenticationService, applicationService) {
        // http://stackoverflow.com/questions/11938380/global-variables-in-angularjs
        // https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
        // http://stackoverflow.com/questions/20969835/angularjs-login-and-authentication-in-each-route-and-controller
        // http://stackoverflow.com/questions/11541695/angular-js-redirecting-to-a-certain-route-based-on-condition

        // http://stackoverflow.com/questions/17510962/can-angularjs-routes-have-optional-parameter-values
        // http://stackoverflow.com/questions/14833326/how-to-set-focus-in-angularjs

        function initialize() {
            authenticationService.getExternalLogins(authenticationService.returnUrl, true /* generateState */)
                .success(function (data) {
                    $scope.loadingExternalLogin = false;
                    if (typeof (data) === "object") {
                        for (var i = 0; i < data.length; i++) {
                            $scope.externalLoginProviders.push(data[i]);
                        }
                    } else {
                        $scope.errors.push("An unknown error occurred.");
                    }
            }).error(function () {
                    $scope.loadingExternalLogin = false;
                    $scope.errors.push("An unknown error occurred.");
                });
        }

        // Data
        $scope.userName = "";
        $scope.password = "";
        $scope.rememberMe = false;
        $scope.externalLoginProviders = [];

        // Other UI state
        $scope.errors = [];
        $scope.loadingExternalLogin = true;
        $scope.loggingIn = false;

        // Operations
        $scope.login = function () {
            $scope.errors.removeAll();

            $scope.loggingIn = true;

            authenticationService.login({
                grant_type: "password",
                username: $scope.userName,
                password: $scope.password
            }).success(function (data) {
                $scope.loggingIn = false;

                if (data.userName && data.access_token) {
                    applicationService.navigateToLoggedIn(data.userName, data.access_token, $scope.rememberMe);
                } else {
                    $scope.errors.push("An unknown error occurred.");
                }
            }).error(function (data) {
                $scope.loggingIn = false;

                if (data && data.error_description) {
                    $scope.errors.push(data.error_description);
                } else {
                    $scope.errors.push("An unknown error occurred.");
                }
            });
        };

        $scope.register = function () {
            applicationService.navigateToRegister();
        };

        $scope.externalLogin = function (data) {
            sessionStorage["state"] = data.state;
            sessionStorage["loginUrl"] = data.url;
            // IE doesn't reliably persist sessionStorage when navigating to another URL. Move sessionStorage temporarily
            // to localStorage to work around this problem.
            applicationService.archiveSessionStorageToLocalStorage();
            window.location = data.url;
        };

        initialize();
    }]);
});
