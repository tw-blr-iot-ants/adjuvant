var app = angular.module('adjuvant', ['ngRoute', 'orderController', 'statsController', 'googleService',  'statsDisplayService', 'flash'])


app.config(function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'home.html',
            controller: 'orderController'
        })
        .when('/stats', {
            templateUrl: 'stats.html',
            controller: 'statsController'
        })
        .otherwise({
            redirectTo: '/home'
        });
});