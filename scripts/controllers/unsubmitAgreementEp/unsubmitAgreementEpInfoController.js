/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('UnsubmitAgreementEpInfoCtrl', ['$scope','Init','$state','localStorageService','$stateParams','CheckBrowser', function ($scope,Init,$state,localStorageService,$stateParams,CheckBrowser) {
    CheckBrowser.check();
    if($stateParams.from == null || $stateParams.from == ""){
        localStorageService.set("collapse", 0);
        $state.go("dashboard.index");
        return;
    }
    $scope.epNameCs = $stateParams.epNameCs;
    $scope.epNameCz = $stateParams.epNameCz;

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    //处置协议id
    Init.iwbhttp('/transfer/queryBill', {"TB_ID":$stateParams.TB_ID}, function (data, header, config, status) {
        $scope.connectName = data.bill.CS_PERSON_NAME;
        $scope.epName = data.bill.EN_NAME_CS;
        $scope.totalNum = data.bill.COUNT;
        $scope.boxIds = data.bill.boxList;
    }, function (data, header, config, status) {
    });

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
    }

}]);
