var app = angular.module('adjuvant', ['ngRoute', 'tabsController', 'juiceController',
                                      'invoiceController',
                                      'mongooseService', 'invoiceService'])

app.config(function($routeProvider) {
    $routeProvider
        .when('/manageJuices', {
            templateUrl: 'partials/manageJuices.html',
            controller: 'juiceController'
        })
        .when('/invoice', {
            templateUrl: 'partials/invoice.html',
            controller: 'invoiceController'
        })
       .otherwise({
            redirectTo: '/manageJuices'
        });
});
