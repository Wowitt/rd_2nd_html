/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('LoginCtrl', ['$rootScope','$scope','Init','Modal','$state','localStorageService','CheckBrowser', '$stateParams',function ($rootScope,$scope,Init,Modal,$state,localStorageService,CheckBrowser,$stateParams) {
    CheckBrowser.check();
    if($stateParams.from != null && $stateParams.from != "" && $stateParams.from == "logout"){
        Init.iwbhttp('/user/logout',{"name":localStorageService.get('userId')},function(data,header,config,status){
            if(data.resFlag == 0){
                var mail = localStorageService.get("MAIL");
                localStorageService.clearAll();
                localStorageService.set("MAIL", mail);
                $state.go("login");
            }
        },function(data,header,config,status){
        });
    }else{
        if(localStorageService.get("IWBSESSION") != undefined && localStorageService.get("IWBSESSION") != null && !angular.equals("", localStorageService.get("IWBSESSION"))) {
            if(localStorageService.get("indexUrl") != undefined && localStorageService.get("indexUrl") != null && !angular.equals("", localStorageService.get("indexUrl"))) {
                $state.go(localStorageService.get("indexUrl"));
                localStorageService.set("collapse",0);
            }else{
                localStorageService.clearAll();
            }
        }
    }

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    //公司登录
    $scope.submit = function (){
        //输入用户名
        $scope.name = $("#name").val();
        //输入密码
        $scope.pwd = $("#pwd").val();
        if($scope.name == null || angular.equals("", $scope.name)){
            $scope.open("用户名不能为空");
            return;
        }
        if ($scope.pwd == null || angular.equals("", $scope.pwd)) {
            $scope.open("密码不能为空");
            return;
        }
        if($scope.name.length > 66){
            $scope.open("用户名太长！");
            return;
        }
        if($scope.pwd.length > 18){
            $scope.open("密码太长！");
            return;
        }
        if($scope.pwd.length < 5){
            $scope.open("密码太短！");
            return;
        }
        var patrn=/^[A-Za-z0-9]+$/;
        if (!patrn.exec($scope.pwd)){
            $scope.open("密码格式错误！");
            return;
        }
        //单位登录
        Init.iwbhttp('/login/epLogin', {username: $scope.name, pwd: $scope.pwd}, function (data, header, config, status) {
            if (angular.equals("0", data.resFlag)) {
                $rootScope.ifLogin = "0";
                localStorageService.set("indexUrl","dashboard.index");
                $state.go("dashboard.index");
            } else {
                $scope.open(data.msg);
            }
        }, function (data, header, config, status) {
        });
    }

    //管理员登录
    $scope.adminSubmit = function (){
        $scope.adminName = $("#adminName").val();
        $scope.adminPwd = $("#adminPwd").val();
        if($scope.adminName == null || angular.equals("", $scope.adminName)){
            $scope.open("用户名不能为空！");
            return;
        }
        if ($scope.adminPwd == null || angular.equals("", $scope.adminPwd)) {
            $scope.open("密码不能为空");
            return;
        }
        if($scope.adminName.length > 64){
            $scope.open("用户名太长！");
            return;
        }
        if($scope.adminPwd.length > 100){
            $scope.open("密码太长！");
            return;
        }
        if($scope.adminPwd.length < 5){
            $scope.open("密码太短！");
            return;
        }
        var patrn=/^[A-Za-z0-9]+$/;
        if (!patrn.exec($scope.adminPwd)){
            $scope.open("密码格式错误！");
            return;
        }
        //管理员登录
        Init.iwbhttp('/login/adminLogin', {adminName: $scope.adminName, adminPwd: $scope.adminPwd}, function (data, header, config, status) {
            if (angular.equals("0", data.resFlag)) {
                $rootScope.ifLogin = "0";
                localStorageService.set("btoId",data.btoId);
                localStorageService.set("btoName",data.btoName);
                localStorageService.set("btofId",data.btofId);
                localStorageService.set("btofName",data.btofName);
                localStorageService.set("ROLEID",data.ROLEID);
                localStorageService.set("indexUrl","dashboard.index");
                $state.go("dashboard.index");
            } else {
                $scope.open(data.msg);
            }
        }, function (data, header, config, status) {
        });
    }

    //单位管理员登录
    $scope.epAdminSubmit = function (){
        //客户端输入统一码，用户名，密码
        $scope.epCode = $("#epCode").val();
        $scope.epAdminName = $("#epAdminName").val();
        $scope.epAdminPwd = $("#epAdminPwd").val();
        if($scope.epCode == null || angular.equals("", $scope.epCode)){
            $scope.open("统一社会信用代码不能为空");
            return;
        }
        if($scope.epAdminName == null || angular.equals("", $scope.epAdminName)){
            $scope.open("用户名不能为空");
            return;
        }
        if ($scope.epAdminPwd == null || angular.equals("", $scope.epAdminPwd)) {
            $scope.open("密码不能为空");
            return;
        }
        if($scope.epCode.length > 30){
            $scope.open("统一社会信用代码太长！");
            return;
        }
        if($scope.epAdminName.length > 66){
            $scope.open("用户名太长！");
            return;
        }
        if($scope.epAdminPwd.length > 18){
            $scope.open("密码太长！");
            return;
        }
        if($scope.epAdminPwd.length < 5){
            $scope.open("密码太短！");
            return;
        }
        var patrn=/^[A-Za-z0-9]+$/;
        if (!patrn.exec($scope.epAdminPwd)){
            $scope.open("密码格式错误！");
            return;
        }
        //单位管理员登录
        Init.iwbhttp('/login/epAdminLogin', {epCode:$scope.epCode, epAdminName: $scope.epAdminName, epAdminPwd: $scope.epAdminPwd}, function (data, header, config, status) {
            if (angular.equals("0", data.resFlag)) {
                $rootScope.ifLogin = "0";
                localStorageService.set("indexUrl","dashboard.index");
                $state.go("dashboard.index");
            } else {
                $scope.open(data.msg);
            }
        }, function (data, header, config, status) {
        });
    }

    //提示modal
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

    //单位注册
    $scope.register=function(){
        $state.go("register");
    }

    //返回到index.html
    $scope.back = function (){
        var currentUrl = window.location.href;
        var url = "";
        if(currentUrl.indexOf("/main.html")>0){
            url = currentUrl.split("/main.html")[0] + "/index.html";
        }else{
            url = "/index.html";
        }
        window.location.href = url;
    }
}]);
