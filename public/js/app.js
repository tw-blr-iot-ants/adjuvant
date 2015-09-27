var app = angular.module('adjuvant', ['ngRoute',
                                       'orderController', 'statsController', 'detailsController',
                                       'googleService',  'statsService', 'mongooseService',
                                       'fileReader',
                                       'flash'])

app.config(function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'orderController'
        })
        .when('/stats', {
            templateUrl: 'partials/stats.html',
            controller: 'statsController'
        })
        .when('/details', {
            templateUrl: 'partials/details.html',
            controller: 'detailsController'
        })
       .otherwise({
            redirectTo: '/home'
        });
});

app.factory('socket', ['$rootScope', function ($rootScope) {
    return {
        on: function (eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }

            socket.on(eventName, wrapper);

            return function () {
                socket.removeListener(eventName, wrapper);
            };
        },
    };
}]);