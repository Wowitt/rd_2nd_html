'use strict';
angular.module('sbAdminApp').controller('BillCsIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.billCsIndex.billCsList");
}]);