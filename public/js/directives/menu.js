angular.module('adjuvant').directive('dropdown', function() {

    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: "/partials/dropdown.html",
        scope: {
        			placeholder: "@",
        			list: "=",
        			selected: "=",
        			property: "@"
        		},
         link: function(scope) {
          			scope.listVisible = true;
          			scope.isPlaceholder = true;

          			scope.$watch("selected", function(value) {
          				scope.selectedItem = value && value.name;
          				scope.display = scope.selected;
          			});
          		}
         }

  });



