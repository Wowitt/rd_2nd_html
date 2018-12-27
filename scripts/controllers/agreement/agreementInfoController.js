/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('AgreementInfoCtrl', ['$rootScope','$scope','Init','$state','localStorageService','$stateParams','$interval','CheckBrowser','Modal', function ($rootScope,$scope,Init,$state,localStorageService,$stateParams,$interval,CheckBrowser,Modal) {
    CheckBrowser.check();
    if($stateParams.from == null || $stateParams.from == ""){
        localStorageService.set("collapse", 0);
        $state.go("dashboard.index");
        localStorageService.set("collapse", 1);
        return;
    }
    //处置协议id
    var agreementId = $stateParams.agreementId;
    //处置单位信息
    $scope.czs = new Array();
    //原因显示标志
    $scope.reasonFlag = false;

    $scope.AM_ID ="";

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";
    //中转单位信息
    $scope.zzs = new Array();
    //查询单位列表
    Init.iwbhttp('/agreement/queryEPList', {epId: localStorageService.get("epId")}, function (data, header, config, status) {
        $scope.zzs = data.datalistForZZ;
        $scope.czs =  data.datalistForCZ;
        $scope.EN_ID_CZ = $scope.czs[0];
        if($scope.zzs.length == 2){
            $scope.EN_ID_ZZ = $scope.zzs[1];
        }else{
            $scope.EN_ID_ZZ = $scope.zzs[0];
        }
        if(agreementId != null && !angular.equals("", agreementId)){
            $scope.AM_ID = agreementId;
            Init.iwbhttp('/agreement/queryAgreement', {AM_ID: $scope.AM_ID}, function (data, header, config, status) {
                $scope.zzFlag = false;
                $scope.UNIT_NUM = data.UNIT_NUM;
                $scope.BEGINTIME = data.BEGINTIME;
                $scope.ENDTIME = data.ENDTIME;
                $scope.LINKMAN = data.LINKMAN;
                $scope.LINKTEL = data.LINKTEL;
                $scope.LINKPHONE = data.LINKPHONE;
                $scope.EN_NAME_ZZ = data.EN_NAME_ZZ;
                $scope.transferOrgFlag = data.transferOrgFlag;
                if(data.EN_ID_CZ != null && !angular.equals("",data.EN_ID_CZ)){
                    for(var i=0;i<$scope.czs.length;i++){
                        if(angular.equals($scope.czs[i].id,data.EN_ID_CZ)){
                            $scope.EN_ID_CZ = $scope.czs[i];
                            break;
                        }
                    }
                }
                if(data.EN_ID_ZZ != null && !angular.equals("",data.EN_ID_ZZ)){
                    for(var i=0;i<$scope.zzs.length;i++){
                        if(angular.equals($scope.zzs[i].id,data.EN_ID_ZZ)){
                            $scope.EN_ID_ZZ = $scope.zzs[i];
                            break;
                        }
                    }
                }
                if(data.STATUS == "2" || data.STATUS == '3'){
                    $("#saveBtn").attr("disabled",true);
                    $("#submitBtn").attr("disabled",true);
                    $scope.zzFlag = true;
                }
                if(data.REASON != null && !angular.equals("",data.REASON) && data.STATUS != "2"){
                    $scope.reasonFlag = true;
                    $scope.REASON = data.REASON;
                }
            }, function (data, header, config, status) {
            });
        }
    }, function (data, header, config, status) {
    });

    function test() {
        $("#BEGINTIME").click();
    }
    //延迟任务，时间控件点击
    var timer=$interval(function(){
        if($rootScope.dateClick){
            $("#BEGINTIME").click();
            $rootScope.dateClick = false;
        }
    },10,3);

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
    }

    //查看变更中转单位记录
    $scope.transferOrg = function (){
        url = 'views/modal/modifyTransferOrgDetailModal.html';
        ctrlName = 'ModifyTransferOrgDetailModalCtrl';
        resolve = {
            amId: function () {
                return $scope.AM_ID;
            },
            tpId: function () {
                return "";
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
                    return $scope.AM_ID;
                },
                tpId: function () {
                    return "";
                }
            }
        });
        modalInstance.result.then(function () {
            //$log.info('success : ' + content);
        }, function () {
            //$log.info('error : ' + new Date());
        });*/
    }

    //保存方法
    $scope.save = function () {
        if($scope.EN_ID_CZ.id == null || angular.equals("0", $scope.EN_ID_CZ.id)){
            $scope.content = "请选择医疗废物处置单位";
            $scope.open($scope.content);
            return;
        }
        if($("#UNIT_NUM").val() == null || angular.equals("", $("#UNIT_NUM").val())){
            $scope.content = "计划转移医疗废物数量不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#UNIT_NUM").val().length > 20){
            $scope.content = "计划转移医疗废物数量太大";
            $scope.open($scope.content);
            return;
        }
        //var patrn = /^(([1-9]+)|([0-9]+\.[0-9]{0,3}))$/;
        var patrn = /^(([0-9]+\.[0-9]{0,1}[1-9][0-9]{0,2})|([0-9]*[1-9][0-9]*\.[0-9]{0,3})|([0-9]{0,1}[1-9][0-9]{0,2}))$/;
        if(!patrn.exec($("#UNIT_NUM").val())){
            $scope.open("您输入的计划转移医疗废物数量格式不正确，请重新输入");
            return;
        }
        if($("#BEGINTIME").val() == null || angular.equals("", $("#BEGINTIME").val())){
            $scope.content = "处置协议开始时间不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#ENDTIME").val() == null || angular.equals("", $("#ENDTIME").val())){
            $scope.content = "处置协议结束时间不能为空";
            $scope.open($scope.content);
            return;
        }
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
        //var patrn=/^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
        var patrn=/^([0-9]{3,4}-)?[0-9]{7,8}$/;
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
        if($("#ENDTIME").val() <= $("#BEGINTIME").val()){
            $scope.content = "结束时间必须大于开始时间";
            $scope.open($scope.content);
            return;
        }
        var zzId = "";
        var zzName = "";
        if($scope.EN_ID_ZZ.id != 0){
            zzId = $scope.EN_ID_ZZ.id;
            zzName = $scope.EN_ID_ZZ.name;
        }
        var par = {
            "AM_ID": $scope.AM_ID,
            "EN_ID_CZ": $scope.EN_ID_CZ.id,
            "EN_NAME_CZ": $scope.EN_ID_CZ.name,
            "EN_ID_ZZ": zzId,
            "EN_NAME_ZZ": zzName,
            "UNIT_NUM": $("#UNIT_NUM").val(),
            "BEGINTIME": $("#BEGINTIME").val(),
            "ENDTIME": $("#ENDTIME").val(),
            "LINKMAN": $("#LINKMAN").val(),
            "LINKTEL": $("#LINKTEL").val(),
            "LINKPHONE": $("#LINKPHONE").val(),
            "EN_ID_CS": localStorageService.get("epId"),
            "EN_NAME_CS": localStorageService.get("epName")
        };
        Init.iwbhttp('/agreement/saveAgreement', par, function (data, header, config, status) {
            data.method = "save";
            $scope.open(data.msg, data);
        }, function (data, header, config, status) {
        });
    }

    //提交方法
    $scope.submit = function () {
        if($scope.EN_ID_CZ.id == null || angular.equals("0", $scope.EN_ID_CZ.id)){
            $scope.content = "请选择医疗废物处置单位";
            $scope.open($scope.content);
            return;
        }
        if($("#UNIT_NUM").val() == null || angular.equals("", $("#UNIT_NUM").val())){
            $scope.content = "计划转移医疗废物数量不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#UNIT_NUM").val().length > 20){
            $scope.content = "计划转移医疗废物数量太大";
            $scope.open($scope.content);
            return;
        }
        //var patrn = /^(([1-9]+)|([0-9]+\.[0-9]{0,3}))$/;
        var patrn = /^(([0-9]+\.[0-9]{0,1}[1-9][0-9]{0,2})|([0-9]*[1-9][0-9]*\.[0-9]{0,3})|([0-9]{0,1}[1-9][0-9]{0,2}))$/;
        if(!patrn.exec($("#UNIT_NUM").val())){
            $scope.open("您输入的计划转移医疗废物数量格式不正确，请重新输入");
            return;
        }
        if($("#BEGINTIME").val() == null || angular.equals("", $("#BEGINTIME").val())){
            $scope.content = "处置协议开始时间不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#ENDTIME").val() == null || angular.equals("", $("#ENDTIME").val())){
            $scope.content = "处置协议结束时间不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#LINKMAN").val() == null || angular.equals("", $("#LINKMAN").val())){
            $scope.content = "联系人不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#LINKMAN").val().length > 50){
            $scope.content = "联系人名称太长";
            $scope.open($scope.content);
            return;
        }
        if($("#LINKTEL").val() == null || angular.equals("", $("#LINKTEL").val())){
            $scope.content = "联系人座机不能为空";
            $scope.open($scope.content);
            return;
        }
        var patrn=/^([0-9]{3,4}-)?[0-9]{7,8}$/;
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
        if($("#ENDTIME").val() <= $("#BEGINTIME").val()){
            $scope.content = "结束时间必须大于开始时间";
            $scope.open($scope.content);
            return;
        }
        var zzId = "";
        var zzName = "";
        if($scope.EN_ID_ZZ.id != 0){
            zzId = $scope.EN_ID_ZZ.id;
            zzName = $scope.EN_ID_ZZ.name;
            $scope.EN_NAME_ZZ = zzName;
        }
        var par = {
            "AM_ID": $scope.AM_ID,
            "EN_ID_CZ": $scope.EN_ID_CZ.id,
            "EN_NAME_CZ": $scope.EN_ID_CZ.name,
            "EN_ID_ZZ": zzId,
            "EN_NAME_ZZ": zzName,
            "UNIT_NUM": $("#UNIT_NUM").val(),
            "BEGINTIME": $("#BEGINTIME").val(),
            "ENDTIME": $("#ENDTIME").val(),
            "LINKMAN": $("#LINKMAN").val(),
            "LINKTEL": $("#LINKTEL").val(),
            "LINKPHONE": $("#LINKPHONE").val(),
            "EN_ID_CS": localStorageService.get("epId"),
            "EN_NAME_CS": localStorageService.get("epName")
        };
        //提交协议
        Init.iwbhttp('/agreement/submitAgreement', par, function (data, header, config, status) {
            data.method = "submit";
            $scope.open(data.msg, data);
            if(angular.equals("0",data.resFlag)){
                $("#saveBtn").attr("disabled",true);
                $("#submitBtn").attr("disabled",true);
                $scope.zzFlag = true;
            }
        }, function (data, header, config, status) {
        });
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
            if(data != undefined || data != null || data == ""){
                if(data.method == "save" || data.method == "submit"){
                    if(data.resFlag == "0" && (data.AM_ID != null && !angular.equals("", data.AM_ID))){
                        $scope.AM_ID = data.AM_ID;
                    }
                }
            }
        }, function () {

        });
    };
}]);
