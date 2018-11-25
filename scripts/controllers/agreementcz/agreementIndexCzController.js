'use strict';
angular.module('sbAdminApp').controller('AgreementIndexCzCtrl', ['$scope','$stateParams','$state','$rootScope', function ($scope,$stateParams,$state,$rootScope) {
    $state.go("dashboard.agreementIndexCz.agreementListCz");
}]);