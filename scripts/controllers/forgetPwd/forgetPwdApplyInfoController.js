/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('ForgetPwdApplyInfoCtrl', ['$scope','Init','Modal','$state','localStorageService','$stateParams','CheckBrowser', function ($scope,Init,Modal,$state,localStorageService,$stateParams,CheckBrowser) {
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
    $scope.epName = $stateParams.EP_NAME;
    //单位同意社会信用码
    $scope.orgCode = $stateParams.ORGCARD;
    //申请人姓名
    $scope.applyName = $stateParams.NAME;
    //忘记密码申请记录id
    $scope.forgetPwdId = $stateParams.WF_ID;
    //接收邮件邮箱
    $scope.acceptMail = $stateParams.MAIL;
    //是否显示密码输入框
    $scope.pwdFlag = false;
    if(localStorageService.get("MAIL") != undefined && localStorageService.get("MAIL") != null && localStorageService.get("MAIL") != ""){
        $scope.mail = localStorageService.get("MAIL");
    }
    //该条记录审批状态
    if($stateParams.STATUS == "3" || $stateParams.STATUS == "4"){
        $("#disagreeBtn").attr("disabled",true);
        $("#agreeBtn").attr("disabled",true);
        $scope.mail = $stateParams.APPROVE_MAIL;
        $scope.pwdFlag = true;
    }

    //查询单位密码
    Init.iwbhttp('/admin/queryEpPwd', {"epName":$scope.epName,"orgCode":$scope.orgCode}, function (data, header, config, status) {
        $scope.sendContent =  "您的登录账号为："+ data.NAME +" ,您的登录密码为："+ data.PWD +" ,请妥善保存此邮件!";//$scope.epName+"的登录密码为"+data.pwd;
    }, function (data, header, config, status) {
    });

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
    }

    //同意并发送方法
    $scope.agree = function () {
        if($("#mail").val() == null || angular.equals("", $("#mail").val())){
            $scope.content = "邮箱地址不能为空";
            $scope.open($scope.content);
            return;
        }
        var patrn=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!patrn.exec($("#mail").val())){
            $scope.open("请输入正确邮箱地址！");
            return;
        }
        if($("#mailPwd").val() == null || angular.equals("", $("#mailPwd").val())){
            $scope.content = "邮箱密码不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#sendContent").val() == null || angular.equals("", $("#sendContent").val())){
            $scope.content = "发送内容不能为空";
            $scope.open($scope.content);
            return;
        }
        var par = {
            "mail": $scope.mail,
            "mailPwd": $scope.mailPwd,
            "sendContent": $scope.sendContent,
            "acceptMail": $scope.acceptMail,
            "forgetPwdId":$scope.forgetPwdId
        };
        localStorageService.set("MAIL", $scope.mail);
        //发送邮件
        Init.iwbhttp('/admin/sendMail', par, function (data, header, config, status) {
            $scope.open(data.msg);
            if(angular.equals("0",data.resFlag)){
                $("#disagreeBtn").attr("disabled",true);
                $("#agreeBtn").attr("disabled",true);
            }
        }, function (data, header, config, status) {
        });
    }

    //驳回方法
    $scope.disagree = function () {
        Init.iwbhttp('/admin/disagreeSendMail', {"forgetPwdId":$scope.forgetPwdId}, function (data, header, config, status) {
            $scope.open(data.msg);
            if(angular.equals("0",data.resFlag)){
                $("#disagreeBtn").attr("disabled",true);
                $("#agreeBtn").attr("disabled",true);
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

        }, function () {

        });
    };
}]);
