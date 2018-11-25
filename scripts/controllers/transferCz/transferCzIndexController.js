'use strict';
angular.module('sbAdminApp').controller('TransferCzIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.transferCzIndex.transferCzList");
}]);