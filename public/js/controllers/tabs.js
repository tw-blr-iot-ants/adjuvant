angular.module('tabsController', [])
                .controller('tabsController', ['$scope', '$location',
                function($scope, $location) {

     $scope.tabs = [
           { link : '#/manageJuices', label : 'Beverages' },
           { link : '#/invoice', label : 'Invoices' },
           { link : '#/manageUsers', label : 'Users' }
     ];

      var hashUrl = "#" + $location.path();

      _.each($scope.tabs, function(tab){
        if(hashUrl == tab.link) {
            $scope.selectedTab = tab;
            return;
        }
      });


      $scope.setSelectedTab = function(tab) {
         $scope.selectedTab = tab;
      }

      $scope.tabClass = function(tab) {
         if ($scope.selectedTab == tab) {
           return "active";
         } else {
           return "";
         }
      }

}])