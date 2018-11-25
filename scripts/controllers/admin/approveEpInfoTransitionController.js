/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('ApproveEpInfoTransitionCtrl', ['$scope','Init','$state','localStorageService','$stateParams','CheckBrowser','Modal', function ($scope,Init,$state,localStorageService,$stateParams,CheckBrowser,Modal) {
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
    var par = {epId:"EP"+bizId,bizId:"",action:"modify"};
    //查询单位信息
    Init.iwbhttp('/enterprise/queryEnterpriseInfo', par, function (data, header, config, status) {
        if(data.resFlag == "0"){
            if(data.epInfo.epId == null || data.epInfo.epId == ""){
                var para = {
                    bizId:$stateParams.bizId,
                    applyId:$stateParams.applyId,
                    btnFlag:$stateParams.btnFlag,
                    from:$stateParams.oldFrom,
                    url:$stateParams.from
                };
                $scope.open("暂无原信息！",para);
            }else{
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
            }
        }else{
            $scope.open(data.msg);
        }
    }, function (data, header, config, status) {
    });

    //返回上一页
    $scope.back = function (){
        var para = {
            bizId:$stateParams.bizId,
            applyId:$stateParams.applyId,
            btnFlag:$stateParams.btnFlag,
            from:$stateParams.oldFrom
        };
        $state.go($stateParams.from,para);
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
