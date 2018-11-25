'use strict';
angular.module('sbAdminApp').controller('TransferRunningIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.transferRunningIndex.transferRunningList");
}]);