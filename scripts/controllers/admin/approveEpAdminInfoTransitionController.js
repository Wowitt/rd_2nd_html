/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('ApproveEpAdminInfoTranstionCtrl', ['$scope','Init','$state','localStorageService','$stateParams','CheckBrowser', function ($scope,Init,$state,localStorageService,$stateParams,CheckBrowser) {
    CheckBrowser.check();
    if($stateParams.from == null || $stateParams.from == ""){
        localStorageService.set("collapse", 0);
        $state.go("dashboard.index");
        return;
    }
    //审批按钮是否显示
    $scope.approveBtnFlag = $stateParams.btnFlag;
    //管理员用户数据
    $scope.adminData = new Array();
    //单位名称
    $scope.epName = localStorageService.get("epName");
    //单位代码
    $scope.epCode = localStorageService.get("epCode");
    //单位ID
    $scope.epId = "";
    //单位类型
    $scope.epType = "";
    var bizId = $stateParams.bizId.substring(2);
    var biz = "";
    if($scope.approveBtnFlag == false){
        biz = $stateParams.applyId;
    }
    var par = {epId:"EP"+bizId, bizId:biz};
    Init.iwbhttp('/enterprise/queryAdminInfoTransition', par, function (data, header, config, status) {
        $scope.adminData = data.adminData;
    }, function (data, header, config, status) {
    });

    //返回上一页
    $scope.back = function (){
        var para = {
            bizId:$stateParams.bizId,
            applyId:$stateParams.applyId,
            btnFlag:$stateParams.btnFlag,
            from:$stateParams.oldFrom
        };
        $state.go($stateParams.from,para);
    }
}]);
