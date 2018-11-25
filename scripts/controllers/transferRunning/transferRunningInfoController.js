/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('TransferRunningInfoCtrl', ['$scope','Init','Modal','$state','localStorageService','$stateParams','CheckBrowser', function ($scope,Init,Modal,$state,localStorageService,$stateParams,CheckBrowser) {
    CheckBrowser.check();
    if($stateParams.from == null || $stateParams.from == ""){
        localStorageService.set("collapse", 0);
        $state.go("dashboard.index");
        localStorageService.set("collapse", 1);
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
    //查看审批记录按钮是否显示
    $scope.checkFlag = false;
    if(transferId != null && !angular.equals("", transferId)){
        //查询运行中转移计划信息
        Init.iwbhttp('/plan/queryTransferRunningInfo', {TP_ID:transferId, bizId:$stateParams.bizId}, function (data, header, config, status) {
            $scope.TP_ID = data.TP_ID;
            $scope.TP_ID_OLD = data.TP_ID;
            $scope.AM_ID = data.AM_ID;
            $scope.UNIT_NUM = data.UNIT_NUM;
            $scope.BEGINTIME = data.BEGINTIME;
            $scope.ENDTIME = data.ENDTIME;
            $scope.LINKMAN = data.LINKMAN;
            $scope.LINKTEL = data.LINKTEL;
            $scope.LINKPHONE = data.LINKPHONE;
            $scope.EN_ID_CZ = data.EN_ID_CZ;
            $scope.EN_ID_CS = data.EN_ID_CS;
            $scope.EN_NAME_CS = data.EN_NAME_CS;
            $scope.EN_NAME_CZ = data.EN_NAME_CZ;
            $scope.EN_NAME_ZZ = data.EN_NAME_ZZ;
            $scope.APPLY_ID = data.APPLY_ID;
            $scope.zzs = data.zzs;
            $scope.zzShowFlag = false;
            if(data.EN_ID_ZZ != null && !angular.equals("",data.EN_ID_ZZ)){
                $scope.zzFlag = false;
                for(var i=0;i<$scope.zzs.length;i++){
                    if(angular.equals($scope.zzs[i].id,data.EN_ID_ZZ)){
                        $scope.EN_ID_ZZ = $scope.zzs[i];
                        $scope.zzFlag = true;
                        break;
                    }
                }
                if(!$scope.zzFlag){
                    $scope.EN_ID_ZZ = $scope.zzs[0];
                    if($stateParams.bizId != null && $stateParams.bizId != ""){
                        $scope.EN_NAME_ZZ = data.EN_NAME_ZZ;
                        $scope.zzShowFlag = true;
                    }
                }
            }else{
                $scope.EN_ID_ZZ = $scope.zzs[0];
            }
            if(data.checkFlag){
                $scope.checkFlag = true;
            }
            if(data.btnFlag){
                $("#saveBtn").attr("disabled",true);
                $("#submitBtn").attr("disabled",true);
            }
            if($stateParams.btnFlag != undefined && $stateParams.btnFlag != null){
                $("#saveBtn").attr("disabled", !$stateParams.btnFlag);
                $("#submitBtn").attr("disabled", !$stateParams.btnFlag);
            }
            if($stateParams.applyId != undefined && $stateParams.applyId != null && $stateParams.applyId != ""){
                $scope.APPLY_ID = $stateParams.applyId;
            }

            $scope.AM_ID_OLD = data.AM_ID;
            $scope.UNIT_NUM_OLD = data.UNIT_NUM;
            $scope.BEGINTIME_OLD = data.BEGINTIME;
            $scope.ENDTIME_OLD = data.ENDTIME;
            $scope.LINKMAN_OLD = data.LINKMAN;
            $scope.LINKTEL_OLD = data.LINKTEL;
            $scope.LINKPHONE_OLD = data.LINKPHONE;
            $scope.EN_NAME_CZ_OLD = data.EN_NAME_CZ;
            $scope.EN_NAME_ZZ_OLD = data.EN_NAME_ZZ_OLD;
        }, function (data, header, config, status) {
        });
    }

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
    }

    //保存
    $scope.save = function () {
        var zzId = "";
        var zzName = "";
        if($scope.EN_ID_ZZ.id != 0){
            zzId = $scope.EN_ID_ZZ.id;
            zzName = $scope.EN_ID_ZZ.name;
        }
        var par = {
            "TP_ID": $scope.TP_ID,
            "AM_ID":$scope.AM_ID,
            "EN_ID_ZZ": zzId,
            "EN_NAME_ZZ": zzName,
            "BIZ_NAME": "运行中转移计划变更中转单位",
            "EP_ID": $scope.EN_ID_CS,
            "EP_NAME": $scope.EN_NAME_CS,
            "BELONG_SEPA": localStorageService.get("belongSepa"),
            "APPLY_ID":$scope.APPLY_ID
        };
        Init.iwbhttp('/plan/saveTransferRunningModify', {par:par}, function (data, header, config, status) {
            $scope.open(data.msg);
            if(angular.equals("0",data.resFlag)){
                $scope.APPLY_ID = data.APPLY_ID;
                $scope.TM_ID = data.TM_ID;
            }
        }, function (data, header, config, status) {
        });
    }

    //提交
    $scope.submit = function () {
        var zzId = "";
        var zzName = "";
        if($scope.EN_ID_ZZ.id != 0){
            zzId = $scope.EN_ID_ZZ.id;
            zzName = $scope.EN_ID_ZZ.name;
        }
        var parm = {
            "TP_ID": $scope.TP_ID,
            "AM_ID":$scope.AM_ID,
            "EN_ID_ZZ": zzId,
            "EN_NAME_ZZ": zzName,
            "BIZ_ID": $scope.TM_ID,
            "BIZ_NAME": "运行中转移计划变更中转单位",
            "EP_ID": $scope.EN_ID_CS,
            "EP_NAME": $scope.EN_NAME_CS,
            "BELONG_SEPA": localStorageService.get("belongSepa"),
            "APPLY_ID":$scope.APPLY_ID
        };
        var msg = "修改计划同时也会修改协议，确定修改吗？";
        url = 'views/modal/confirmModal.html';
        ctrlName = 'ConfirmModalCtrl';
        resolve = {
            content: function () {
                return msg;
            },
            data: function () {
                return parm;
            }
        };
        var modalInstance = Modal.modal(url, ctrlName, resolve, function (returnData) {
            Init.iwbhttp('/plan/submitTransferRunningModify', {par:returnData}, function (data, header, config, status) {
                if(data.resFlag == "0"){
                    url = 'views/modal/promptModal.html';
                    ctrlName = 'PromptModalCtrl';
                    resolve = {
                        content: function () {
                            return data.msg;
                        },
                        data: function () {
                            return data;
                        }
                    };
                    var modalInstance = Modal.modal(url, ctrlName, resolve, function () {
                        $("#saveBtn").attr("disabled",true);
                        $("#submitBtn").attr("disabled",true);
                        $scope.checkFlag = true;
                    }, function () {

                    });
                }else{
                    $scope.open(data.msg);
                }
            }, function (data, header, config, status) {
            });
        }, function () {

        });
        /*var modalInstance = $modal.open({
            templateUrl: 'views/modal/confirmModal.html',
            controller: 'ConfirmModalCtrl',
            resolve: {
                content: function () {
                    return msg;
                },
                data: function () {
                    return parm;
                }
            }
        });
        modalInstance.result.then(function (returnData) {
            //$log.info('ensure : ' + data.msg);
            Init.iwbhttp('/plan/submitTransferRunningModify', {par:returnData}, function (data, header, config, status) {
                if(data.resFlag == "0"){
                    var modalInstance = $modal.open({
                        templateUrl: 'views/modal/promptModal.html',
                        controller: 'PromptModalCtrl',
                        resolve: {
                            content: function () {
                                return data.msg;
                            },
                            data: function () {
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        $("#saveBtn").attr("disabled",true);
                        $("#submitBtn").attr("disabled",true);
                        $scope.checkFlag = true;
                    }, function () {
                        //$log.info('error : ' + new Date());
                    });
                }else{
                    $scope.open(data.msg);
                }
            }, function (data, header, config, status) {
            });
        }, function () {
            //$log.info('cancel : ' + new Date());
        });*/
    }

    //查看审批记录
    $scope.check = function (){
        url = 'views/dashboard/admin/approveDetailModal.html';
        ctrlName = 'ApproveDetailModalCtrl';
        resolve = {
            applyId: function () {
                return $scope.APPLY_ID;
            }
        };
        var modalInstance = Modal.modal(url, ctrlName, resolve, function () {

        }, function () {

        });
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
