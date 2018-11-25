'use strict';
angular.module('sbAdminApp').controller('UnsubmitAgreementEpIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.unsubmitAgreementEpIndex.unsubmitAgreementEpList");
}]);