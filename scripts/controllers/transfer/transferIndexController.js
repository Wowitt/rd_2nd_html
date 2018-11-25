'use strict';
angular.module('sbAdminApp').controller('TransferIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.transferIndex.transferList");
}]);