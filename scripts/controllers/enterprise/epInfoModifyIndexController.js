'use strict';
angular.module('sbAdminApp').controller('EpInfoModifyIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.epInfoModifyIndex.epInfoModify");
}]);