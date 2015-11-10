var adjuvant = angular.module('adjuvant', ['ngRoute', 'tabsController', 'juiceController',
                                      'invoiceController', 'usersController', 'ordersController',
                                      'mongooseService', 'invoiceService'])

adjuvant.config(function($routeProvider) {
    $routeProvider
        .when('/manageJuices', {
            templateUrl: 'partials/manageJuices.html',
            controller: 'juiceController'
        })
        .when('/invoice', {
            templateUrl: 'partials/invoice.html',
            controller: 'invoiceController'
        })
        .when('/manageUsers', {
            templateUrl: 'partials/manageUsers.html',
            controller: 'usersController'
        }).when('/orders', {
            templateUrl: 'partials/orders.html',
            controller: 'ordersController'
        })
       .otherwise({
            redirectTo: '/manageJuices'
        });
});
