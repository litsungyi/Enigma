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
    $scope.reflector = {};
    $scope.key = "";
    $scope.message = "HELLO";
    $scope.code = "";
    $scope.reset = function () {
        var initRandom = Math.seed(42);
        $scope.rotorTrans[1] = [];
        $scope.rotorTrans[1] = MakeRotor(initRandom);
        $scope.rotorTrans[2] = MakeRotor(initRandom);
        $scope.rotorTrans[3] = MakeRotor(initRandom);
        $scope.reflector = MakeReflector(initRandom);
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

        var code = $scope.transformKey();
        $scope.message = $scope.message.toUpperCase();
        for (var i = 0; i < $scope.message.length; ++i) {
            var ch = $scope.message[i];
            if (!/^[A-Z]+$/i.test(ch)) {
                code += " ";
                continue;
            }

            ch = $scope.transformPlugboard(ch);
            ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor1], $scope.rotorKey1, ch);
            ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor2], $scope.rotorKey2, ch);
            ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor3], $scope.rotorKey3, ch);
            ch = $scope.transformReflector(ch);
            ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor3], $scope.rotorKey3, ch);
            ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor2], $scope.rotorKey2, ch);
            ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor1], $scope.rotorKey1, ch);
            $scope.advanceRotor();

            code += ch;
        }

        $scope.code = code;
    };
    $scope.decode = function () {
        $scope.reset();
        
        var message = "";
        var key2 = "";
        $scope.key = "";
        $scope.code = $scope.code.toUpperCase();
        var keyRead = 0;
        var keyRead2 = 0;
        for (var i = 0; i < $scope.code.length; ++i) {
            var ch = $scope.code[i];
            if (!/^[A-Z]+$/i.test(ch)) {
                message += " ";
                continue;
            }
            
            if ( keyRead < 3 )
            {
                $scope.key += ch;
                ++ keyRead;
                
                if ( keyRead == 3 )
                {
                    $scope.rotorKey1 = $scope.key[0];
                    $scope.rotorKey2 = $scope.key[1];
                    $scope.rotorKey3 = $scope.key[2];
                }
                continue;
            }
            
            ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor1], $scope.rotorKey1, ch);
            ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor2], $scope.rotorKey2, ch);
            ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor3], $scope.rotorKey3, ch);
            ch = $scope.transformReflector(ch);
            ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor3], $scope.rotorKey3, ch);
            ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor2], $scope.rotorKey2, ch);
            ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor1], $scope.rotorKey1, ch);
            ch = $scope.transformPlugboard(ch);
            $scope.advanceRotor();

            if ( keyRead2 < 6 )
            {
                key2 += ch;
                ++ keyRead2;
                
                if ( keyRead2 == 6 )
                {
                    $scope.rotorKey1 = key2[0];
                    $scope.rotorKey2 = key2[1];
                    $scope.rotorKey3 = key2[2];
                }
            }
            else
            {
                message += ch;
            }
        }

        $scope.message = message;
    };
    $scope.transformKey = function () {
        var key = $scope.key.toUpperCase();
        var code = key + " ";
        for ( var j = 0; j < 2; ++j) {
            for (var i = 0; i < key.length; ++i) {
                var ch = key[i];
                if (!/^[A-Z]+$/i.test(ch)) {
                    continue;
                }
    
                ch = $scope.transformPlugboard(ch);
                ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor1], $scope.rotorKey1, ch);
                ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor2], $scope.rotorKey2, ch);
                ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor3], $scope.rotorKey3, ch);
                ch = $scope.transformReflector(ch);
                ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor3], $scope.rotorKey3, ch);
                ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor2], $scope.rotorKey2, ch);
                ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor1], $scope.rotorKey1, ch);
                $scope.advanceRotor();
    
                code += ch;
            }
        }
        
        $scope.rotorKey1 = key[0];
        $scope.rotorKey2 = key[1];
        $scope.rotorKey3 = key[2];
        return code + " ";
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
    $scope.transformRotor = function (rotor, key, ch) {
        var offset = key.charCodeAt(0) - chA;
        var index = ( ch.charCodeAt(0) - chA + offset ) % 26;
        var alpha = String.fromCharCode( index + chA );
        return rotor[alpha];
    };
    $scope.transformReflector = function(ch) {
        return  $scope.reflector[ch];
    };
    $scope.advanceRotor = function () {
        var next = $scope.rotorKey1.charCodeAt(0) - chA + 1;
        if ( next < 26 )
        {
            $scope.rotorKey1 = String.fromCharCode( next + chA );
            return;
        }
            
        next = 0;
        $scope.rotorKey1 = String.fromCharCode( next + chA );
        
        next = $scope.rotorKey2.charCodeAt(0) - chA + 1;
        if ( next < 26 )
        {
            $scope.rotorKey2 = String.fromCharCode( next + chA );
            return;
        }
        
        next = 0;
        $scope.rotorKey2 = String.fromCharCode( next + chA );
        
        next = $scope.rotorKey3.charCodeAt(0) - chA + 1;
        if ( next < 26 )
        {
            $scope.rotorKey3 = String.fromCharCode( next + chA );
            return;
        }
        
        next = 0;
        $scope.rotorKey3 = String.fromCharCode( next + chA );
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

function MakeReflector(random) {
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
