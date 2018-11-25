/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('EnterpriseModifyCtrl', ['$rootScope','$scope','Init','Modal','$log','$state','localStorageService','$interval','CheckBrowser','$stateParams', function ($rootScope,$scope,Init,Modal,$log,$state,localStorageService,$interval,CheckBrowser,$stateParams) {
    CheckBrowser.check();
    //车辆添加等处置和产生不同的模块是否显示
    $scope.carFlag = true;
    if(localStorageService.get("userType") == "epCs"){
        $scope.carFlag = false;
    }
    $scope.orgTypeFlag = false;
    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";
    //单位名称
    $scope.epName = localStorageService.get("epName");
    //单位代码
    $scope.epCode = localStorageService.get("epCode");
    //所属区域信息
    $scope.areas = new Array();
    //所属市区信息
    $scope.cities = new Array();
    //所属环保局信息
    $scope.hbjList = new Array();
    //医疗机构等级
    $scope.hospitalGradeList = new Array();
    $scope.belongCity = $scope.cities[0];
    //单位类型选项
    $scope.orgTypes = [
        {"value":"0","type":"请选择"},
        {"value":"1","type":"是"},
        {"value":"2","type":"否"}
    ];
    var patrn = "";
    //中转单位信息
    $scope.belongOrgs = new Array();
    //单位ID
    $scope.epId = "";
    //单位类型
    $scope.epType = "";
    //审批记录按钮是否显示
    $scope.checkBtnFlag = false;
    //返回按钮和查看审批过程按钮是否显示
    $scope.backBtnFlag = false;
    if($stateParams.from != null && $stateParams.from != ""){
        $scope.backBtnFlag = true;
    }
    //查看原信息按钮是否显示标志位
    $scope.historyFlag = false;
    var par = {epId:localStorageService.get("epId"),action:"modify"};
    var url = "/enterprise/queryEpInfoTransitionForEp";
    if($stateParams.from == "dashboard.finishedTaskIndex.finishedTaskList"){
        url = "/enterprise/queryEpInfoHistoryForEp";
        par = {epId:localStorageService.get("epId"),action:"modify", applyId:$stateParams.applyId};
    }
    Init.iwbhttp(url, par, function (data, header, config, status) {
        //申请id
        $scope.applyId = "";
        if($stateParams.applyId != undefined && $stateParams.applyId != null && $stateParams.applyId != ""){
            $scope.applyId = $stateParams.applyId;
            $scope.checkBtnFlag = true;
        }
        if(data.resFlag == "0"){
            $scope.belongOrgs = data.transferOrgData;
            $scope.epId = data.epInfo.epId;
            $scope.epName = data.epInfo.epName;
            $scope.epType =  data.epInfo.epType;
            $scope.epCode = data.epInfo.orgCode;
            $scope.linkMan = data.epInfo.linkMan;
            $scope.belongStreet = data.epInfo.belongStreet;
            if($scope.applyId == null || $scope.applyId == ""){
                $scope.applyId = data.epInfo.applyId;
                if($scope.applyId != null && $scope.applyId != ""){
                    $scope.checkBtnFlag = true;
                }
            }
            $scope.areas = data.areaList;
            $scope.cities = data.cityList;
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
            if(data.epInfo.orgType == "0"){
                $scope.orgCheckT = true;
                $scope.orgCheckF = false;
                $scope.orgType = true;
                if(localStorageService.get("userType") == "epCs"){
                    $scope.orgTypeFlag = false;
                }
            }else if(data.epInfo.orgType == "1"){
                $scope.orgCheckT = false;
                $scope.orgCheckF = true;
                $scope.orgType = false;
                if(localStorageService.get("userType") == "epCs"){
                    $scope.orgTypeFlag = true;
                }
            }
            if(data.epInfo.orgBelongSepa != null && !angular.equals("",data.epInfo.orgBelongSepa)){
                for(var i=0;i<$scope.areas.length;i++){
                    if(angular.equals($scope.areas[i].value,data.epInfo.orgBelongSepa)){
                        $scope.orgBelongSepa = $scope.areas[i];
                        break;
                    }
                }
            }else{
                $scope.orgBelongSepa = $scope.areas[0];
            }
            if(data.epInfo.belongOrg != null && !angular.equals("",data.epInfo.belongOrg)){
                $scope.belongOrgFlag = true;
                for(var i=0;i<$scope.belongOrgs.length;i++){
                    if(angular.equals($scope.belongOrgs[i].value,data.epInfo.belongOrg)){
                        $scope.belongOrg = $scope.belongOrgs[i];
                        break;
                    }
                }
            }else{
                $scope.belongOrg = $scope.belongOrgs[0];
                $scope.belongOrgFlag = false;
            }
            $scope.historyFlag = data.historyFlag;
            $scope.btnFlag = data.btnFlag;
            $scope.newBtnFlag = $stateParams.btnFlag;
            $scope.testFlag = $scope.btnFlag;
            if($stateParams.from != null && $stateParams.from != ""){
                $scope.testFlag = !$stateParams.btnFlag;
            }
            $("#saveBtn").attr("disabled",$scope.testFlag);
            $("#submitBtn").attr("disabled",$scope.testFlag);
            $("#belongOrgFlag").attr("disabled",$scope.testFlag);
            $("#orgBelongSepa").attr("disabled",$scope.testFlag);
            $("#belongOrg").attr("disabled",$scope.testFlag);
            if(data.epInfo.orgType == "0" && !$scope.historyFlag){
                $("#orgTypeT").attr("disabled",true);
                $("#orgTypeF").attr("disabled",true);
            }else{
                $("#orgTypeT").attr("disabled",$scope.testFlag);
                $("#orgTypeF").attr("disabled",$scope.testFlag);
            }
            if(data.orgTypeFlag == "0"){
                $("#orgTypeT").attr("disabled",true);
                $("#orgTypeF").attr("disabled",true);
            }
        }else{
            $scope.open(data.msg);
        }
    }, function (data, header, config, status) {
    });

    //是否是中转单位
    $scope.orgTypeChange = function(result){
        if(result == "true"){
            $scope.orgTypeFlag = false;
            $scope.belongOrgFlag = false;
            $scope.belongOrg = $scope.belongOrgs[0];
        }else{
            $scope.orgTypeFlag = true;
        }
    }

    //是否需要中转单位
    $scope.belongOrgChange = function(result){
        $scope.orgBelongSepa = $scope.areas[0];
        $scope.belongOrgs = [{"value":"0","orgName":"请选择"}];
        $scope.belongOrg = $scope.belongOrgs[0];
    }

    //选择所属中转机构 联动
    $scope.selectBelongOrgSepa = function(){
        var par = {sepa:$scope.orgBelongSepa.value, epId:$scope.epId};
        Init.iwbhttp('/enterprise/queryBelongOrgBySepa', par, function (data, header, config, status) {
            $scope.belongOrgs =  data.transferOrgData;
            $scope.belongOrg = $scope.belongOrgs[0];
        }, function (data, header, config, status) {
        });
    }

    //保存
    $scope.save = function (){
        if($("#epName").val() == null || angular.equals("", $("#epName").val())){
            $("#epName").val("");
        }else{
            if($("#epName").val().length > 33){
                $scope.content = "单位全称太长";
                $scope.open($scope.content);
                return;
            }
        }
        if($("#epCode").val() == null || angular.equals("", $("#epCode").val())){
            $("#epCode").val("");
        }else{
            if($("#epCode").val().length > 30){
                $scope.content = "统一社会信用代码太长";
                $scope.open($scope.content);
                return;
            }
        }

        if($("#linkMan").val() == null || angular.equals("", $("#linkMan").val())){
            $("#linkMan").val("");
        }else{
            if($("#linkMan").val().length > 100){
                $scope.content = "法人名称太长";
                $scope.open($scope.content);
                return;
            }
        }
        if($("#belongStreet").val() == null || angular.equals("", $("#belongStreet").val())){
            $("#belongStreet").val("");
        }else{
            if($("#belongStreet").val().length > 100){
                $scope.content = "输入单位地址所在街道过长，请重新输入";
                $scope.open($scope.content);
                return;
            }
        }
        if($("#contancts").val() == null || angular.equals("", $("#contancts").val())){
            $("#contancts").val("");
        }else{
            if($("#contancts").val().length > 100){
                $scope.content = "联系人名称太长";
                $scope.open($scope.content);
                return;
            }
        }
        if($("#tel").val() == null || angular.equals("", $("#tel").val())){
            $("#tel").val("");
        }else{
            patrn=/^([0-9]{3,4}-)?[0-9]{7,8}$/;
            if (!patrn.exec($("#tel").val())){
                $scope.open("请输入正确座机号码！");
                return;
            }
        }

        if($("#mobilephone").val() == null || angular.equals("", $("#mobilephone").val())){
            $("#mobilephone").val("");
        }else{
            patrn=/^((13[0-9]{9})|(15[0-9]{9})|(18[0-9]{9})|(17[0-9]{9}))$/;
            if (!patrn.exec($("#mobilephone").val())){
                $scope.open("请输入正确手机号！");
                return;
            }
        }
        if($("#postalCode").val() == null || angular.equals("", $("#postalCode").val())){
            $("#postalCode").val("");
        }else{
            patrn=/^[1-9][0-9]{5}$/;
            if (!patrn.exec($("#postalCode").val())){
                $scope.open("请输入正确邮政编码！");
                return;
            }
        }

        if($("#eMail").val() == null || angular.equals("", $("#eMail").val())){
            $("#eMail").val("");
        }else{
            patrn=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!patrn.exec($("#eMail").val())){
                $scope.open("请输入正确邮箱地址！");
                return;
            }
        }
        if($("#longitude").val() == null || angular.equals("", $("#longitude").val())){
            $("#longitude").val("");
        }else{
            patrn =  /^\d*\.?\d{0,3}$/;
            if (!patrn.exec($("#longitude").val())){
                $scope.open("请输入正确经度！");
                return;
            }else{
                if($("#longitude").val().length > 16){
                    $scope.open("经度数值位数过长，请重新输入");
                    return;
                }
            }
        }

        if($("#latitude").val() == null || angular.equals("", $("#latitude").val())){
            $("#latitude").val("");
        }else{
            patrn =  /^\d*\.?\d{0,3}$/;
            if (!patrn.exec($("#latitude").val())){
                $scope.open("请输入正确纬度！");
                return;
            }else{
                if($("#latitude").val().length > 16){
                    $scope.open("纬度数值位数过长，请重新输入");
                    return;
                }
            }
        }
        if($scope.orgType == true){
            $scope.orgTypeValue = "0";
        }else{
            $scope.orgTypeValue = "1";
        }
        var par1 = "";
        if(localStorageService.get("userType") == "epCs"){
            par1 = {
                epId: $scope.epId,
                epType: $scope.epType,
                epName:localStorageService.get("epName"),
                belongSepa:localStorageService.get("belongSepa"),
                epInfo:{
                    epName:$("#epName").val(),
                    epCode:$("#epCode").val(),
                    belongSepa:$scope.belongSepa.value,
                    linkMan:$("#linkMan").val(),
                    belongCity:$scope.belongCity.value,
                    belongArea:$scope.belongArea.value,
                    belongStreet:$("#belongStreet").val(),
                    contancts:$("#contancts").val(),
                    tel:$("#tel").val(),
                    mobilephone:$("#mobilephone").val(),
                    postalCode:$("#postalCode").val(),
                    eMail:$("#eMail").val(),
                    longitude:$("#longitude").val(),
                    latitude:$("#latitude").val(),
                    step:$scope.step.value,
                    orgType:$scope.orgTypeValue,
                    belongOrg:$scope.belongOrg.value
                }
            };
        }else{
            par1 = {
                epId: $scope.epId,
                epType: $scope.epType,
                epName:localStorageService.get("epName"),
                belongSepa:localStorageService.get("belongSepa"),
                epInfo:{
                    epName:$("#epName").val(),
                    epCode:$("#epCode").val(),
                    belongSepa:$scope.belongSepa.value,
                    linkMan:$("#linkMan").val(),
                    belongCity:$scope.belongCity.value,
                    belongArea:$scope.belongArea.value,
                    belongStreet:$("#belongStreet").val(),
                    contancts:$("#contancts").val(),
                    tel:$("#tel").val(),
                    mobilephone:$("#mobilephone").val(),
                    postalCode:$("#postalCode").val(),
                    eMail:$("#eMail").val(),
                    longitude:$("#longitude").val(),
                    latitude:$("#latitude").val(),
                    step:$scope.step.value,
                    orgType:"",
                    belongOrg:""
                }
            };
        }
        Init.iwbhttp('/enterprise/modifyEnterpriseInfo', par1, function (data, header, config, status) {
            $scope.open(data.msg);
            if(data.resFlag == "0"){
                $scope.historyFlag = true;
                $scope.applyId = data.applyId;
            }
        }, function (data, header, config, status) {
        });
    };

    //提交
    $scope.submit = function (content) {
        if($("#epName").val() == null || angular.equals("", $("#epName").val())){
            $scope.content = "单位全称不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#epName").val().length > 33){
            $scope.content = "单位全称太长";
            $scope.open($scope.content);
            return;
        }
        if($("#belongSepa").val() == 0){
            $scope.content = "请选择所属环保局";
            $scope.open($scope.content);
            return;
        }
        if($("#epCode").val() == null || angular.equals("", $("#epCode").val())){
            $scope.content = "统一社会信用代码不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#epCode").val().length > 66){
            $scope.content = "统一社会信用代码太长";
            $scope.open($scope.content);
            return;
        }
        if($("#linkMan").val() == null || angular.equals("", $("#linkMan").val())){
            $scope.content = "法人不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#linkMan").val().length > 100){
            $scope.content = "法人名称太长";
            $scope.open($scope.content);
            return;
        }
        if($("#belongCity").val() == 0){
            $scope.content = "请选择单位地址所在市";
            $scope.open($scope.content);
            return;
        }
        if($("#belongArea").val() == 0){
            $scope.content = "请输入单位地址所在区";
            $scope.open($scope.content);
            return;
        }
        if($("#belongStreet").val() == null || angular.equals("", $("#belongStreet").val())){
            $scope.content = "请输入单位地址所在街道";
            $scope.open($scope.content);
            return;
        }else{
            if($("#belongStreet").val().length > 200){
                $scope.content = "输入单位地址所在街道过长，请重新输入";
                $scope.open($scope.content);
                return;
            }
        }
        if($("#contancts").val() == null || angular.equals("", $("#contancts").val())){
            $scope.content = "联系人不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#contancts").val().length > 100){
            $scope.content = "联系人名称太长";
            $scope.open($scope.content);
            return;
        }
        if($("#tel").val() == null || angular.equals("", $("#tel").val())){
            $scope.content = "座机号码不能为空";
            $scope.open($scope.content);
            return;
        }
        var patrn=/^([0-9]{3,4}-)?[0-9]{7,8}$/;
        if (!patrn.exec($("#tel").val())){
            $scope.open("请输入正确座机号码！");
            return;
        }
        if($("#mobilephone").val() == null || angular.equals("", $("#mobilephone").val())){
            $scope.content = "手机号不能为空";
            $scope.open($scope.content);
            return;
        }
        patrn=/^((13[0-9]{9})|(15[0-9]{9})|(18[0-9]{9})|(17[0-9]{9}))$/;
        if (!patrn.exec($("#mobilephone").val())){
            $scope.open("请输入正确手机号！");
            return;
        }
        if($("#postalCode").val() == null || angular.equals("", $("#postalCode").val())){
            $scope.content = "邮政编码不能为空";
            $scope.open($scope.content);
            return;
        }
        patrn=/^[1-9][0-9]{5}$/;
        if (!patrn.exec($("#postalCode").val())){
            $scope.open("请输入正确邮政编码！");
            return;
        }
        if($("#eMail").val() == null || angular.equals("", $("#eMail").val())){
            $scope.content = "邮箱地址不能为空";
            $scope.open($scope.content);
            return;
        }
        patrn=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!patrn.exec($("#eMail").val())){
            $scope.open("请输入正确邮箱地址！");
            return;
        }
        if($("#longitude").val() == null || angular.equals("", $("#longitude").val())){
            $scope.content = "经度不能为空";
            $scope.open($scope.content);
            return;
        }
        patrn =  /^\d*\.?\d{0,3}$/;
        if (!patrn.exec($("#longitude").val())){
            $scope.open("请输入正确经度！");
            return;
        }else{
            if($("#longitude").val().length > 16){
                $scope.open("经度数值位数过长，请重新输入");
                return;
            }
        }
        if($("#latitude").val() == null || angular.equals("", $("#latitude").val())){
            $scope.content = "纬度不能为空";
            $scope.open($scope.content);
            return;
        }
        patrn =  /^\d*\.?\d{0,3}$/;
        if (!patrn.exec($("#latitude").val())){
            $scope.open("请输入正确纬度！");
            return;
        }else{
            if($("#latitude").val().length > 16){
                $scope.open("纬度数值位数过长，请重新输入");
                return;
            }
        }
        if(localStorageService.get("userType") == "epCs"){
            if($("#step").val() == 0){
                $scope.content = "请选择医疗机构等级";
                $scope.open($scope.content);
                return;
            }
            //console.log("orgType====>"+$scope.orgType);
            if($scope.orgType != true && $scope.orgType != false){
                $scope.content = "请选择机构类型";
                $scope.open($scope.content);
                return;
            }
            if($scope.belongOrgFlag == true && $scope.belongOrg.value == "0"){
                $scope.content = "请选择中转机构";
                $scope.open($scope.content);
                return;
            }
        }
        if($scope.orgType == true){
            $scope.orgTypeValue = "0";
        }else{
            $scope.orgTypeValue = "1";
        }
        var par1 = "";
        if(localStorageService.get("userType") == "epCs"){
            par1 = {
                epId: $scope.epId,
                epType: $scope.epType,
                epName:localStorageService.get("epName"),
                belongSepa:localStorageService.get("belongSepa"),
                epInfo:{
                    epName:$("#epName").val(),
                    epCode:$("#epCode").val(),
                    belongSepa:$scope.belongSepa.value,
                    linkMan:$("#linkMan").val(),
                    belongCity:$scope.belongCity.value,
                    belongArea:$scope.belongArea.value,
                    belongStreet:$("#belongStreet").val(),
                    contancts:$("#contancts").val(),
                    tel:$("#tel").val(),
                    mobilephone:$("#mobilephone").val(),
                    postalCode:$("#postalCode").val(),
                    eMail:$("#eMail").val(),
                    longitude:$("#longitude").val(),
                    latitude:$("#latitude").val(),
                    step:$scope.step.value,
                    orgType:$scope.orgTypeValue,
                    belongOrg:$scope.belongOrg.value
                }
            };
        }else{
            par1 = {
                epId: $scope.epId,
                epType: $scope.epType,
                epName:localStorageService.get("epName"),
                belongSepa:localStorageService.get("belongSepa"),
                epInfo:{
                    epName:$("#epName").val(),
                    epCode:$("#epCode").val(),
                    belongSepa:$scope.belongSepa.value,
                    linkMan:$("#linkMan").val(),
                    belongCity:$scope.belongCity.value,
                    belongArea:$scope.belongArea.value,
                    belongStreet:$("#belongStreet").val(),
                    contancts:$("#contancts").val(),
                    tel:$("#tel").val(),
                    mobilephone:$("#mobilephone").val(),
                    postalCode:$("#postalCode").val(),
                    eMail:$("#eMail").val(),
                    longitude:$("#longitude").val(),
                    latitude:$("#latitude").val(),
                    step:$scope.step.value,
                    orgType:"",
                    belongOrg:""
                }
            };
        }
        Init.iwbhttp('/enterprise/submitEpModifyInfoApply', par1, function (data, header, config, status) {
            $scope.open(data.msg);
            if(data.resFlag == "0"){
                $("#saveBtn").attr("disabled",true);
                $("#submitBtn").attr("disabled",true);
                $("#checkBtn").attr("disabled",false);
                $("#orgTypeT").attr("disabled",true);
                $("#orgTypeF").attr("disabled",true);
                $("#belongOrgFlag").attr("disabled",true);
                $("#orgBelongSepa").attr("disabled",true);
                $("#belongOrg").attr("disabled",true);
                $scope.btnFlag = true;
                $scope.newBtnFlag = false;
            }
        }, function (data, header, config, status) {
        });
    };

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
    }

    //查看审批记录
    $scope.check = function (){
        var applyId = $scope.applyId;
        url = 'views/dashboard/admin/approveDetailModal.html';
        ctrlName = 'ApproveDetailModalCtrl';
        resolve = {
            applyId: function () {
                return applyId;
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
                    return applyId;
                }
            }
        });
        modalInstance.result.then(function () {
            //$log.info('success : ' + content);
        }, function () {
            //$log.info('error : ' + new Date());
        });*/
    }

    //查看原信息
    $scope.checkHistory = function (){
        if($stateParams.from != null && $stateParams.from != ""){
            if($stateParams.from == "dashboard.unfinishedTaskIndex.unfinishedTaskList"){
                $state.go("dashboard.unfinishedTaskIndex.epInfoHistoryForUnfinished",{"from":"dashboard.unfinishedTaskIndex.epInfoModifyTask","oldFrom":"dashboard.unfinishedTaskIndex.unfinishedTaskList","bizId":$stateParams.bizId,"applyId":$stateParams.applyId,"btnFlag":$scope.newBtnFlag});
            }else{
                $state.go("dashboard.finishedTaskIndex.epInfoHistoryForFinished",{"from":"dashboard.finishedTaskIndex.epInfoModifyFinishedTask","oldFrom":"dashboard.finishedTaskIndex.finishedTaskList","bizId":$stateParams.bizId,"applyId":$stateParams.applyId,"btnFlag":$scope.newBtnFlag});
            }
        }else{
            $state.go("dashboard.epInfoModifyIndex.epInfoHistory",{"from":"dashboard.epInfoModifyIndex.epInfoModify"});
        }
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
