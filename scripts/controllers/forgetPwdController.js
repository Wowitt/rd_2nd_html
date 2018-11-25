/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('ForgetPwdCtrl', ['$scope', 'Init', 'Modal', '$state', 'CheckBrowser', function ($scope, Init, Modal, $state, CheckBrowser) {
    CheckBrowser.check();
    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    $scope.submit = function () {
        if ($("#epName").val() == null || angular.equals("", $("#epName").val())) {
            $scope.content = "单位全称不能为空";
            $scope.open($scope.content);
            return;
        }
        if ($("#epName").val().length > 66) {
            $scope.content = "单位全称太长";
            $scope.open($scope.content);
            return;
        }
        if ($("#orgCode").val() == null || angular.equals("", $("#orgCode").val())) {
            $scope.content = "统一社会信用代码不能为空";
            $scope.open($scope.content);
            return;
        }
        if ($("#orgCode").val().length > 30) {
            $scope.content = "统一社会信用代码太长";
            $scope.open($scope.content);
            return;
        }
        var patrn = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        if (patrn.exec($("#orgCode").val())) {
            $scope.open("统一社会信用代码不能包含中文！");
            return;
        }
        patrn = /\s/;
        if (patrn.exec($("#orgCode").val())) {
            $scope.open("统一社会信用代码不能包含空格！");
            return;
        }
        if ($("#mail").val() == null || angular.equals("", $("#mail").val())) {
            $scope.content = "邮箱不能为空";
            $scope.open($scope.content);
            return;
        }
        var patrn=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!patrn.exec($("#mail").val())){
            $scope.open("请输入正确邮箱地址！");
            return;
        }
        if ($("#name").val() == null || angular.equals("", $("#name").val())) {
            $scope.content = "申请人姓名不能为空";
            $scope.open($scope.content);
            return;
        }
        var par = {
            epName: $("#epName").val(),
            orgCode: $("#orgCode").val(),
            mail: $("#mail").val(),
            name: $("#name").val()
        };
        //忘记密码
        Init.iwbhttp('/user/forgetPwd', par, function (data, header, config, status) {
            $scope.open(data.msg);
            if(data.resFlag == "0"){
                $("#sureBtn").attr("disabled",true);
            }
        }, function (data, header, config, status) {
        });
    }

    //返回
    $scope.back = function () {
        $state.go("login");
    }

    //提示modal
    $scope.open = function (content, data) {
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
