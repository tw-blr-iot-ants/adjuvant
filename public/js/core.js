var app = angular.module('adjuvant', ['ngRoute',
                                       'orderController', 'statsController', 'detailsController',
                                       'googleService',  'statsService', 'mongooseService',
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