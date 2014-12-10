'use strict';

var builder = angular.module("machine", []);

builder.controller("machine.main", ['$scope', function($scope) {

  $scope.states = null;
  $scope.sequence = "";
  $scope.result = "";
  $scope.runLog = [];

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
        var finalState = state;
        $scope.result = $scope.sequence;

        if (state.direction != "stop") {
          finalState = __readSequence(0, state);
        }

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

  $scope.save = function() {
    var uuid = __guid();

    var a = btoa(JSON.stringify($scope.states));
    console.log(a);
    console.log(JSON.parse(atob(a)));

    console.log(uuid);
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

  /** From StackOverflow:
      http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/105074#105074
  */
  var __guid = (function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    }
    return function() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    };
  })();

}]);