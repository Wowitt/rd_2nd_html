/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('TransferInfoCtrl', ['$scope','Init','Modal','$state','localStorageService','$stateParams','CheckBrowser', function ($scope,Init,Modal,$state,localStorageService,$stateParams,CheckBrowser) {
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
    //查看审批记录按钮是否显示
    $scope.checkFlag = false;
    if(transferId != null && !angular.equals("", transferId)){
        $scope.TP_ID = transferId;
        //根据计划id查询计划详情
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
            if($scope.APPLY_ID != null && $scope.APPLY_ID != ""){
                if(data.APPLY_STATUS == '00'){
                    $scope.checkFlag = false;
                }else{
                    $scope.checkFlag = true;
                }
            }
            if(data.btnFlag){
                $("#saveBtn").attr("disabled",true);
                $("#submitBtn").attr("disabled",true);
            }
            $scope.transferOrgFlag = data.transferOrgFlag;
        }, function (data, header, config, status) {
        });
    }

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
    }

    //保存
    $scope.save = function () {
        if($("#LINKMAN").val() == null || angular.equals("", $("#LINKMAN").val())){
            $scope.content = "联系人不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#LINKMAN").val().length > 25){
            $scope.content = "联系人名称太长";
            $scope.open($scope.content);
            return;
        }
        if($("#LINKTEL").val() == null || angular.equals("", $("#LINKTEL").val())){
            $scope.content = "联系人座机不能为空";
            $scope.open($scope.content);
            return;
        }
        var patrn=/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
        if (!patrn.exec($("#LINKTEL").val())){
            $scope.open("请输入正确座机号！");
            return;
        }
        if($("#LINKPHONE").val() == null || angular.equals("", $("#LINKPHONE").val())){
            $scope.content = "联系人手机不能为空";
            $scope.open($scope.content);
            return;
        }
        patrn=/^((13[0-9]{9})|(15[0-9]{9})|(18[0-9]{9})|(17[0-9]{9}))$/;
        if (!patrn.exec($("#LINKPHONE").val())){
            $scope.open("请输入正确手机号！");
            return;
        }
        var par = {
            "TP_ID": transferId,
            "LINKMAN": $("#LINKMAN").val(),
            "LINKTEL": $("#LINKTEL").val(),
            "LINKPHONE": $("#LINKPHONE").val(),
            "BIZ_ID": transferId,
            "BIZ_NAME": "医疗废物转移计划",
            "EP_ID": $scope.EN_ID_CS,
            "EP_NAME": $scope.EN_NAME_CS,
            "BELONG_SEPA": localStorageService.get("belongSepa"),
            "APPLY_ID":$scope.APPLY_ID
        };
        //保存计划
        Init.iwbhttp('/plan/savePlan', par, function (data, header, config, status) {
            $scope.open(data.msg);
            if(angular.equals("0",data.resFlag)){
                $scope.APPLY_ID = data.APPLY_ID;
            }
        }, function (data, header, config, status) {
        });
    }

    //提交
    $scope.submit = function () {
        if($("#LINKMAN").val() == null || angular.equals("", $("#LINKMAN").val())){
            $scope.content = "联系人不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#LINKMAN").val().length > 25){
            $scope.content = "联系人名称太长";
            $scope.open($scope.content);
            return;
        }
        if($("#LINKTEL").val() == null || angular.equals("", $("#LINKTEL").val())){
            $scope.content = "联系人座机不能为空";
            $scope.open($scope.content);
            return;
        }
        var patrn=/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
        if (!patrn.exec($("#LINKTEL").val())){
            $scope.open("请输入正确座机号！");
            return;
        }
        if($("#LINKPHONE").val() == null || angular.equals("", $("#LINKPHONE").val())){
            $scope.content = "联系人手机不能为空";
            $scope.open($scope.content);
            return;
        }
        patrn=/^((13[0-9]{9})|(15[0-9]{9})|(18[0-9]{9})|(17[0-9]{9}))$/;
        if (!patrn.exec($("#LINKPHONE").val())){
            $scope.open("请输入正确手机号！");
            return;
        }
        var par = {
            "TP_ID": transferId,
            "BIZ_ID": transferId,
            "BIZ_NAME": "医疗废物转移计划",
            "EP_ID": $scope.EN_ID_CS,
            "EP_NAME": $scope.EN_NAME_CS,
            "BELONG_SEPA": localStorageService.get("belongSepa"),
            "APPLY_ID":$scope.APPLY_ID,
            "LINKMAN": $("#LINKMAN").val(),
            "LINKTEL": $("#LINKTEL").val(),
            "LINKPHONE": $("#LINKPHONE").val()
        };
        //提交计划
        Init.iwbhttp('/plan/submitPlan', par, function (data, header, config, status) {
            $scope.open(data.msg);
            if(angular.equals("0",data.resFlag)){
                $("#saveBtn").attr("disabled",true);
                $("#submitBtn").attr("disabled",true);
                $scope.checkFlag = true;
            }
        }, function (data, header, config, status) {
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
       /* var modalInstance = $modal.open({
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
        /*var modalInstance = $modal.open({
            templateUrl: 'views/dashboard/admin/approveDetailModal.html',
            controller: 'ApproveDetailModalCtrl',
            resolve: {
                applyId: function () {
                    return $scope.APPLY_ID;
                }
            }
        });
        modalInstance.result.then(function () {
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
