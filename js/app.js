'use strict';

var builder = angular.module("machine", []);

builder.controller("machine.main", ['$scope', function($scope) {

  $scope.states = null;
  $scope.sequence = "";
  $scope.result = null;
  $scope.runLog = [];

  $scope.newState = {
    direction: 'right'
  };

  $scope.directions = {
    'left': 'Left',
    'right': 'Right',
    'stop': 'Stop'
  };

  $scope.addState = function() {
    if ($scope.states == null) {
      $scope.states = [];
    }

    $scope.states.push(angular.copy($scope.newState));

    $scope.newState = {
      direction: 'right'
    };
  };

  $scope.run = function() {
    var __machineRunCompleted = false;
    var index = 0;
    var initialChar = $scope.sequence.charAt(index);

    for (var state of $scope.states) {
      if (state.name == "initial" && state.reads == initialChar) {
        $scope.result = $scope.sequence;
        index = __readSequence(index, state);
        __machineRunCompleted = true;
        break;
      }
    }

    if (!__machineRunCompleted) {
      $scope.message = "No initial state that begins reading the given input sequence was defined.";
    } else {
      $scope.message = "Stopped at index " + index + ", character: " + $scope.sequence.charAt(index) + ".";
    }

    console.log($scope.message);
  };

  function __readSequence(index, state) {
    $scope.result = __setCharAt($scope.result, index, state.writes);
    
    if (index < 0 || index == ($scope.sequence.length - 1) || state.direction == "stop") {
      return index;
    }

    index = index + (state.direction == 'left' ? -1 : 1);
    var nextChar = $scope.result.charAt(index);

    for (var newState of $scope.states) {
      if (newState.name == state.becomes && newState.reads == nextChar) {
        index = __readSequence(index, newState);
        break;
      }
    }

    return index;
  };

  function __setCharAt(str, index, character) {
    return str.substr(0, index) + character + str.substr(index + character.length)
  }

}]);