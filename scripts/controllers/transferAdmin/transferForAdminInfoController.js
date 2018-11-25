/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('TransferForAdminInfoCtrl', ['$scope','Init','Modal','$state','localStorageService','$stateParams','CheckBrowser', function ($scope,Init,Modal,$state,localStorageService,$stateParams,CheckBrowser) {
    CheckBrowser.check();
    if($stateParams.from == null || $stateParams.from == ""){
        localStorageService.set("collapse", 0);
        $state.go("dashboard.index");
        return;
    }

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    //转移计划id
    var transferId = $stateParams.transferId;
    //申请表id
    $scope.APPLY_ID = "";
    $scope.TP_ID = transferId;
    //查询转移计划
    Init.iwbhttp('/plan/queryPlan', {TP_ID:$scope.TP_ID}, function (data, header, config, status) {
        $scope.AM_ID = data.AM_ID;
        $scope.UNIT_NUM = data.UNIT_NUM;
        $scope.BEGINTIME = data.BEGINTIME;
        $scope.ENDTIME = data.ENDTIME;
        $scope.LINKMAN = data.LINKMAN;
        $scope.LINKTEL = data.LINKTEL;
        $scope.LINKPHONE = data.LINKPHONE;
        $scope.EN_ID_CZ = data.EN_ID_CZ;
        $scope.EN_ID_ZZ = data.EN_ID_ZZ;
        $scope.EN_ID_CS = data.EN_ID_CS;
        $scope.EN_NAME_CS = data.EN_NAME_CS;
        $scope.EN_NAME_CZ = data.EN_NAME_CZ;
        $scope.EN_NAME_ZZ = data.EN_NAME_ZZ;
        $scope.APPLY_ID = data.APPLY_ID;
    }, function (data, header, config, status) {
    });

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
    }

}]);
