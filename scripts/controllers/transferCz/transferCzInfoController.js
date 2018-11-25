/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('TransferCzInfoCtrl', ['$scope','Init','Modal','$state','localStorageService','$stateParams','CheckBrowser', function ($scope,Init,Modal,$state,localStorageService,$stateParams,CheckBrowser) {
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

    //申请转移id
    $scope.WC_ID = $stateParams.WC_ID;
    $scope.btnFlag = $stateParams.btnFlag;
    if($stateParams.STATUS == "交接完成"){
        $("#dealBtn").attr("disabled",true);
    }

    Init.iwbhttp('/conduitTransfer/queryTransferConduitInfo', {"WC_ID":$scope.WC_ID}, function (data, header, config, status) {
        $scope.EP_SMALL_NAME =  data.EP_SMALL_NAME;
        $scope.TBDATE =  data.TBDATE;
        $scope.UNIT_NUM =  data.UNIT_NUM;
        $scope.UNIT =  "  "+data.UNIT;
        $scope.CONTENT =  data.CONTENT;
        $scope.M_PERSON_NAME =  data.M_PERSON_NAME;
        $scope.EP_BIG_NAME =  data.EP_BIG_NAME;
        $scope.PERSON_NAME =  data.PERSON_NAME;
    }, function (data, header, config, status) {
    });

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
    }

    //交接方法
    $scope.deal = function () {
        var par = {
            "transferEpId": localStorageService.get("epId"),
            "WC_ID": $scope.WC_ID,
            "PERSON_ID": localStorageService.get("userId"),
            "PERSON_NAME": localStorageService.get("nickName")
        };
        Init.iwbhttp('/conduitTransfer/dealTransferConduitInfo', par, function (data, header, config, status) {
            $scope.open(data.msg);
            if(angular.equals("0",data.resFlag)){
                $("#dealBtn").attr("disabled",true);
            }
        }, function (data, header, config, status) {
        });
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
}]);
