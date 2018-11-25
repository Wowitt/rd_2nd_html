/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('ModifyPwdCtrl', ['$scope','Init','Modal','localStorageService','$state', function ($scope,Init,Modal,localStorageService,$state) {
    $scope.data = {};
    $scope.data.msg = "";

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    //验证表单
    $scope.save = function(){
        if(!($("#oldPwd").val() && $("#newPwd").val() && $("#rePwd").val())){
            $scope.data.msg = "请填写完整";
            $scope.open($scope.data.msg, $scope.data);
        }else if ($("#newPwd").val() != $("#rePwd").val()) {
            $scope.data.msg = "两次密码不一致";
            $scope.open($scope.data.msg, $scope.data);
        }else if ($("#oldPwd").val() == $("#newPwd").val()) {
            $scope.data.msg = "新旧密码不能一致";
            $scope.open($scope.data.msg, $scope.data);
        }else{
            var par = "";
            if(localStorageService.get('IWBSESSION') != undefined && localStorageService.get('IWBSESSION') != null && !angular.equals("", localStorageService.get('IWBSESSION'))){
                par = {
                    "userId":localStorageService.get('userId'),
                    "userType":localStorageService.get('userType'),
                    "nickName":localStorageService.get('nickName'),
                    "oldPwd":$("#oldPwd").val(),
                    "newPwd":$("#newPwd").val()
                };
                //修改密码
                Init.iwbhttp('/user/modifyPwd', par, function (data, header, config, status) {
                    $scope.open(data.msg, data);
                }, function (data, header, config, status) {
                });
            }else{
                $scope.open("登录超时，请重新登录");
            }
        }
    };

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
            if(angular.equals("登录超时，请重新登录", content)){
                $state.go("login", {}, {reload : true});
            }
        }, function () {

        });
    };

}]);