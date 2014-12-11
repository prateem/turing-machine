'use strict';

var builder = angular.module("machine", []);

builder.controller("machine.main", ['$scope', function ($scope) {

  $scope.states = null;
  $scope.sequence = "";
  $scope.modifiedSequence = "";
  $scope.originalSequence = "";
  $scope.runLog = [];
  $scope.message = null;
  $scope.machineRunCompleted = false;

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
          $scope.modifiedSequence = angular.copy($scope.sequence);

          __readSequence(0, state);

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
    $scope.originalSequence = angular.copy($scope.sequence);
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
    var toLog = "State '" + state.name + "' read '" + state.reads + "'.";

    if (state.direction != "stop") {
      $scope.modifiedSequence = __setCharAt($scope.modifiedSequence, index, state.writes);
      toLog += " Replaced with '" + state.writes + "'.";

      index = index + (state.direction == 'left' ? -1 : 1);
      var nextChar = (index < 0 || index > ($scope.modifiedSequence.length - 1))
          ? " " : $scope.modifiedSequence.charAt(index);

      for (var newState of $scope.states) {
        if (newState.name == state.becomes && newState.reads == nextChar) {
          toLog += " Moved to state '" + newState.name + "'.";
          __readSequence(index, newState);
          break;
        }
      }
    } else {
      toLog += " Next state: '" + state.becomes + "'. Stopping.";
    }

    $scope.runLog.push(toLog);
  };

  var __setCharAt = function (str, index, character) {
    if (index >= str.length) {
      return str + character;
    } else if (index < 0) {
      return character + str;
    } else {
      return str.substr(0, index) + character + str.substr(index + character.length)
    }
  };

}]);