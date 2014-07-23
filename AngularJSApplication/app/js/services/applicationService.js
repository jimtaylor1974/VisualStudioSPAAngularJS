define(['./module'], function (services) {
    'use strict';

    var applicationService = function ($location, $window, $rootScope, authenticationService) {
        // Private state
        var self = this;

        // Private operations
        function getFragment() {
            if ($window.location.hash.indexOf("#") === 0) {
                var queryString = $window.location.hash.substr(1);
                if (queryString.indexOf("/") === 0) {
                    queryString = queryString.substr(1);
                }

                return parseQueryString(queryString);
            } else {
                return {};
            }
        }

        function parseQueryString(queryString) {
            var data = {},
                pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;

            if (queryString === null) {
                return data;
            }

            pairs = queryString.split("&");

            for (var i = 0; i < pairs.length; i++) {
                pair = pairs[i];
                separatorIndex = pair.indexOf("=");

                if (separatorIndex === -1) {
                    escapedKey = pair;
                    escapedValue = null;
                } else {
                    escapedKey = pair.substr(0, separatorIndex);
                    escapedValue = pair.substr(separatorIndex + 1);
                }

                key = decodeURIComponent(escapedKey);
                value = decodeURIComponent(escapedValue);

                data[key] = value;
            }

            return data;
        }

        function verifyStateMatch(fragment) {
            var state;

            if (typeof (fragment.access_token) !== "undefined") {
                state = sessionStorage["state"];
                sessionStorage.removeItem("state");

                if (state === null || fragment.state !== state) {
                    fragment.error = "invalid_state";
                }
            }
        }

        // UI state
        $rootScope.errors = [];

        // UI operations
        self.archiveSessionStorageToLocalStorage = function () {
            var backup = {};

            for (var i = 0; i < sessionStorage.length; i++) {
                backup[sessionStorage.key(i)] = sessionStorage[sessionStorage.key(i)];
            }

            localStorage["sessionStorageBackup"] = JSON.stringify(backup);
            sessionStorage.clear();
        };

        self.restoreSessionStorageFromLocalStorage = function () {
            var backupText = localStorage["sessionStorageBackup"],
                backup;

            if (backupText) {
                backup = JSON.parse(backupText);

                for (var key in backup) {
                    sessionStorage[key] = backup[key];
                }

                localStorage.removeItem("sessionStorageBackup");
            }
        };

        self.navigateToLoggedIn = function (userName, accessToken, persistent) {
            $rootScope.errors.removeAll();

            if (accessToken) {
                authenticationService.setAccessToken(accessToken, persistent);
            }

            $rootScope.user = userName;

            self.navigateToHome();
        };

        self.navigateToLoggedOff = function () {
            $rootScope.errors.removeAll();
            authenticationService.clearAccessToken();
            self.navigateToLogin();
        };

        self.logOff = function () {
            authenticationService.logout().success(function () {
                $rootScope.user = null;
                self.navigateToLoggedOff();
            }).error(function () {
                $rootScope.errors.push("Log off failed.");
            });
        };

        // Other navigateTo functions
        self.navigateToHome = function () {
            $location.path("home");
        };

        self.navigateToLogin = function () {
            $location.path("login");
        };

        self.navigateToRegister = function() {
            $location.path("register");
        };

        self.navigateToManage = function (externalAccessToken, externalError) {
            var path = "manage/" + encodeURIComponent(externalAccessToken);

            if (externalError != null) {
                path += "/" + encodeURIComponent(externalError);
            }

            $location.path(path);
        };

        self.navigateToRegisterExternal = function (userName, loginProvider, externalAccessToken, loginUrl, state) {
            $location.path("registerExternal/"
                + encodeURIComponent(userName) + "/"
                + encodeURIComponent(loginProvider) + "/"
                + encodeURIComponent(externalAccessToken) + "/"
                + encodeURIComponent(loginUrl) + "/"
                + encodeURIComponent(state));
        };
        // Other operations

        self.initialize = function () {
            var fragment = getFragment(),
                externalAccessToken, externalError, loginUrl;

            self.restoreSessionStorageFromLocalStorage();
            verifyStateMatch(fragment);

            if (sessionStorage["associatingExternalLogin"]) {
                sessionStorage.removeItem("associatingExternalLogin");

                if (typeof (fragment.error) !== "undefined") {
                    externalAccessToken = null;
                    externalError = fragment.error;
                } else if (typeof (fragment.access_token) !== "undefined") {
                    externalAccessToken = fragment.access_token;
                    externalError = null;
                } else {
                    externalAccessToken = null;
                    externalError = null;
                }

                authenticationService.getUserInfo()
                    .success(function (data) {
                        if (data.userName) {
                            self.navigateToLoggedIn(data.userName);
                            self.navigateToManage(externalAccessToken, externalError);
                        } else {
                            self.navigateToLogin();
                        }
                    })
                    .error(function () {
                        self.navigateToLogin();
                    });
            } else if (typeof (fragment.error) !== "undefined") {
                self.navigateToLogin();
                $rootScope.errors.push("External login failed.");
            } else if (typeof (fragment.access_token) !== "undefined") {
                authenticationService.getUserInfo(fragment.access_token)
                    .success(function (data) {
                        if (typeof (data.userName) !== "undefined" && typeof (data.hasRegistered) !== "undefined"
                            && typeof (data.loginProvider) !== "undefined") {
                            if (data.hasRegistered) {
                                self.navigateToLoggedIn(data.userName, fragment.access_token, false);
                            }
                            else if (typeof (sessionStorage["loginUrl"]) !== "undefined") {
                                loginUrl = sessionStorage["loginUrl"];
                                sessionStorage.removeItem("loginUrl");
                                self.navigateToRegisterExternal(data.userName, data.loginProvider, fragment.access_token,
                                    loginUrl, fragment.state);
                            }
                            else {
                                self.navigateToLogin();
                            }
                        } else {
                            self.navigateToLogin();
                        }
                    })
                    .error(function () {
                        self.navigateToLogin();
                    });
            } else {
                authenticationService.getUserInfo()
                    .success(function (data) {
                        if (data.userName) {
                            self.navigateToLoggedIn(data.userName);
                        } else {
                            self.navigateToLogin();
                        }
                    })
                    .error(function () {
                        self.navigateToLogin();
                    });
            }
        }
    };

    services.service('applicationService', ['$location', '$window', '$rootScope', 'authenticationService', applicationService]);
});