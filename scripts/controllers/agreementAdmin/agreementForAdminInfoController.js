/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('AgreementForAdminInfoCtrl', ['$scope','Init','$state','localStorageService','$stateParams','CheckBrowser','Modal', function ($scope,Init,$state,localStorageService,$stateParams,CheckBrowser,Modal) {
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
    //处置协议id
    var agreementId = $stateParams.agreementId;
    if(agreementId != null && !angular.equals("", agreementId)){
        $scope.AM_ID = agreementId;
        //查询协议
        Init.iwbhttp('/agreement/queryAgreement', {"AM_ID":agreementId}, function (data, header, config, status) {
            $scope.UNIT_NUM = data.UNIT_NUM;
            $scope.BEGINTIME = data.BEGINTIME;
            $scope.ENDTIME = data.ENDTIME;
            $scope.LINKMAN = data.LINKMAN;
            $scope.LINKTEL = data.LINKTEL;
            $scope.LINKPHONE = data.LINKPHONE;
            $scope.EN_ID_CZ = data.EN_ID_CZ;
            $scope.EN_ID_ZZ = data.EN_ID_ZZ;
            $scope.EN_NAME_CZ = data.EN_NAME_CZ;
            $scope.EN_NAME_ZZ = data.EN_NAME_ZZ;
            if(data.REASON != null && data.REASON != ""){
                $scope.reasonFlag = true;
                $scope.REASON = data.REASON;
            }
        }, function (data, header, config, status) {
        });
    }

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
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
