// Ref: http://stackoverflow.com/questions/521295/javascript-random-seeds
Math.seed = function (s) {
    return function () {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    };
};

var chA = "A".charCodeAt(0);
var enigmaApp = angular.module('EnigmaApp', []);
enigmaApp.controller('EnigmaController', ['$scope', '$log', function ($scope, $log) {
    $scope.$log = $log;
    $scope.date = new Date();
    $scope.rotor = [];
    $scope.rotorKey = [];
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
        $scope.rotorTrans[0] = MakeRotor(initRandom);
        $scope.rotorTrans[1] = MakeRotor(initRandom);
        $scope.rotorTrans[2] = MakeRotor(initRandom);
        $scope.reflector = MakeReflector(initRandom);
        $scope.key = MakeKey(initRandom);

        var date = Date.parse($scope.date);
        if (isNaN(date)) {
            $scope.date = new Date();
            date = Date.parse($scope.date);
        }
        var year = $scope.date.getFullYear();
        var month = $scope.date.getMonth() + 1;
        var day = $scope.date.getDate();
        var seed = year * 10000 + month * 100 + day;

        var random = Math.seed(seed);
        $scope.rotor = RandomSort(random);
        $scope.rotorKey[0] = IndexToChar(Math.floor(random() * 26));
        $scope.rotorKey[1] = IndexToChar(Math.floor(random() * 26));
        $scope.rotorKey[2] = IndexToChar(Math.floor(random() * 26));
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

        var code = $scope.encodeKey();
        $scope.message = $scope.message.toUpperCase();
        for (var i = 0; i < $scope.message.length; ++i) {
            var ch = $scope.message[i];
            if (!/^[A-Z]+$/i.test(ch)) {
                code += " ";
                continue;
            }

            $log.log("===encode===");
            code += $scope.process(ch);
        }

        $scope.code = code;
    };
    $scope.decode = function () {
        $scope.reset();

        var message = "";
        $scope.key = "";
        $scope.code = $scope.code.toUpperCase();
        var key = "";
        var keyRead = 0;
        for (var i = 0; i < $scope.code.length; ++i) {
            var ch = $scope.code[i];
            if (!/^[A-Z]+$/i.test(ch)) {
                message += " ";
                continue;
            }

            $log.log("decode=========");
            ch = $scope.process(ch);

            if (keyRead < 6) {
                key += ch;
                ++keyRead;

                if (keyRead == 6) {
                    $scope.rotorKey[0] = key[0];
                    $scope.rotorKey[1] = key[1];
                    $scope.rotorKey[2] = key[2];

                    if (key[0] != key[3] || key[1] != key[4] || key[2] != key[5]) {
                        alert("[ERROR] Key not match: " + key);
                    }
                }

                continue;
            }

            message += ch;
        }

        $scope.message = message;
    };
    $scope.test = function () {
        $scope.reset();

        $log.log( "Plugboard ================================");
        for (var i = 0; i < 26; ++i) {
            var chFrom1 = IndexToChar(i);
            var chTo1 = $scope.transformPlugboard(chFrom1);
            var chBack1 = $scope.transformPlugboard(chTo1);

            if (chFrom1 != chBack1) {
                $log.log( chFrom1 + " >> " + chTo1 + " >> " + chBack1);
            }
        }
        
        $log.log( "Reflector ================================");
        for (var j = 0; j < 26; ++j) {
            var chFrom2 = IndexToChar(j);
            var chTo2 = $scope.transformReflector(chFrom2);
            var chBack2 = $scope.transformReflector(chTo2);

            if (chFrom2 != chBack2) {
                $log.log( chFrom2 + " >> " + chTo2 + " >> " + chBack2);
            }
        }

        $log.log( "RotorA ================================");
        for (var k = 0; k < 26; ++k) {
            var chFrom3 = IndexToChar(k);
            var chTo3 = $scope.transformRotor($scope.rotorTrans[0], "A", chFrom3, false);
            var chBack3 = $scope.transformRotor($scope.rotorTrans[0], "A", chTo3, true);

            if (chFrom3 != chBack3) {
                $log.log( chFrom3 + " >> " + chTo3 + " >> " + chBack3);
            }
        }
        
        $log.log( "RotorB ================================");
        for (var l = 0; l < 26; ++l) {
            var chFrom4 = IndexToChar(l);
            var chTo4 = $scope.transformRotor($scope.rotorTrans[0], "B", chFrom4, false);
            var chBack4 = $scope.transformRotor($scope.rotorTrans[0], "B", chTo4, true);

            if (chFrom4 != chBack4) {
                $log.log( chFrom4 + " >> " + chTo4 + " >> " + chBack4);
            }
        }
        alert("Rotor Test Done!");
    };
    $scope.encodeKey = function () {
        var key = $scope.key.toUpperCase();
        var code = "";
        for (var j = 0; j < 2; ++j) {
            for (var i = 0; i < key.length; ++i) {
                var ch = key[i];
                if (!/^[A-Z]+$/i.test(ch)) {
                    continue;
                }

                $log.log("encodeKey=========");
                code += $scope.process(ch);
            }
        }

        $scope.rotorKey[0] = key[0];
        $scope.rotorKey[1] = key[1];
        $scope.rotorKey[2] = key[2];
        return code;
    };
    $scope.decodeKey = function () {
        var key = $scope.key.toUpperCase();
        var code = key;
        for (var j = 0; j < 2; ++j) {
            for (var i = 0; i < key.length; ++i) {
                var ch = key[i];
                if (!/^[A-Z]+$/i.test(ch)) {
                    continue;
                }

                $log.log("decodeKey=========");
                code += $scope.process(ch);
            }
        }

        $scope.rotorKey[0] = key[0];
        $scope.rotorKey[1] = key[1];
        $scope.rotorKey[2] = key[2];
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
    $scope.transformRotor = function (rotor, key, ch, revert) {
        var offset = revert ? 0 : CharToIndex(key);
        var index = (CharToIndex(ch) + offset + 26) % 26;
        var alpha = IndexToChar(index);
        var newIndex = index + ( revert ? rotor[alpha].revertOffset : rotor[alpha].offset );
        newIndex = ( newIndex + 26 ) % 26;
        offset = revert ? -CharToIndex(key) : 0;
        newIndex = revert ? ( newIndex + offset + 26 ) % 26  : newIndex;
        return IndexToChar( newIndex );
    };
    $scope.transformReflector = function (ch) {
        return $scope.reflector[ch];
    };
    $scope.advanceRotor = function () {
        var next = CharToIndex( $scope.rotorKey[0]) + 1;
        if (next < 26) {
            $scope.rotorKey[0] = IndexToChar(next);
            return;
        }

        next = 0;
        $scope.rotorKey[0] = IndexToChar(next);

        next = CharToIndex( $scope.rotorKey[1] ) + 1;
        if (next < 26) {
            $scope.rotorKey[1] = IndexToChar(next);
            return;
        }

        next = 0;
        $scope.rotorKey[1] = IndexToChar(next);

        next = CharToIndex( $scope.rotorKey[2] ) + 1;
        if (next < 26) {
            $scope.rotorKey[2] = IndexToChar(next);
            return;
        }

        next = 0;
        $scope.rotorKey[2] = IndexToChar(next);
    };
    $scope.process = function (ch) {
        $log.log("$scope.rotorKey: " + $scope.rotorKey[0] + $scope.rotorKey[1] + $scope.rotorKey[2]);
        $log.log("ch: " + ch);
        ch = $scope.transformPlugboard(ch);
        $log.log("transformPlugboard: " + ch);
        ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor[0]], $scope.rotorKey[0], ch, false);
        $log.log("transformRotor1: " + ch);
        ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor[1]], $scope.rotorKey[1], ch, false);
        $log.log("transformRotor2: " + ch);
        ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor[2]], $scope.rotorKey[2], ch, false);
        $log.log("transformRotor3: " + ch);
        ch = $scope.transformReflector(ch);
        $log.log("transformReflector: " + ch);
        ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor[2]], $scope.rotorKey[2], ch, true);
        $log.log("transformRotor3: " + ch);
        ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor[1]], $scope.rotorKey[1], ch, true);
        $log.log("transformRotor2: " + ch);
        ch = $scope.transformRotor($scope.rotorTrans[$scope.rotor[0]], $scope.rotorKey[0], ch, true);
        $log.log("transformRotor1: " + ch);
        ch = $scope.transformPlugboard(ch);
        $log.log("transformPlugboard: " + ch);
        $scope.advanceRotor();
        return ch;
    };
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
    var keys1 = RandomSortAZ(random);
    var keys2 = RandomSortAZ(random);
    var offsets = {};
    var revertOffsets = {};
    for (var count = 0; count < 26; ++count) {
        var key1 = keys1[count];
        var index1 = CharToIndex(key1);
        var key2 = keys2[count];
        var index2 = CharToIndex(key2);
        
        offsets[key1] = index2-index1;
        revertOffsets[key2] = index1-index2;
    }

    var rotor = {};
    for (var index = 0; index < 26; ++index) {
        var key = IndexToChar(index);
        rotor[ key ] = {
            offset: offsets[key],
            revertOffset: revertOffsets[key]
        };
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

function CharToIndex(ch) {
    return ch.charCodeAt(0) - chA;
}

function IndexToChar(index) {
    return String.fromCharCode(index + chA);
}
