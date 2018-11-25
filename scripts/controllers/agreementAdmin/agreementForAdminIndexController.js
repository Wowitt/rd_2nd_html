'use strict';
angular.module('sbAdminApp').controller('AgreementForAdminIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.agreementForAdminIndex.agreementForAdminList");
}]);