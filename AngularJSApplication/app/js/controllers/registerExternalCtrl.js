define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('RegisterExternalCtrl', ['$scope', '$routeParams', '$window', 'authenticationService', 'applicationService', function ($scope, $routeParams, $window, authenticationService, applicationService) {
        var userName = $routeParams.userName;
        var loginProvider = $routeParams.loginProvider;
        var externalAccessToken = $routeParams.externalAccessToken;
        var loginUrl = $routeParams.loginUrl;
        var state = $routeParams.state;

        // Data
        $scope.loginProvider = loginProvider;
        $scope.userName = userName;

        // Other UI state
        $scope.registering = false;
        $scope.externalAccessToken = externalAccessToken;
        $scope.state = state;
        $scope.loginUrl = loginUrl;
        $scope.errors = [];

        // Register

        $scope.register = function () {
            $scope.errors.removeAll();

            $scope.registering = true;
            authenticationService.registerExternal($scope.externalAccessToken, {
                userName: $scope.userName
            }).success(function (data) {
                sessionStorage["state"] = $scope.state;
                // IE doesn't reliably persist sessionStorage when navigating to another URL. Move sessionStorage
                // temporarily to localStorage to work around this problem.
                applicationService.archiveSessionStorageToLocalStorage();

                $rootScope.user = $scope.userName;

                $window.location = $scope.loginUrl;
            }).error(function (data) {
                var errors;

                $scope.registering = false;
                errors = authenticationService.toErrorsArray(data);

                if (errors) {
                    $scope.errors = errors;
                } else {
                    $scope.errors.push("An unknown error occurred.");
                }
            });
        };
    }]);
});
