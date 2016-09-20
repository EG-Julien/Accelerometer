angular.module('app.controllers', ['ionic'])

.controller('liveViewCtrl', function ($scope, $cordovaDeviceMotion, $cordovaFile) {
    $('.units').html('g');

    var tmp = '';
    var check = '';

    $scope.Record = function() {
        if ($scope.record.state == false) {
            $scope.record = {status: 'Stop', state: true};
            $('#page3').addClass("inRecord");
            $('#liveView-button1').addClass("inRecord__button");
            $('#freeze').fadeOut();
        } else {
            $scope.record = {status: 'Record', state: false};
            $('#liveView-button1').removeClass("inRecord__button");
            $('#page3').removeClass("inRecord");
            $('#freeze').fadeIn();
            document.addEventListener("deviceready", function () {
              $cordovaFile.checkFile(cordova.file.dataDirectory, "record.txt")
              .then(function (success) {
                $cordovaFile.writeExistingFile(cordova.file.dataDirectory, "record.txt", tmp + "/");
              }, function (error) {
                 $cordovaFile.writeFile(cordova.file.dataDirectory, "record.txt", tmp + "/");
              });
            });
        }
    };

    $scope.Freeze = function() {
        if ($scope.freeze.state == true) {
            $scope.freeze = {status: "Freeze", state: false};
        } else {
            $scope.freeze = {status: "Play", state: true};
        }
    };

    $scope.setLiveResult = function() {
        if ($scope.showLive.checked == true) {
            $('#liveView-list3').fadeIn();
        } else {
            $('#liveView-list3').fadeOut();
        }
    };

    $scope.changeUnits = function() {
        if ($scope.units.checked == true) {
            $scope.units = { units: 'g', checked: true };
            $('.units').html('g');
        } else {
            $scope.units = { units: 'm/s/s', checked: false };
            $('.units').html('m.s<sup>-2</sup>');
        }
    };

    $scope.showLive = { checked: true };
    $scope.units = { checked: true, units: 'g' };
    $scope.record = { status: "Record", state: false };
    $scope.freeze = { status: "Freeze", state: false };

    document.addEventListener("deviceready", function () {

        $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
            if ($scope.units.units == 'g') {
                $scope.results = {x: (result.x/9.81).toFixed(4), y: (result.y/9.81).toFixed(4), z: (result.z/9.81).toFixed(4), time: result.timestamp};
            } else {
                $scope.results = {x: result.x.toFixed(4), y: result.y.toFixed(4), z: result.z.toFixed(4), time: result.timestamp};
            }
        }, function(err) {
          $scope.results = {error: err};
        });

    });

  var options = { frequency: 10 };

  document.addEventListener("deviceready", function () {

        /*$cordovaFile.checkDir(cordova.file.dataDirectory, "dir/other_dir")
        .then(function (success) {

        }, function (error) {

        });*/


        /*$cordovaFile.writeFile(cordova.file.dataDirectory, "record.tmp", "text", true)
          .then(function (success) {alert('true');}, function (error) {alert('error');});*/

        /*$cordovaFile.writeExistingFile(cordova.file.dataDirectory, "record.tmp", $scope.result)
          .then(function (success) {
            // success
          }, function (error) {
            // error
          });*/

        var watch = $cordovaDeviceMotion.watchAcceleration(options);
        watch.then(
          null,
          function(error) {
            $scope.results = {error_watch: error};
          },

          function(result) {

           if ($scope.units.units == 'g') {
                if ($scope.freeze.state == false) {
                    $scope.results = {x: (result.x/9.81).toFixed(4), y: (result.y/9.81).toFixed(4), z: (result.z/9.81).toFixed(4), time: result.timestamp};
                }
            } else {
                if ($scope.freeze.state == false) {
                    $scope.results = {x: result.x.toFixed(4), y: result.y.toFixed(4), z: result.z.toFixed(4), time: result.timestamp};
                }
            }
            if ($scope.record.state == true) {
                      if (check != "{" + $scope.results.time + "," + $scope.results.x + "," + $scope.results.y + "," + $scope.results.z + "}") {
                        tmp = tmp + "{" + $scope.results.time + "," + $scope.results.x + "," + $scope.results.y + "," + $scope.results.z + "}";
                        check = "{" + $scope.results.time + "," + $scope.results.x + "," + $scope.results.y + "," + $scope.results.z + "}";
                      }
            }
        });
    watch.clearWatch;

    });

})

.controller('graphicsCtrl', ['$scope', '$stateParams',
function ($scope, $cordovaDeviceMotion, $cordovaFile) {

  $scope.Read = function() {
   document.addEventListener("deviceready", function () {
      $cordovaFile.readAsBinaryString(cordova.file.dataDirectory, "record.txt")
        .then(function (success) {
          $scope.data = {records: success};
        }, function (error) {
          alert("Impossible de récupérer les données");
        });
      });
  }

    var rows = [1,  37.8, 80.8, 41.8];
    rows = rows.concat([2,  30.9, 69.5, 32.4]);
    rows = rows.concat([3,  25.4,   57, 25.7]);
    rows = rows.concat([[4,  11.7, 18.8, 10.5]]);
    rows = rows.concat([2,  30.9, 69.5, 32.4]);
    rows = rows.concat([2,  30.9, 69.5, 32.4]);

      google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'Time');
      data.addColumn('number', 'x');
      data.addColumn('number', 'y');
      data.addColumn('number', 'z');

      data.addRows(
        [rows]
      );

      var options = {
        width: 310,
        height: 450,
        axes: {
          x: {
            0: {side: 'top'}
          }
        }
      };

      var chart = new google.charts.Line(document.getElementById('line_top_x'));

      chart.draw(data, options);
    }
}]);
