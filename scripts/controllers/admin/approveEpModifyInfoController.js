/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('ApproveEpModifyInfoCtrl', ['$scope','Init','$state','localStorageService','$stateParams','CheckBrowser','Modal', function ($scope,Init,$state,localStorageService,$stateParams,CheckBrowser,Modal) {
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
    //单位名称
    $scope.epName = "";
    //单位代码
    $scope.epCode = "";
    //所属区域信息
    $scope.areas = new Array();
    //所属市区信息
    $scope.cities = new Array();
    //所属环保局信息
    $scope.hbjList = new Array();
    //单位类型选项
    $scope.orgTypes = [
        {"value":"0","type":"请选择"},
        {"value":"1","type":"是"},
        {"value":"2","type":"否"}
    ];
    //中转单位信息
    $scope.belongOrgs = new Array();
    //医疗机构等级
    $scope.hospitalGradeList = new Array();
    //单位ID
    $scope.epId = "";
    //单位类型
    $scope.epType = "";
    var bizId = $stateParams.bizId.substring(2);
    var par = {epId:"EP"+bizId,action:"modify"};
    var url = "/enterprise/queryEnterpriseInfoForAdmin";
    if($stateParams.from == "dashboard.finishedTaskIndex.finishedTaskList"){
        url = "/enterprise/queryEpInfoHistoryForEp";
        par = {epId:"EP"+bizId,action:"modify", applyId:$stateParams.applyId};
    }
    Init.iwbhttp(url, par, function (data, header, config, status) {
        $scope.belongOrgs = data.transferOrgData;
        $scope.epId = data.epInfo.epId;
        $scope.epName = data.epInfo.epName;
        $scope.epType =  data.epInfo.epType;
        $scope.belongStreet = data.epInfo.belongStreet;
        if($scope.epType == "CS"){
            //产生和处置不同显示标志位
            $scope.showFlag = true;
            $scope.showFlag1 = true;
            $scope.connectTitle = "交接员";
        }else{
            $scope.showFlag = false;
            $scope.showFlag1 = false;
            $scope.connectTitle = "现场处置人员";
        }
        $scope.epCode = data.epInfo.orgCode;
        $scope.linkMan = data.epInfo.linkMan;
        $scope.cities = data.cityList;
        $scope.areas = data.areaList;
        $scope.hbjList = data.areaList;
        $scope.hospitalGradeList = data.hospitalGradeList;
        if(data.epInfo.belongCity != null && !angular.equals("",data.epInfo.belongCity)){
            for(var i=0;i<$scope.cities.length;i++){
                if(angular.equals($scope.cities[i].value,data.epInfo.belongCity)){
                    $scope.belongCity = $scope.cities[i];
                    break;
                }
            }
        }else{
            $scope.belongCity = $scope.cities[0];
        }
        if(data.epInfo.belongArea != null && !angular.equals("",data.epInfo.belongArea)){
            for(var i=0;i<$scope.areas.length;i++){
                if(angular.equals($scope.areas[i].value,data.epInfo.belongArea)){
                    $scope.belongArea = $scope.areas[i];
                    break;
                }
            }
        }else{
            $scope.belongArea = $scope.areas[0];
        }
        if(data.epInfo.belongSepa != null && !angular.equals("",data.epInfo.belongSepa)){
            for(var i=0;i<$scope.hbjList.length;i++){
                if(angular.equals($scope.hbjList[i].value,data.epInfo.belongSepa)){
                    $scope.belongSepa = $scope.hbjList[i];
                    break;
                }
            }
        }else{
            $scope.belongSepa = $scope.hbjList[0];
        }
        $scope.contancts = data.epInfo.contancts;
        $scope.tel = data.epInfo.tel;
        $scope.mobilephone = data.epInfo.mobilephone;
        $scope.postalCode = data.epInfo.postalCode;
        $scope.eMail = data.epInfo.eMail;
        $scope.longitude = data.epInfo.longitude;
        $scope.latitude = data.epInfo.latitude;
        if(data.epInfo.step != null && !angular.equals("",data.epInfo.step)){
            for(var i=0;i<$scope.hospitalGradeList.length;i++){
                if(angular.equals($scope.hospitalGradeList[i].value,data.epInfo.step)){
                    $scope.step = $scope.hospitalGradeList[i];
                    break;
                }
            }
        }else{
            $scope.step = $scope.hospitalGradeList[0];
        }
        if(data.epInfo.orgType != null && !angular.equals("",data.epInfo.orgType)){
            var j = parseInt(data.epInfo.orgType) + 1;
            for(var i=0;i<$scope.orgTypes.length;i++){
                if(angular.equals($scope.orgTypes[i].value,j + "")){
                    $scope.orgType = $scope.orgTypes[i];
                    break;
                }
            }
        }else{
            $scope.orgType = $scope.orgTypes[0];
        }
        if(data.epInfo.belongOrg != null && !angular.equals("",data.epInfo.belongOrg)){
            for(var i=0;i<$scope.belongOrgs.length;i++){
                if(angular.equals($scope.belongOrgs[i].value,data.epInfo.belongOrg)){
                    $scope.belongOrg = $scope.belongOrgs[i];
                    break;
                }
            }
        }else{
            $scope.showFlag1 = false;
            $scope.belongOrg = $scope.belongOrgs[0];
        }
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
        //请求参数
        var par = {
            epId:$scope.epId,
            epName:$scope.epName,
            bizId:$stateParams.bizId,
            bizName:"医疗机构信息维护",
            bizStep:bizstep,
            checkResult:"01",
            checkAdvice:"",
            btoId:localStorageService.get("btoId"),
            btoName:localStorageService.get("btoName"),
            btofId:localStorageService.get("btofId"),
            btofName:localStorageService.get("btofName"),
            applyId:$stateParams.applyId
        };
        //管理员处理待办任务
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
            bizName:"医疗机构信息维护",
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
            $log.info('success : ' + content);
        }, function () {
            $log.info('error : ' + new Date());
        });*/
    }

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
            oldFrom:$stateParams.from,
            from:"dashboard.unfinishedTaskIndex.approveEpModifyInfoUnfinished"
        };
        $state.go("dashboard.unfinishedTaskIndex.approveEpInfoTransition",para);
    }

    //查看历史信息
    $scope.checkHistory = function (){
        var para = {
            bizId:$stateParams.bizId,
            applyId:$stateParams.applyId,
            btnFlag:$scope.approveBtnFlag,
            oldFrom:$stateParams.from,
            from:"dashboard.finishedTaskIndex.approveEpModifyInfo"
        };
        $state.go("dashboard.finishedTaskIndex.approveEpInfoHistory",para);
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
