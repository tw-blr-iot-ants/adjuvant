(function() {
    'use strict';
    angular.module('flash', [])

    .run(function($rootScope) {
        // initialize variables
        $rootScope.flash = {
            text: '',
            type: '',
            timeout: 5000,
            hasFlash: false
        };
    })

    // Directive for compiling dynamic html
    .directive('dynamic', function($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, ele, attrs) {
                scope.$watch(attrs.dynamic, function(html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    })

    // Directive for closing the flash message
    .directive('closeFlash', function($compile, Flash) {
        return {
            link: function(scope, ele) {
                ele.on('click', function() {
                    Flash.dismiss();
                });
            }
        };
    })

    // Create flashMessage directive
    .directive('flashMessage', function($compile, $rootScope) {
        return {
            restrict: 'A',
            template: '<div role="alert" ng-show="hasFlash" class="alert {{flash.addClass}} alert-{{flash.type}} alert-dismissible ng-hide alertIn alertOut "> <span dynamic="flash.text"></span> <button type="button" class="close" close-flash><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> </div>',
            link: function(scope, ele, attrs) {
                // get timeout value from directive attribute and set to flash timeout
                $rootScope.flash.timeout = parseInt(attrs.flashMessage, 10);
            }
        };
    })

    .factory('Flash', function($rootScope, $timeout) {

        var dataFactory = {};
        var timeOut;

        // Create flash message
        dataFactory.create = function(type, text, addClass) {
            var _this = this;
            $timeout.cancel(timeOut);
            $rootScope.flash.type = type;
            $rootScope.flash.text = text;
            $rootScope.flash.addClass = addClass;
            $timeout(function() {
                $rootScope.hasFlash = true;
            }, 100);

            timeOut = $timeout(function() {
                _this.dismiss();
            }, $rootScope.flash.timeout);
        };

        // Cancel flashmessage timeout function
        dataFactory.pause = function() {
            $timeout.cancel(timeOut);
        };

        // Dismiss flash message
        dataFactory.dismiss = function() {
            $timeout.cancel(timeOut);
            $timeout(function() {
                $rootScope.hasFlash = false;
            });
        };

        return dataFactory;
    });
}());
