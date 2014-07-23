define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('RegisterCtrl', ['$scope', 'applicationService', 'authenticationService', function ($scope, applicationService, authenticationService) {

        // Data
        $scope.userName = "";
        $scope.password = "";
        $scope.confirmPassword = "";

        // Other UI state
        $scope.registering = false;
        $scope.errors = [];
        $scope.validationErrors = [];

        // Operations
        $scope.register = function () {
            $scope.errors.removeAll();

            $scope.registering = true;

            authenticationService.register({
                userName: $scope.userName,
                password: $scope.password,
                confirmPassword: $scope.confirmPassword
            }).success(function (data) {
                authenticationService.login({
                    grant_type: "password",
                    username: $scope.userName,
                    password: $scope.password
                }).success(function (data) {
                    $scope.registering = false;

                    if (data.userName && data.access_token) {
                        applicationService.navigateToLoggedIn(data.userName, data.access_token, false /* persistent */);
                    } else {
                        $scope.errors.push("An unknown error occurred.");
                    }
                }).error(function (data) {
                    $scope.registering = false;

                    if (data && data.error_description) {
                        $scope.errors.push(data.error_description);
                    } else {
                        $scope.errors.push("An unknown error occurred.");
                    }
                });
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

        $scope.login = function () {
            applicationService.navigateToLogin();
        };
    }]);
});
