define(['./module'], function (controllers) {
    'use strict';
    controllers.controller('ApplicationCtrl', ['$scope', '$rootScope', 'applicationService', function ($scope, $rootScope, applicationService) {
        function setUserScope() {
            $scope.loggedIn = $rootScope.user != null;
            $scope.name = $rootScope.user ? $rootScope.user : "";            
        }

        $scope.year = new Date().getFullYear();

        $scope.errors = [];

        $rootScope.$watch('user', function () {
            setUserScope();
        });

        $rootScope.$watch('errors', function () {
            $scope.errors = $rootScope.errors;
        });

        $scope.logOff = function () {
            applicationService.logOff();
        };
    }]);
});