'use strict';
angular.module('sbAdminApp').controller('AgreementIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.agreementIndex.agreementList");
}]);