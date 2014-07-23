define(['./module'], function (directives) {
    'use strict';
    directives.directive('autoFocus', [function () {
        return {
            link: function ($scope, $element, attrs, ctrl) {
                $element[0].focus();
            }
        };
    }]);
});