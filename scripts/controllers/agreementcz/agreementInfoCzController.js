/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('AgreementInfoCzCtrl', ['$scope','Init','$state','localStorageService','$stateParams','CheckBrowser','Modal', function ($scope,Init,$state,localStorageService,$stateParams,CheckBrowser,Modal) {
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
            if(data.STATUS == '3' || data.STATUS == '4'){
                $("#agreeBtn").attr("disabled",true);
                $("#disagreeBtn").attr("disabled",true);
            }
        }, function (data, header, config, status) {
        });
    }

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
    }

    //同意
    $scope.agree = function () {
        var par = {
            AM_ID:agreementId,
            EN_ID_CZ:$scope.EN_ID_CZ,
            EN_ID_ZZ:$scope.EN_ID_ZZ,
            UNIT_NUM:$scope.UNIT_NUM,
            BEGINTIME:$scope.BEGINTIME,
            ENDTIME:$scope.ENDTIME,
            REASON:""
        }
        Init.iwbhttp('/agreement/agree', par, function (data, header, config, status) {
            $scope.open(data.msg);
            if(angular.equals("0",data.resFlag)){
                $("#agreeBtn").attr("disabled",true);
                $("#disagreeBtn").attr("disabled",true);
            }
        }, function (data, header, config, status) {
        });
    }

    //驳回
    $scope.disagree = function () {
        //modal提示框标题
        var content = "原因";
        var parm = {"AM_ID": $stateParams.agreementId, "httpUrl":"/agreement/reject"};
        url = 'views/dashboard/admin/approveDisagreeModal.html';
        ctrlName = 'DisagreeModalCtrl';
        resolve = {
            content: function () {
                return content;
            },
            parm: function () {
                return parm;
            }
        };
        var modalInstance = Modal.modal(url, ctrlName, resolve, function (result) {
            if(angular.equals("succeed",result)){
                $("#agreeBtn").attr("disabled",true);
                $("#disagreeBtn").attr("disabled",true);
            }
        }, function () {

        });
        /*var modalInstance = $modal.open({
            templateUrl: 'views/dashboard/admin/approveDisagreeModal.html',
            controller: 'DisagreeModalCtrl',
            resolve: {
                content: function () {
                    return content;
                },
                parm: function () {
                    return parm;
                }
            }
        });
        modalInstance.result.then(function (result) {
            $log.info('result : ' + result);
            if(angular.equals("succeed",result)){
                $("#agreeBtn").attr("disabled",true);
                $("#disagreeBtn").attr("disabled",true);
            }
            $log.info('success : ' + content);
        }, function () {
            $log.info('error : ' + new Date());
        });*/
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
