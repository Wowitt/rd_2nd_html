'use strict';
angular.module('sbAdminApp').controller('RoleIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.roleIndex.roleList");
}]);