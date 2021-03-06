angular.module('app.controllers', ['ionic'])

.controller('liveViewCtrl', function ($scope, $cordovaDeviceMotion, $cordovaFile) {
    $('.units').html('g');

    var tmp = '';
    var check = '';
    var $names;

    $scope.Record = function() {
      var file_name = "record_" + new Date().getTime();
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
              $cordovaFile.checkFile(cordova.file.dataDirectory, "records.txt")
              .then(function (success) {
                  $cordovaFile.readAsBinaryString(cordova.file.dataDirectory, "records.txt")
                  .then(function (success) {
                    $names = success;
                    alert($names);
                  }, function (error) {
                    alert("Impossible de récupérer les données");
                  });
                });
                $cordovaFile.writeExistingFile(cordova.file.dataDirectory, "records.txt",  $names + "," + file_name);
                $cordovaFile.writeFile(cordova.file.dataDirectory, file_name,  "record_" + new Date().getTime() + ",");
              }, function (error) {
                 $cordovaFile.writeFile(cordova.file.dataDirectory, "records.txt", file_name);
              });
            };
        }

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
                      if (check != "{  \"time\": " + $scope.results.time + ", \"x\": " + $scope.results.x + ",  \"y\": " + $scope.results.y + ",  \"z\": " + $scope.results.z + "}") {
                        tmp = tmp + "{  \"time\": " + $scope.results.time + ", \"x\": " + $scope.results.x + ",  \"y\": " + $scope.results.y + ",  \"z\": " + $scope.results.z + "},";
                        check = "{  \"time\": " + $scope.results.time + ", \"x\": " + $scope.results.x + ",  \"y\": " + $scope.results.y + ",  \"z\": " + $scope.results.z + "}";
                      }
            }
        });
    watch.clearWatch;

    });
})
.controller('graphicsCtrl', function ($scope, $cordovaDeviceMotion, $cordovaFile) {

  var records;

   document.addEventListener("deviceready", function () {
      $cordovaFile.readAsBinaryString(cordova.file.dataDirectory, "record.txt")
        .then(function (success) {
          alert(JSON.parse(success));
          $scope.data = {records: records};
        }, function (error) {
          alert("Impossible de récupérer les données");
        });
      });
});
