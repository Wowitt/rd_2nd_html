/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('BillInfoCtrl', ['$scope','Init','Modal','$state','localStorageService','$stateParams','CheckBrowser', function ($scope,Init,Modal,$state,localStorageService,$stateParams,CheckBrowser) {
    CheckBrowser.check();
    if($stateParams.from == null || $stateParams.from == ""){
        localStorageService.set("collapse", 0);
        $state.go("dashboard.index");
        return;
    }
    $scope.userType = "";
    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";
    //处置协议id
    Init.iwbhttp('/transfer/queryBill', {"TB_ID":$stateParams.TB_ID}, function (data, header, config, status) {
        $scope.connectName = data.bill.CS_PERSON_NAME;
        $scope.epName = data.bill.EN_NAME_CS;
        $scope.driverName = data.bill.CZ_DRIVER_NAME;
        $scope.epCzName = data.bill.EN_NAME_CZ;
        $scope.totalNum = data.bill.COUNT;
        $scope.boxIds = data.bill.boxList;
        $scope.userType = data.userType
        if($scope.boxIds != null && $scope.boxIds.length > 0){
            $scope.boxFlag = true;
        }
        $scope.weight = data.bill.weight;
        $scope.weightstatus = data.bill.weightstatus;
        if($scope.weight > 0){
            $scope.boxFlag = false;
        }else{
            $scope.boxFlag = true;
        }
    }, function (data, header, config, status) {
    });

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from, {TG_ID:$stateParams.TG_ID,from:"dashboard.haulIndex.haulList"});
    }

    //提示modal弹框
    $scope.open = function (content,data) {
        url = 'views/modal/promptModal.html';
        ctrlName = 'PromptModalCtrl';
        resolve = {
            content: function () {
                return content;
            },
            data: function () {
                return data;
            }
        };
        var modalInstance = Modal.modal(url, ctrlName, resolve, function () {

        }, function () {

        });
    };

    //请求后台
    $scope.doneForWeight = function (){
        Init.iwbhttp('/transfer/doneForWeight',{"TB_ID":$stateParams.TB_ID}, function (data, header, config, status) {
            if (data.resFlag == 0) {
                $scope.weightstatus = '1'
            } 
            $scope.open(data.msg);
        }, function (data, header, config, status) {
        });
    }
}]);
