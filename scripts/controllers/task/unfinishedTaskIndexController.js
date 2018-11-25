'use strict';
angular.module('sbAdminApp').controller('UnfinishedTaskIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.unfinishedTaskIndex.unfinishedTaskList");
}]);