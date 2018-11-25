'use strict';
angular.module('sbAdminApp').controller('EpForAdminIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.epForAdminIndex.epForAdminList");
}]);