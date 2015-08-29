var Spreadsheet = require('edit-google-spreadsheet');
var q = require('q')
const REFRESH_TOKEN = '1/eCSVPdUrVzqK6VdLsB9sH--hUWm7i8-Cb0Bke0HG_XA';
const CLIENT_ID = '130327654647-2i9su4eumpi2jpgae7bee7u7lntqu5r6.apps.googleusercontent.com';
const CLIENT_SECRET = 'C9KIh6U4eLjZGwjwOVqgvcoS';
const FILE_ID = '1-aZwba8WVGTVAurXlZzOl66Wi0mfcuhiSOEawmYhs-g';

var spreadsheetSetup = function(order) {
    Spreadsheet.load({
                debug: true,
                spreadsheetName: 'demo log',
                worksheetName: 'Sheet1',


                 oauth2: {
                      client_id: CLIENT_ID,
                      client_secret: CLIENT_SECRET,
                      refresh_token: REFRESH_TOKEN
                    }

                    }, function sheetReady(err, spreadsheet) {
                          var existingsRows ;
                          var datObject = {}

                           var metaDataPromise = function() {
                                return q({});
                           }

                          var addRowToSheet = function() {
                            var transformOrder = {};
                            transformOrder["1"] = order.name;
                            transformOrder["2"] =order.employeeId;
                            transformOrder["3"] =order.order;

                            console.log("add", order)
                            console.log("add", transformOrder)

                            datObject[existingsRows] = transformOrder;
                            spreadsheet.add(datObject);
                            return q({})
                          }
                          var sendDataToSheet = function() {
                               console.log("send")
                              spreadsheet.send(function(err) {
                                if(err) throw err;
                                console.log("Updated Cell at row 3, column 5 to 'hello!'");
                              });
                          }

                          spreadsheet.receive(function(err, rows, info) {
                                                                 console.log("meta")
                                                                 if(err) throw err;
                                                                 console.log(info.totalRows)
                                                                 existingsRows = info.totalRows + 1;
                                                                 metaDataPromise()
                                                                    .then(addRowToSheet)
                                                                    .then(sendDataToSheet)
                                                               });


                    });

}


module.exports = {
    writeData : spreadsheetSetup
}

