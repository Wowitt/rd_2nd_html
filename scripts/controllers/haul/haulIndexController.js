'use strict';
angular.module('sbAdminApp').controller('HaulIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.haulIndex.haulList");
}]);