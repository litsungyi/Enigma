// Ref: http://stackoverflow.com/questions/521295/javascript-random-seeds
Math.seed = function(s) {
    return function() {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    };
};

var enigmaApp = angular.module('EnigmaApp', []);
enigmaApp.controller('EnigmaController', ['$scope', function ($scope) {
  $scope.date = "";
  $scope.rotor1 = "#1";
  $scope.rotor2 = "#2";
  $scope.rotor3 = "#3";
  $scope.rotorKey1 = "A";
  $scope.rotorKey2 = "B";
  $scope.rotorKey3 = "C";
  $scope.reset = function() {
      var seed = Date.parse( $scope.date);
      var random = Math.seed( seed );
      var rotors = RandomSort( random );
      $scope.rotor1 = "#" + rotors[0];
      $scope.rotor2 = "#" + rotors[1];
      $scope.rotor3 = "#" + rotors[2];
      $scope.rotorKey1 = String.fromCharCode( Math.floor( random() * 26 ) + "A".charCodeAt(0));
      $scope.rotorKey2 = String.fromCharCode( Math.floor( random() * 26 ) + "A".charCodeAt(0));
      $scope.rotorKey3 = String.fromCharCode( Math.floor( random() * 26 ) + "A".charCodeAt(0));
  };
}]);

function RandomSort( random )
{
    var rotors = [1, 2, 3];
    for (var i = 0; i < 3; ++i) {
      var random1 = Math.floor( random() * 3 );
      var random2 = Math.floor( random() * 3 );
      var temp = rotors[ random1 ];
      rotors[ random1 ] = rotors[ random2 ];
      rotors[ random2 ] = temp;
    }
    
    return rotors;
}
