var app = angular.module('adjuvant', ['ngRoute',
                                       'orderController', 'statsController', 'detailsController',
                                       'googleService',  'statsDisplayService', 'mongooseService',
                                       'flash'])

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
        .when('/details', {
            templateUrl: 'details.html',
            controller: 'detailsController'
        })
        .otherwise({
            redirectTo: '/home'
        });
});