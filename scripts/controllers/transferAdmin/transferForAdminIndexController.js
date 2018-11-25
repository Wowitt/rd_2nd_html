'use strict';
angular.module('sbAdminApp').controller('TransferForAdminIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.transferForAdminIndex.transferForAdminList");
}]);