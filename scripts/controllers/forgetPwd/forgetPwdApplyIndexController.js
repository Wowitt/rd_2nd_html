'use strict';
angular.module('sbAdminApp').controller('ForgetPwdApplyIndexCtrl', ['$state', function ($state) {
    $state.go("dashboard.forgetPwdApplyIndex.forgetPwdApplyList");
}]);