var adjuvant = angular.module('adjuvant', ['ngRoute', 'tabsController', 'juiceController',
                                      'invoiceController', 'usersController', 'ordersController',
                                      'mongooseService', 'invoiceService', 'loginController', 'loginService',
                                      'ui.bootstrap'])

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
        })
        .when('/orders', {
            templateUrl: 'partials/orders.html',
            controller: 'ordersController'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginController'
        })
       .otherwise({
            redirectTo: '/login'
        });
})
.factory('httpResponseInterceptor', ['$q', '$location', function($q, $location) {
    return {
    responseError: function(rejection) {
                if (rejection.status === 401) {
                    console.log("Response Error 401",rejection);
                    $location.path('/');
                }
                return $q.reject(rejection);
            }}
}])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('httpResponseInterceptor');
}]);
