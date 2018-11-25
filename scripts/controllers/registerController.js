/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('RegisterCtrl', ['$rootScope','$scope','Init','Modal','$state','localStorageService','CheckBrowser', function ($rootScope,$scope,Init,Modal,$state,localStorageService,CheckBrowser) {
    CheckBrowser.check();
    $scope.types = [
        {"value":"0","type":"请选择"},
        {"value":"1","type":"医疗机构"},
        {"value":"2","type":"医疗废物处置机构"}
    ];

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    $scope.enterpriseType = $scope.types[0];
    $scope.submit=function(){
        if($("#checkCode").val() != localStorageService.get("checkCode")){
            $scope.content = "验证码有误！";
            $scope.open($scope.content);
            return;
        }
        if($("#enterpriseType").val() == 0){
            $scope.content = "请选择单位类型";
            $scope.open($scope.content);
            return;
        }
        if($("#enterpriseName").val() == null || angular.equals("", $("#enterpriseName").val())){
            $scope.content = "单位全称不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#enterpriseName").val().length > 66){
            $scope.content = "单位全称太长";
            $scope.open($scope.content);
            return;
        }
        if($("#orgCode").val() == null || angular.equals("", $("#orgCode").val())){
            $scope.content = "统一社会信用代码不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#orgCode").val().length > 30){
            $scope.content = "统一社会信用代码太长";
            $scope.open($scope.content);
            return;
        }
        var patrn=/[\u4E00-\u9FA5\uF900-\uFA2D]/;
        if (patrn.exec($("#orgCode").val())){
            $scope.open("统一社会信用代码不能包含中文！");
            return;
        }
        patrn=/\s/;
        if (patrn.exec($("#orgCode").val())){
            $scope.open("统一社会信用代码不能包含空格！");
            return;
        }
        if($("#pwd").val() == null || angular.equals("", $("#pwd").val())){
            $scope.content = "密码不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#repwd").val() == null || angular.equals("", $("#repwd").val())){
            $scope.content = "确认密码不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#repwd").val() != $("#pwd").val()){
            $scope.content = "两次密码不一致";
            $scope.open($scope.content);
            return;
        }
        patrn=/^[A-Za-z0-9]+$/;
        if (!patrn.exec($("#pwd").val())){
            $scope.open("密码由大小写字母和数字组成！");
            return;
        }
        if($("#pwd").val().length > 18 || $("#pwd").val().length < 5){
            $scope.open("密码长度为5-18位！");
            return;
        }
        localStorageService.set("IWBSESSION", $scope.session);
        var par = {enterpriseType: $("#enterpriseType").val(), enterpriseName:$("#enterpriseName").val(), orgCode: $("#orgCode").val(), pwd: $("#pwd").val(), repwd:$("#repwd").val(), checkCode:$("#checkCode").val()};
        //单位注册
        Init.iwbhttp('/login/epRegister', par, function (data, header, config, status) {
            if (angular.equals("0", data.resFlag)) {
                $rootScope.epName = $("#enterpriseName").val();
                $rootScope.epCode = $("#orgCode").val();
                localStorageService.set("epName",$("#enterpriseName").val());
                localStorageService.set("epCode",$("#orgCode").val());
                $rootScope.nickName = $("#enterpriseName").val();
                var content = "注册成功!";
                var data = {"url":"dashboard.index"};
                $scope.open(content,data);
            } else {
                $scope.open(data.msg);
            }
        }, function (data, header, config, status) {
        });
    }
    //获取验证码
    $scope.getCheckCode=function(){
        Init.iwbhttp('/login/getCheckCodeNum', {}, function (data, header, config, status) {
            localStorageService.set("checkCode", data.checkCode);
            $scope.session = localStorageService.get('IWBSESSION');
            Init.iwbhttp('/login/getCheckCode', {}, function (data, header, config, status) {
                $("#imgCode").attr("src", $rootScope.baseUrl+$rootScope.baseUrlPath+"/login/getCheckCode?IWBSESSION="+$scope.session);
            }, function (data, header, config, status) {
            });
        }, function (data, header, config, status) {
        });
    }
    $scope.getCheckCode();

    //返回
    $scope.back=function(){
        $state.go("login");
    }

    //提示modal
    $scope.open = function (content,data) {
        url = 'views/modal/registerModal.html';
        ctrlName = 'RegisterModalCtrl';
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