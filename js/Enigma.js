// Ref: http://stackoverflow.com/questions/521295/javascript-random-seeds
Math.seed = function (s) {
    return function () {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    };
};

var chA = "A".charCodeAt(0);
var enigmaApp = angular.module('EnigmaApp', []);
enigmaApp.controller('EnigmaController', ['$scope', function ($scope) {
    $scope.date = "";
    $scope.rotor1 = 0;
    $scope.rotor2 = 0;
    $scope.rotor3 = 0;
    $scope.rotorKey1 = "";
    $scope.rotorKey2 = "";
    $scope.rotorKey3 = "";
    $scope.plugboard1A = "";
    $scope.plugboard1B = "";
    $scope.plugboard2A = "";
    $scope.plugboard2B = "";
    $scope.plugboard3A = "";
    $scope.plugboard3B = "";
    $scope.plugboard4A = "";
    $scope.plugboard4B = "";
    $scope.plugboard5A = "";
    $scope.plugboard5B = "";
    $scope.plugboard6A = "";
    $scope.plugboard6B = "";
    $scope.rotorTrans = [];
    $scope.key = "";
    $scope.message = "HELLO";
    $scope.code = "";
    $scope.reset = function () {
        var initRandom = Math.seed(42);
        $scope.rotorTrans[1] = [];
        $scope.rotorTrans[1] = MakeRotor(initRandom);
        $scope.rotorTrans[2] = MakeRotor(initRandom);
        $scope.rotorTrans[3] = MakeRotor(initRandom);
        $scope.key = MakeKey(initRandom);

        var seed = Date.parse($scope.date);
        if (isNaN(seed)) {
            $scope.date = new Date();
            seed = Date.parse($scope.date);
        }

        var random = Math.seed(seed);
        var rotors = RandomSort(random);
        $scope.rotor1 = rotors[0] + 1;
        $scope.rotor2 = rotors[1] + 1;
        $scope.rotor3 = rotors[2] + 1;
        $scope.rotorKey1 = String.fromCharCode(Math.floor(random() * 26) + chA);
        $scope.rotorKey2 = String.fromCharCode(Math.floor(random() * 26) + chA);
        $scope.rotorKey3 = String.fromCharCode(Math.floor(random() * 26) + chA);
        var keys = RandomSortAZ(random);
        $scope.plugboard1A = keys[0];
        $scope.plugboard1B = keys[1];
        $scope.plugboard2A = keys[2];
        $scope.plugboard2B = keys[3];
        $scope.plugboard3A = keys[4];
        $scope.plugboard3B = keys[5];
        $scope.plugboard4A = keys[6];
        $scope.plugboard4B = keys[7];
        $scope.plugboard5A = keys[8];
        $scope.plugboard5B = keys[9];
        $scope.plugboard6A = keys[10];
        $scope.plugboard6B = keys[11];
    };
    $scope.encode = function () {
        $scope.reset();

        var code = transformKey();
        $scope.message = $scope.message.toUpperCase();
        for (var i = 0; i < $scope.message.length; ++i) {
            var ch = $scope.message[i];
            if (!/^[A-Z]+$/i.test(ch)) {
                continue;
            }

            ch = $scope.transformPlugboard(ch);
            ch = $scope.transformRotor($scope.rotor1, ch);
            ch = $scope.transformRotor($scope.rotor2, ch);
            ch = $scope.transformRotor($scope.rotor3, ch);
            $scope.advanceRotor();

            code += ch;
        }

        $scope.code = code;
    };
    $scope.decode = function () {
        $scope.reset();


    };
    $scope.transformKey = function () {
        var key = $scope.key.toUpperCase();
        var code = key;
        for (var i = 0; i < key.length; ++i) {
            var ch = key[i];
            if (!/^[A-Z]+$/i.test(ch)) {
                continue;
            }

            ch = $scope.transformPlugboard(ch);
            ch = $scope.transformRotor($scope.rotor1, ch);
            ch = $scope.transformRotor($scope.rotor2, ch);
            ch = $scope.transformRotor($scope.rotor3, ch);
            $scope.advanceRotor();

            code += ch;
        }

        return code;
    };
    $scope.transformPlugboard = function (ch) {
        if (ch == $scope.plugboard1A) {
            return $scope.plugboard1B;
        }
        else if (ch == $scope.plugboard1B) {
            return $scope.plugboard1A;
        }
        else if (ch == $scope.plugboard2A) {
            return $scope.plugboard2B;
        }
        else if (ch == $scope.plugboard2B) {
            return $scope.plugboard2A;
        }
        else if (ch == $scope.plugboard3A) {
            return $scope.plugboard3B;
        }
        else if (ch == $scope.plugboard3B) {
            return $scope.plugboard3A;
        }
        else if (ch == $scope.plugboard4A) {
            return $scope.plugboard4B;
        }
        else if (ch == $scope.plugboard4B) {
            return $scope.plugboard4A;
        }
        else if (ch == $scope.plugboard5A) {
            return $scope.plugboard5B;
        }
        else if (ch == $scope.plugboard5B) {
            return $scope.plugboard5A;
        }
        else if (ch == $scope.plugboard6A) {
            return $scope.plugboard6B;
        }
        else if (ch == $scope.plugboard6B) {
            return $scope.plugboard6A;
        }
        else {
            return ch;
        }
    };
    $scope.transformRotor = function (rotor, ch) {

    };
    $scope.advanceRotor = function () {

    }
}]);

function RandomSort(random) {
    var rotors = [0, 1, 2];
    for (var i = 0; i < 10; ++i) {
        var random1 = Math.floor(random() * 3);
        var random2 = Math.floor(random() * 3);
        var temp = rotors[random1];
        rotors[random1] = rotors[random2];
        rotors[random2] = temp;
    }

    return rotors;
}

function RandomSortAZ(random) {
    var keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (var i = 0; i < 50; ++i) {
        var random1 = Math.floor(random() * 26);
        var random2 = Math.floor(random() * 26);
        var temp = keys[random1];
        keys[random1] = keys[random2];
        keys[random2] = temp;
    }

    return keys;
}

function MakeRotor(random) {
    var keys = RandomSortAZ(random);
    var rotor = {};
    for (var count = 0; count < 26; count += 2) {
        var key1 = keys[count];
        var key2 = keys[count + 1];
        rotor[key1] = key2;
        rotor[key2] = key1;
    }

    return rotor;
}

function MakeKey(random) {
    var keys = RandomSortAZ(random);
    return keys[0] + keys[1] + keys[2];
}
