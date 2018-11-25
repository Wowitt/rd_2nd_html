/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('ApproveEpAdminInfoCtrl', ['$scope','Init','$state','localStorageService','$stateParams','CheckBrowser','Modal', function ($scope,Init,$state,localStorageService,$stateParams,CheckBrowser,Modal) {
    //检查当前浏览器是否可用
    CheckBrowser.check();
    //弹框参数
    var resolve = {	};
    var url = "";
    var ctrlName = "";
    //判断参数是否有值
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
    //单位类型
    $scope.epType = "";
    var bizId = $stateParams.bizId.substring(2);
    $scope.epId = "EP"+bizId;
    var action = "";
    if($stateParams.from == "dashboard.finishedTaskIndex.finishedTaskList"){
        action = "finished";
    }else if($stateParams.from == "dashboard.unfinishedTaskIndex.unfinishedTaskList"){
        action = "unfinished";
    }
    var par = {epId:$scope.epId,action:action,applyId:$stateParams.applyId};
    //查询当前登录人员的信息
    Init.iwbhttp('/enterprise/queryAdminInfo', par, function (data, header, config, status) {
        $scope.adminData = data.adminData;
        $scope.epName = data.adminInfo.epName;
    }, function (data, header, config, status) {
    });

    //同意方法
    $scope.agree = function (){
        //业务等级（sjsp-市级审批，qjsp-市级审批）
        var bizstep = "";
        if(angular.equals("SHB",localStorageService.get("orgCode"))){
            bizstep = "sjsp";
        }else{
            bizstep = "qjsp";
        }
        var par = {
            epId:$scope.epId,
            epName:$scope.epName,
            bizId:$stateParams.bizId,
            bizName:"管理员信息维护",
            bizStep:bizstep,
            checkResult:"01",
            checkAdvice:"",
            btoId:localStorageService.get("btoId"),
            btoName:localStorageService.get("btoName"),
            btofId:localStorageService.get("btofId"),
            btofName:localStorageService.get("btofName"),
            applyId:$stateParams.applyId
        };
        //管理员处置待办业务
        Init.iwbhttp('/admin/adminDealTask', {approveInfo:par}, function (data, header, config, status) {
            $scope.open(data.msg);
            if(data.resFlag == "0"){
                $("#agreeBtn").attr("disabled",true);
                $("#disagreeBtn").attr("disabled",true);
                $("#checkTransitionBtn").attr("disabled",true);
            }
        }, function (data, header, config, status) {
        });
    }

    //驳回方法
    $scope.disagree = function (){
        //业务等级（sjsp-市级审批，qjsp-市级审批）
        var bizstep = "";
        if(angular.equals("SHB",localStorageService.get("orgCode"))){
            bizstep = "sjsp";
        }else{
            bizstep = "qjsp";
        }
        var content = "原因";
        var parm = {
            epId:$scope.epId,
            epName:$scope.epName,
            bizId:$stateParams.bizId,
            bizName:"管理员信息维护",
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
                $("#checkTransitionBtn").attr("disabled",true);
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
                $("#checkTransitionBtn").attr("disabled",true);
            }
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
            applyId : function () {
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
            //$log.info('success : ' + content);
        }, function () {
            //$log.info('error : ' + new Date());
        });*/
    }

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
    }

    //查看过渡信息
    $scope.checkTransition = function (){
        var para = {
            bizId:$stateParams.bizId,
            applyId:$stateParams.applyId,
            btnFlag:$scope.approveBtnFlag,
            from:"dashboard.unfinishedTaskIndex.epAdminManageUnfinishedTaskForAdmin",
            oldFrom:$stateParams.from
        };
        $state.go("dashboard.unfinishedTaskIndex.epAdminManageUnfinishedTaskForAdminTransition",para);
    }

    //查看历史信息
    $scope.checkHistory = function (){
        var para = {
            bizId:$stateParams.bizId,
            applyId:$stateParams.applyId,
            btnFlag:$scope.approveBtnFlag,
            oldFrom:$stateParams.from,
            from:"dashboard.finishedTaskIndex.epAdminManageFinishedTaskForAdmin"
        };
        $state.go("dashboard.finishedTaskIndex.epAdminManageFinishedTaskForAdminTransition",para);
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
