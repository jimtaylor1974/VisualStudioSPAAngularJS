define(['./module'], function (services) {
    'use strict';

    var authenticationService = function ($http, serviceBase) {
        var self = this,

        // Routes
        addExternalLoginUrl = serviceBase + "api/Account/AddExternalLogin",
        changePasswordUrl = serviceBase + "api/Account/changePassword",
        loginUrl = serviceBase + "Token",
        logoutUrl = serviceBase + "api/Account/Logout",
        registerUrl = serviceBase + "api/Account/Register",
        registerExternalUrl = serviceBase + "api/Account/RegisterExternal",
        removeLoginUrl = serviceBase + "api/Account/RemoveLogin",
        setPasswordUrl = serviceBase + "api/Account/setPassword",
        siteUrl = "/",
        userInfoUrl = serviceBase + "api/Account/UserInfo";

        // Route operations
        function externalLoginsUrl(returnUrl, generateState) {
            return serviceBase + "api/Account/ExternalLogins?returnUrl=" + (encodeURIComponent(returnUrl)) +
                "&generateState=" + (generateState ? "true" : "false");
        }

        function manageInfoUrl(returnUrl, generateState) {
            return serviceBase + "api/Account/ManageInfo?returnUrl=" + (encodeURIComponent(returnUrl)) +
                "&generateState=" + (generateState ? "true" : "false");
        }

        // Other private operations
        function getSecurityHeaders() {
            var accessToken = sessionStorage["accessToken"] || localStorage["accessToken"];

            if (accessToken) {
                return { "Authorization": "Bearer " + accessToken };
            }

            return {};
        }

        function getHttp(config) {
            if (config.method === "POST") {
                // http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
                config.headers = config.headers || {};
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

                var param = function (obj) {
                    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

                    for (name in obj) {
                        value = obj[name];

                        if (value instanceof Array) {
                            for (i = 0; i < value.length; ++i) {
                                subValue = value[i];
                                fullSubName = name + '[' + i + ']';
                                innerObj = {};
                                innerObj[fullSubName] = subValue;
                                query += param(innerObj) + '&';
                            }
                        }
                        else if (value instanceof Object) {
                            for (subName in value) {
                                subValue = value[subName];
                                fullSubName = name + '[' + subName + ']';
                                innerObj = {};
                                innerObj[fullSubName] = subValue;
                                query += param(innerObj) + '&';
                            }
                        }
                        else if (value !== undefined && value !== null)
                            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }

                    return query.length ? query.substr(0, query.length - 1) : query;
                };

                config.transformRequest = [function (data) {
                    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
                }];
            }

            config.cache = false;

            return $http(config);
        }

        // Operations
        self.clearAccessToken = function () {
            localStorage.removeItem("accessToken");
            sessionStorage.removeItem("accessToken");
        };

        self.setAccessToken = function (accessToken, persistent) {
            if (persistent) {
                localStorage["accessToken"] = accessToken;
            } else {
                sessionStorage["accessToken"] = accessToken;
            }
        };

        self.toErrorsArray = function (data) {
            var errors = new Array(),
                items;

            if (!data || !data.message) {
                return null;
            }

            if (data.modelState) {
                for (var key in data.modelState) {
                    items = data.modelState[key];

                    if (items.length) {
                        for (var i = 0; i < items.length; i++) {
                            errors.push(items[i]);
                        }
                    }
                }
            }

            if (errors.length === 0) {
                errors.push(data.message);
            }

            return errors;
        };

        // Data
        self.returnUrl = siteUrl;

        // Data access operations
        self.addExternalLogin = function (data) {
            return getHttp({ url: addExternalLoginUrl,
                method: "POST",
                data: data,
                headers: getSecurityHeaders()
            });
        };

        self.changePassword = function (data) {
            return getHttp({ url: changePasswordUrl,
                method: "POST",
                data: data,
                headers: getSecurityHeaders()
            });
        };

        self.getExternalLogins = function (returnUrl, generateState) {
            return getHttp({
                url: externalLoginsUrl(returnUrl, generateState),
                method: "GET",
                cache: false,
                headers: getSecurityHeaders()
            });
        };

        self.getManageInfo = function (returnUrl, generateState) {
            return getHttp({
                url: manageInfoUrl(returnUrl, generateState),
                method: "GET",
                cache: false,
                headers: getSecurityHeaders()
            });
        };

        self.getUserInfo = function (accessToken) {
            var headers;

            if (typeof (accessToken) !== "undefined") {
                headers = {
                    "Authorization": "Bearer " + accessToken
                };
            } else {
                headers = getSecurityHeaders();
            }

            return getHttp({
                url: userInfoUrl,
                method: "GET",
                cache: false,
                headers: headers
            });
        };

        self.login = function (data) {
            return getHttp({ url: loginUrl,
                method: "POST",
                data:  data
            });
        };

        self.logout = function () {
            return getHttp({ url: logoutUrl,
                method: "POST",
                headers: getSecurityHeaders()
            });
        };

        self.register = function (data) {
            return getHttp({ url: registerUrl,
                method: "POST",
                data:  data
            });
        };

        self.registerExternal = function (accessToken, data) {
            return getHttp({ url: registerExternalUrl,
                method: "POST",
                data: data,
                headers: {
                    "Authorization": "Bearer " + accessToken
                }
            });
        };

        self.removeLogin = function (data) {
            return getHttp({ url: removeLoginUrl,
                method: "POST",
                data: data,
                headers: getSecurityHeaders()
            });
        };

        self.setPassword = function (data) {
            return getHttp({ url: setPasswordUrl,
                method: "POST",
                data: data,
                headers: getSecurityHeaders()
            });
        };

        return self;
    };

    services.service('authenticationService', ['$http', 'serviceBase', authenticationService]);
});