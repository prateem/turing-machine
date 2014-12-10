'use strict';

var builder = angular.module("machine", []);

builder.controller("machine.main", ['$scope', function($scope) {

  $scope.states = null;
  $scope.sequence = "";
  $scope.result = "";
  $scope.runLog = [];
  $scope.finalState = null;

  $scope.newState = {
    direction: 'right'
  };

  $scope.directions = {
    'left': 'Left',
    'right': 'Right',
    'stop': 'Stop'
  };

  $scope.reset = function() {
    $scope.newState = {
      direction: 'right'
    };

    $scope.states = null;
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
    var initialChar = $scope.sequence.charAt(0);

    for (var state of $scope.states) {
      if (state.name == "initial" && state.reads == initialChar) {
        $scope.result = $scope.sequence;

        $scope.finalState = (state.direction != "stop")
            ? __readSequence(0, state) : state;

        __machineRunCompleted = true;
        break;
      }
    }

    if (!__machineRunCompleted) {
      $scope.message = "No initial state that begins reading the given input sequence was defined.";
    } else {
      $scope.message = finalState;
    }

    console.log($scope.message);
  };

  var __readSequence = function(index, state) {
    var returnState = state;

    if (state.direction != "stop") {
      
      $scope.result = __setCharAt($scope.result, index, state.writes);

      index = index + (state.direction == 'left' ? -1 : 1);
      var nextChar = (index < 0 || index > ($scope.sequence.length - 1))
          ? " " : $scope.result.charAt(index);

      for (var newState of $scope.states) {
        if (newState.name == state.becomes && newState.reads == nextChar) {
          returnState = __readSequence(index, newState);
          break;
        }
      }
    }

    return returnState;
  };

  var __setCharAt = function(str, index, character) {
    return str.substr(0, index) + character + str.substr(index + character.length)
  };

}]);