'use strict';
angular.module('sbAdminApp').controller('FinishedTaskIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.finishedTaskIndex.finishedTaskList");
}]);