/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('ApproveTransferRunningInfoCtrl', ['$scope','Init','$state','localStorageService','$stateParams','CheckBrowser','Modal', function ($scope,Init,$state,localStorageService,$stateParams,CheckBrowser,Modal) {
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
    //审批按钮是否显示
    $scope.approveBtnFlag = $stateParams.btnFlag;
    //申请id
    var applyId = $stateParams.applyId;
    var bizId = $stateParams.bizId;
    Init.iwbhttp('/admin/checkApplyInfo', {bizId:bizId}, function (data, header, config, status) {
        var applyInfo = data.applyInfo;
        $scope.TP_ID = applyInfo.TP_ID;
        $scope.TP_ID_OLD = applyInfo.TP_ID;
        $scope.AM_ID = applyInfo.AM_ID;
        $scope.UNIT_NUM = applyInfo.UNIT_NUM;
        $scope.BEGINTIME = applyInfo.BEGINTIME;
        $scope.ENDTIME = applyInfo.ENDTIME;
        $scope.LINKMAN = applyInfo.LINKMAN;
        $scope.LINKTEL = applyInfo.LINKTEL;
        $scope.LINKPHONE = applyInfo.LINKPHONE;
        $scope.EN_ID_CZ = applyInfo.EN_ID_CZ;
        $scope.EN_ID_ZZ = applyInfo.EN_ID_ZZ;
        $scope.EN_ID_CS = applyInfo.EN_ID_CS;
        $scope.EN_NAME_CS = applyInfo.EN_NAME_CS;
        $scope.EN_NAME_CZ = applyInfo.EN_NAME_CZ;
        $scope.EN_NAME_ZZ = applyInfo.EN_NAME_ZZ;
        $scope.APPLY_ID = applyInfo.APPLY_ID;

        $scope.AM_ID_OLD = applyInfo.AM_ID;
        $scope.UNIT_NUM_OLD = applyInfo.UNIT_NUM;
        $scope.BEGINTIME_OLD = applyInfo.BEGINTIME;
        $scope.ENDTIME_OLD = applyInfo.ENDTIME;
        $scope.LINKMAN_OLD = applyInfo.LINKMAN;
        $scope.LINKTEL_OLD = applyInfo.LINKTEL;
        $scope.LINKPHONE_OLD = applyInfo.LINKPHONE;
        $scope.EN_NAME_CZ_OLD = applyInfo.EN_NAME_CZ;
        $scope.EN_NAME_ZZ_OLD = applyInfo.EN_NAME_ZZ_OLD;
    }, function (data, header, config, status) {
    });

    //同意
    $scope.agree = function () {
        //业务等级（sjsp-市级审批，qjsp-市级审批）
        var bizstep = "";
        if(angular.equals("SHB",localStorageService.get("orgCode"))){
            bizstep = "sjsp";
        }else{
            bizstep = "qjsp";
        }
        var par = {
            epId:$scope.EN_ID_CS,
            epName:$scope.EN_NAME_CS,
            bizId:$stateParams.bizId,
            TP_ID:$stateParams.bizId,
            bizName:"医疗废物转移计划",
            bizStep:bizstep,
            checkResult:"01",
            checkAdvice:"",
            btoId:localStorageService.get("btoId"),
            btoName:localStorageService.get("btoName"),
            btofId:localStorageService.get("btofId"),
            btofName:localStorageService.get("btofName"),
            applyId:$stateParams.applyId
        };
        Init.iwbhttp('/admin/adminDealTask', {approveInfo:par}, function (data, header, config, status) {
            $scope.open(data.msg);
            if(data.resFlag == "0"){
                $("#agreeBtn").attr("disabled",true);
                $("#disagreeBtn").attr("disabled",true);
            }
        }, function (data, header, config, status) {
        });
    };

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
    }

    //驳回
    $scope.disagree = function () {
        //业务等级（sjsp-市级审批，qjsp-市级审批）
        var bizstep = "";
        if(angular.equals("SHB",localStorageService.get("orgCode"))){
            bizstep = "sjsp";
        }else{
            bizstep = "qjsp";
        }
        var content = "原因";
        var parm = {
            epId:$scope.EN_ID_CS,
            epName:$scope.EN_NAME_CS,
            bizId:$stateParams.bizId,
            TP_ID:$stateParams.bizId,
            bizName:"医疗废物转移计划",
            bizStep:bizstep,
            checkResult:"00",
            checkAdvice:"",
            btoId:localStorageService.get("btoId"),
            btoName:localStorageService.get("btoName"),
            btofId:localStorageService.get("btofId"),
            btofName:localStorageService.get("btofName"),
            applyId:$stateParams.applyId,
            httpUrl:"/admin/adminDealTask"
        };
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
    };

    //查看审批记录
    $scope.check = function (){
        url = 'views/dashboard/admin/approveDetailModal.html';
        ctrlName = 'ApproveDetailModalCtrl';
        resolve = {
            applyId: function () {
                return $stateParams.applyId;
            }
        };
        var modalInstance = Modal.modal(url, ctrlName, resolve, function () {

        }, function () {

        });
        /*var modalInstance = $modal.open({
            templateUrl: 'views/dashboard/admin/approveDetailModal.html',
            controller: 'ApproveDetailModalCtrl',
            resolve: {
                applyId: function () {
                    return $stateParams.applyId;
                }
            }
        });
        modalInstance.result.then(function () {
            $log.info('success : ' + content);
        }, function () {
            $log.info('error : ' + new Date());
        });*/
    }

    //查看变更中转单位记录
    $scope.transferOrg = function (){
        url = 'views/modal/modifyTransferOrgDetailModal.html';
        ctrlName = 'ModifyTransferOrgDetailModalCtrl';
        resolve = {
            amId: function () {
                return "";
            },
            tpId: function () {
                return $scope.TP_ID;
            }
        };
        var modalInstance = Modal.modal(url, ctrlName, resolve, function () {

        }, function () {

        });
        /*var modalInstance = $modal.open({
            templateUrl: 'views/modal/modifyTransferOrgDetailModal.html',
            controller: 'ModifyTransferOrgDetailModalCtrl',
            resolve: {
                amId: function () {
                    return "";
                },
                tpId: function () {
                    return $scope.TP_ID;
                }
            }
        });
        modalInstance.result.then(function () {
            //$log.info('success : ' + content);
        }, function () {
            //$log.info('error : ' + new Date());
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
