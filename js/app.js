'use strict';

var builder = angular.module("machine", []);

builder.controller("machine.main", ['$scope', function ($scope) {

  $scope.states = null;
  $scope.sequence = "";
  $scope.result = "";
  $scope.runLog = [];
  $scope.finalState = null;
  $scope.message = null;

  $scope.newState = {
    direction: 'right'
  };

  $scope.directions = {
    'left': 'Left',
    'right': 'Right',
    'stop': 'Stop'
  };

  $scope.startOver = function() {
    __reset();
    $scope.states = null;
  }

  $scope.addState = function () {
    if ($scope.states == null) {
      $scope.states = [];
    }

    $scope.states.push(angular.copy($scope.newState));

    $scope.newState = {
      direction: 'right'
    };
  };

  $scope.run = function () {
    __reset();
    $scope.machineRunCompleted = false;

    if ($scope.states != null) {
      var initialChar = $scope.sequence.charAt(0);

      for (var state of $scope.states) {
        if (state.name == "initial" && state.reads == initialChar) {
          $scope.result = $scope.sequence;

          $scope.finalState = __readSequence(0, state);

          $scope.machineRunCompleted = true;
          break;
        }
      }

      if (!$scope.machineRunCompleted) {
        __setMessage("error", "No initial state that begins reading the given input sequence was defined.");
      } else {
        __setMessage("success", "The machine has successfully started and reached a stop point.");
      }
    } else {
      __setMessage("error", "There are no states on the machine.");
    }

    $scope.runLog.reverse();
    $scope.original = angular.copy($scope.sequence);
  };

  var __setMessage = function(type, text) {
    $scope.message = {
      type: type,
      text: text
    };
  };

  var __reset = function () {
    $scope.newState = {
      direction: 'right'
    };

    $scope.runLog = [];
    $scope.message = null;
  };

  var __readSequence = function (index, state) {
    var returnState = state;
    var toLog = "State '" + state.name + "' read '" + state.reads + "'.";

    if (state.direction != "stop") {
      $scope.result = __setCharAt($scope.result, index, state.writes);
      toLog += " Replaced with '" + state.writes + "'.";

      index = index + (state.direction == 'left' ? -1 : 1);
      var nextChar = (index < 0 || index > ($scope.sequence.length - 1))
          ? " " : $scope.result.charAt(index);

      for (var newState of $scope.states) {
        if (newState.name == state.becomes && newState.reads == nextChar) {
          toLog += " Moved to state '" + newState.name + "'.";
          returnState = __readSequence(index, newState);
          break;
        }
      }
    } else {
      toLog += " Next state: '" + state.becomes + "'. Stopping.";
    }

    $scope.runLog.push(toLog);
    return returnState;
  };

  var __setCharAt = function (str, index, character) {
    return str.substr(0, index) + character + str.substr(index + character.length)
  };

}]);