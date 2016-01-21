angular.module('tabsController', [])
                .controller('tabsController', ['$scope', '$location', 'loginService',
                function($scope, $location, loginService) {

     $scope.tabs = [
           { link : '#/manageJuices', label : 'Beverages' },
           { link : '#/invoice', label : 'Invoices' },
           { link : '#/manageUsers', label : 'Users' },
           { link : '#/orders', label : 'Orders' },
           { link : '/', label: 'LogOut'}
     ];

      $scope.selectedTab = $scope.tabs[0];
      var hashUrl = "#" + $location.path();

      _.each($scope.tabs, function(tab){
        if(hashUrl == tab.link) {
            $scope.selectedTab = tab;
            return;
        }
      });


      $scope.setSelectedTab = function(tab) {
         $scope.selectedTab = tab;
         if(tab.label == 'LogOut') {
            loginService.destroyLoginSession();
         }
      }

      $scope.tabClass = function(tab) {
         if ($scope.selectedTab == tab) {
           return "active";
         } else {
           return "";
         }
      }

}])