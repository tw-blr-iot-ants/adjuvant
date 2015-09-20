var app = angular.module('adjuvant', ['ngRoute',
                                       'orderController', 'mongooseService', 'flash'])

app.config(function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'orderController'
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