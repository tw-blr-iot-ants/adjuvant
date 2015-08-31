  angular.module('orderController', ["chart.js"])

      .controller('orderController', ['$scope', '$http', 'googleService', 'Flash',
            function($scope, $http, googleService, Flash) {

          $http({method: 'GET', url: '/data.json'}).
              success(function(data) {
                  $scope.colours = $scope.labels = data.juices;
                  $scope.displayStats = true;
              });

          $scope.data = [[65, 59, 80, 81, 56, 55, 40]];

          $scope.employeeId = "16305";
          $scope.name = "dixith";

          $scope.placeOrder = function() {
              var order = _constructOrder();
              googleService.create(order)
                      .success(_notifySuccess);
          };

          $scope.getStats = function() {
            googleService.getStats()
             .success(function(data) {
                var st =_.values(data.rows);
                var carray = [];
                _.each(st, function(k) {
                    carray.push([k["1"], k["2"], k["3"]])
                })
                _openInNewTab("http://localhost:8082", carray)

             })
          }

          var _constructOrder = function() {
             return {
                  'name' : $scope.name,
                  'employeeId': $scope.employeeId,
                  'order': $scope.selected
             }
          }

          var _notifySuccess = function(data) {
             $scope.successMessage = true;
             var message = '<strong>Thank you!</strong> We successfully placed your Order';
             Flash.create('success', message, 'col-sm-4 col-sm-offset-4');
          }

          function _openInNewTab(url, carray) {
            var win = window.open(url, '_blank');
            win.focus();
            var html = "";
            html += '<table border="1" class="gridtable" cellspacing="1" cellpadding="5">';
            for (var i = 0; i < carray.length; i++) {
                    var tableRow = ""
                    var subarray = carray[i];
                    tableRow += "<tr><td>" + subarray[0]  + "</td>";
                    tableRow += "<td>" + subarray[1]  + "</td>";
                    tableRow += "<td> " + subarray[2]  + "</td></tr>";

                    html += tableRow;
                    }
            html += '</table>';
            console.log(html)
             win.document.open()
             win.document.write(html)
             win.document.close()
          }
      }]);