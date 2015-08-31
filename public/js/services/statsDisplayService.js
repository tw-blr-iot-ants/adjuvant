angular.module('statsDisplayService', [])
	.service('statsDisplayService', function() {




		var displayDetails = function(data) {
		  var rows = _.values(data.rows);
          var details = [];
          _.each(rows, function(k) {
                 details.push([k["1"], k["2"], k["3"]])
          })
          return constructHtmlDom(details);
		};


		var extractSamples = function(data){
          var rows = _.values(data.rows);
          var juiceChoice = [];
          _.each(rows, function(k) {
                 juiceChoice.push(k["3"])
          })
		  var dataObject = _.countBy(juiceChoice , _.identity)
          return dataObject;
		}


        var constructHtmlDom = function(details) {
            var html = "";
            html += '<table border="1" class="gridtable" cellspacing="1" cellpadding="5">';
            for (var i = 0; i < details.length; i++) {
                       var tableRow = ""
                      var individualDetails = details[i];
                      tableRow += "<tr><td>" + individualDetails[0]  + "</td>";
                      tableRow += "<td>" + individualDetails[1]  + "</td>";
                      tableRow += "<td> " + individualDetails[2]  + "</td></tr>";

                       html += tableRow;
            }
            html += '</table>';
            return html;
		}

		return {
		    extractSamples: extractSamples,
		    displayDetails: displayDetails
		}
});