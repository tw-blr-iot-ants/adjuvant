var Spreadsheet = require('edit-google-spreadsheet');
var q = require('q');

var getSpreadSheetInfo = function() {
           var deferredResult = q.defer();
           Spreadsheet.load(spreadsheetSetup() , function sheetReady(err, spreadsheet) {
                                 spreadsheet.receive(function(err, rows, info) {
                                     if(err) throw err;
                                     deferredResult.resolve({"rows" : rows})
                                 });
                           });
           return deferredResult.promise;;
}


var updateSpreadSheet = function(order) {

    var deferredResult = q.defer();
    Spreadsheet.load(spreadsheetSetup() , function sheetReady(err, spreadsheet) {
                          var nextRow ;
                          var datObject = {}

                          var addRowToSheet = function() {
                            var transformOrder = {};
                            transformOrder["1"] = order.Date;
                            transformOrder["2"] = order.Name;
                            transformOrder["3"] =order.EmployeeId;
                            transformOrder["4"] =order.Order;

                            datObject[nextRow] = transformOrder;
                            spreadsheet.add(datObject);
                            return q({})
                          }
                          var sendDataToSheet = function() {
                              spreadsheet.send(function(err) {
                                if(err) throw err;
                              deferredResult.resolve({"result": metaInfo})
                              });
                          }

                          var errorCallback =function(err) {
                            console.log("error while updating contents of sheet", err)
                          };

                          spreadsheet.receive(function(err, rows, info) {
                              metaInfo = info;
                              if(err) throw err;
                              nextRow = info.totalRows + 1;
                              q({})
                                 .then(addRowToSheet)
                                 .then(sendDataToSheet, errorCallback)
                          });
                    });
    return deferredResult.promise;
}

var deleteContents = function(order) {
    var deferredResult = q.defer();
    var existingsRows;
    Spreadsheet.load(spreadsheetSetup() , function sheetReady(err, spreadsheet) {
                          var addRowToSheet = function() {
                            var dataObject = []
                            for(var i=0; i<existingsRows ; i++) {
                                dataObject.push(["", "", "", ""]) //todo remove magic number
                            }
                            spreadsheet.add(dataObject);
                            return q({})
                          }

                          var sendDataToSheet = function() {
                              spreadsheet.send(function(err) {
                                if(err) throw err;
                              deferredResult.resolve({"result": "SUCCESS"})
                              });
                          }

                          var errorCallback =function(err) {
                            console.log("error while deleting contents of sheet", err)
                          }

                          spreadsheet.receive(function(err, rows, info) {
                              if(err) throw err;
                              existingsRows = info.totalRows + 1;
                              q({})
                                 .then(addRowToSheet)
                                 .then(sendDataToSheet, errorCallback)

                          });
    });
    return deferredResult.promise;
}

var spreadsheetSetup = function() {
      return {
          debug: true,
          spreadsheetName: 'demo log',
          worksheetName: 'Sheet1',

          oauth2: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: REFRESH_TOKEN
          }
      }
 }


module.exports = {
    getSpreadSheetInfo : getSpreadSheetInfo,
    updateSpreadSheet : updateSpreadSheet,
    deleteContents: deleteContents
}

