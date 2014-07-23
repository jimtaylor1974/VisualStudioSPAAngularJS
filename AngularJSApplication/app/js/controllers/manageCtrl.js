define(['./module'], function (controllers) {
    'use strict';

    controllers.controller('ManageCtrl', ['$window', '$scope', '$rootScope', '$routeParams', 'applicationService', 'authenticationService', function ($window, $scope, $rootScope, $routeParams, applicationService, authenticationService) {

        var startedLoad = false;

        // UI state used by private state
        $scope.logins = [];

        // Private state
        $scope.hasLocalPassword = function () {
            var logins = $scope.logins;

            for (var i = 0; i < logins.length; i++) {
                if (logins[i].loginProvider === $scope.localLoginProvider) {
                    return true;
                }
            }

            return false;
        };

        // Data
        $scope.userName = "";
        $scope.localLoginProvider = null;

        // UI state
        $scope.externalLoginProviders = [];
        $scope.loading = true;
        $scope.message = "";
        $scope.errors = [];
        $scope.removingLogin = false;

        $scope.hasExternalLogin = function () {
            return $scope.externalLoginProviders.length > 0;
        };

        $scope.canRemoveLogin = function () {
            return $scope.logins.length > 1;
        };

        // Set password

        $scope.setPassword = {
            // Data
            newPassword: "",
            confirmPassword: "",

            // Other UI state
            setting: false,
            errors: [],

            // Operations
            set: function () {
                $scope.setPassword.errors.removeAll();

                $scope.setPassword.setting = true;

                authenticationService.setPassword({
                    newPassword: $scope.setPassword.newPassword,
                    confirmPassword: $scope.setPassword.confirmPassword
                }).success(function (data) {
                    $scope.setPassword.newPassword = "";
                    $scope.setPassword.confirmPassword = "";
                    $scope.setPassword.setting = false;

                    $scope.localPasswordFormScope.localPasswordForm.$setPristine();

                    $scope.logins.push({
                        loginProvider: $scope.localLoginProvider,
                        providerKey: $scope.userName
                    });

                    $scope.message = "Your password has been set.";
                }).error(function (data) {
                    var errors;

                    $scope.setPassword.setting = false;
                    errors = authenticationService.toErrorsArray(data);

                    if (errors) {
                        $scope.setPassword.errors = errors;
                    } else {
                        $scope.setPassword.errors.push("An unknown error occurred.");
                    }
                });
            }
        };

        // Change password

        var changePasswordReset = function () {
            $scope.changePassword.errors.removeAll();
            $scope.changePassword.oldPassword = "";
            $scope.changePassword.newPassword = "";
            $scope.changePassword.confirmPassword = "";
            $scope.changePassword.changing = false;
        };

        $scope.changePassword = {
            // Data
            oldPassword: "",
            newPassword : "",
            confirmPassword: "",

            // Other UI state
            changing: false,
            errors: [],

            // Operations
            change: function () {
                $scope.changePassword.errors.removeAll();

                $scope.changePassword.changing = true;

                authenticationService.changePassword({
                    oldPassword: $scope.changePassword.oldPassword,
                    newPassword: $scope.changePassword.newPassword,
                    confirmPassword: $scope.changePassword.confirmPassword
                }).success(function (data) {
                    $scope.changePassword.changing = false;
                    changePasswordReset();
                    $scope.changePasswordFormScope.changePasswordForm.$setPristine();
                    $scope.message = "Your password has been changed.";
                }).error(function (data) {
                    var errors;

                    $scope.changePassword.changing = false;
                    errors = authenticationService.toErrorsArray(data);

                    if (errors) {
                        $scope.changePassword.errors = errors;
                    } else {
                        $scope.changePassword.errors.push("An unknown error occurred.");
                    }
                });
            }
        };

        // Operations
        $scope.setFormScope = function (formName, formScope) {
            // Required when a form if contained in ng-if which creates a child scope.
            $scope[formName + "Scope"] = formScope;
        };

        var load = function () { // Load user management data
            if (!startedLoad) {
                startedLoad = true;

                authenticationService.getManageInfo(authenticationService.returnUrl, true /* generateState */)
                    .success(function (data) {
                        if (typeof (data.localLoginProvider) !== "undefined" &&
                            typeof (data.userName) !== "undefined" &&
                            typeof (data.logins) !== "undefined" &&
                            typeof (data.externalLoginProviders) !== "undefined") {
                            $scope.userName = data.userName;
                            $scope.localLoginProvider = data.localLoginProvider;

                            for (var i = 0; i < data.logins.length; i++) {
                                $scope.logins.push(data.logins[i]);
                            }

                            for (var i = 0; i < data.externalLoginProviders.length; i++) {
                                $scope.externalLoginProviders.push(data.externalLoginProviders[i]);
                            }
                        } else {
                            applicationService.errors.push("Error retrieving user information.");
                        }

                        $scope.loading = false;
                    }).error(function (data) {
                        var errors;

                        $scope.loading = false;
                        errors = authenticationService.toErrorsArray(data);

                        if (errors) {
                            applicationService.errors = errors;
                        } else {
                            applicationService.errors.push("Error retrieving user information.");
                        }
                    });
            }
        }

        $scope.home = function () {
            applicationService.navigateToHome();
        };

        var addExternalLogin = function (externalAccessToken, externalError) {
            externalAccessToken = externalAccessToken || null;
            externalError = externalError || null;

            if (externalError !== null || externalAccessToken === null) {
                $scope.errors.push("Failed to associate external login.");

                load();
            } else {
                authenticationService.addExternalLogin({
                    externalAccessToken: externalAccessToken
                }).success(function (data) {
                    load();
                }).error(function (data) {
                    var errors = authenticationService.toErrorsArray(data);

                    if (errors) {
                        $scope.errors(errors);
                    } else {
                        $scope.errors.push("An unknown error occurred.");
                    }

                    load();
                });
            }
        };

        $scope.removeLogin = function(login) {
            $scope.errors.removeAll();

            $scope.removingLogin = true;

            authenticationService.removeLogin({
                loginProvider: login.loginProvider,
                providerKey: login.providerKey
            }).success(function (data) {
                $scope.removingLogin = false;
                $scope.logins.remove(login);
                $scope.message = "The login was removed.";
            }).error(function (data) {
                var errors;

                $scope.removingLogin = false;
                errors = authenticationService.toErrorsArray(data);

                if (errors) {
                    $scope.errors = errors;
                } else {
                    $scope.errors.push("An unknown error occurred.");
                }
            });
        };

        $scope.login = function (externalLoginProvider) {
            sessionStorage["state"] = externalLoginProvider.state;
            sessionStorage["associatingExternalLogin"] = true;
            // IE doesn't reliably persist sessionStorage when navigating to another URL. Move sessionStorage temporarily
            // to localStorage to work around this problem.
            applicationService.archiveSessionStorageToLocalStorage();
            $window.location = externalLoginProvider.url;
        };

        var externalAccessToken = $routeParams.externalAccessToken;
        var externalError = $routeParams.externalError;

        if (typeof (externalAccessToken) !== "undefined" || typeof (externalError) !== "undefined") {
            addExternalLogin(externalAccessToken, externalError);
        } else {
            load();
        };
    }]);
});
