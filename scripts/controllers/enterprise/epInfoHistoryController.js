/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('EpInfoHistoryCtrl', ['$scope','Init','Modal','$state','localStorageService','CheckBrowser','$stateParams', function ($scope,Init,Modal,$state,localStorageService,CheckBrowser,$stateParams) {
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
    var par = {epId:localStorageService.get("epId"),action:"modify"};
    //查询单位信息
    Init.iwbhttp('/enterprise/queryEnterpriseInfo', par, function (data, header, config, status) {
        if(data.resFlag == "0"){
            $scope.belongOrgs = data.transferOrgData;
            $scope.epId = data.epInfo.epId;
            $scope.epName = data.epInfo.epName;
            $scope.epType =  data.epInfo.epType;
            $scope.epCode = data.epInfo.orgCode;
            $scope.linkMan = data.epInfo.linkMan;
            $scope.belongStreet = data.epInfo.belongStreet;
            $scope.applyId = data.epInfo.applyId;
            if($scope.applyId != null && $scope.applyId != ""){
                $scope.checkBtnFlag = true;
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
            $("#orgTypeT").attr("disabled",true);
            $("#orgTypeF").attr("disabled",true);
            $("#belongOrgFlag").attr("disabled",true);
            $("#belongOrg").attr("disabled",true);
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
        $scope.belongOrg = $scope.belongOrgs[0];
    }

    //返回上一页
    $scope.back = function (){
        var par = {"bizId":$stateParams.bizId,"applyId":$stateParams.applyId,"btnFlag":$stateParams.btnFlag,"from":$stateParams.oldFrom};
        $state.go($stateParams.from, par);
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
