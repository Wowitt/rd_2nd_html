/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('RoleInfoCtrl', ['$scope','Init','Modal','$state','localStorageService','$stateParams','CheckBrowser', function ($scope,Init,Modal,$state,localStorageService,$stateParams,CheckBrowser) {
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
    //角色id
    $scope.roleId = $stateParams.roleId;
    //角色状态
    $scope.statusList = [
        {"id":"0","name":"请选择"},
        {"id":"1","name":"保存"},
        {"id":"2","name":"启用"}
    ];
    $scope.status = $scope.statusList[0];
    //删除按钮是否显示标志
    $scope.delFlag = false;
    if($scope.roleId != null && $scope.roleId != ""){
        //角色信息
        Init.iwbhttp('/role/queryRoleInfo', {roleId:$scope.roleId}, function (data, header, config, status) {
            if(data.resFlag == "0"){
                $scope.delFlag = true;
                $scope.roleName = data.roleInfo.NAME;
                if(data.roleInfo.STATUS != null && !angular.equals("",data.roleInfo.STATUS)){
                    for(var i=0;i<$scope.statusList.length;i++){
                        if(angular.equals($scope.statusList[i].id,data.roleInfo.STATUS)){
                            $scope.status = $scope.statusList[i];
                            break;
                        }
                    }
                }
            }else{
                $scope.open(data.msg);
            }
        }, function (data, header, config, status) {
        });
    }


    //返回
    $scope.back = function(){
        $state.go("dashboard.roleIndex.roleList");
    }

    //保存方法
    $scope.save = function () {
        var par = {};
        if($("#roleName").val() == null || angular.equals("", $("#roleName").val())){
            $scope.content = "角色名称不能为空";
            $scope.open($scope.content);
            return;
        }
        var patrn=/^[\u4e00-\u9fa5a-zA-Z]+$/;
        if (!patrn.exec($("#roleName").val())){
            $scope.open("角色名称输入不正确，请重新输入");
            return;
        }
        if($("#roleName").val().length > 33){
            $scope.content = "角色名称太长";
            $scope.open($scope.content);
            return;
        }
        if($scope.delFlag){
            if($scope.status.id == null || angular.equals("0", $scope.status.id)){
                $scope.content = "请选择角色状态";
                $scope.open($scope.content);
                return;
            }
            par = {
                roleId:$scope.roleId,
                roleName:$("#roleName").val(),
                status:$scope.status.id
            };
        }else{
            par = {
                roleId:"",
                roleName:$("#roleName").val()
            };
        }
        //新增或修改角色
        Init.iwbhttp('/role/addOrUpdateRole', par, function (data, header, config, status) {
            if(angular.equals("0",data.resFlag)){
                url = 'views/modal/promptModal.html';
                ctrlName = 'PromptModalCtrl';
                resolve = {
                    content: function () {
                        return data.msg;
                    },
                    data: function () {
                        return "";
                    }
                };
                var modalInstance = Modal.modal(url, ctrlName, resolve, function () {
                    $scope.roleId = data.roleId;
                    if(!$scope.delFlag){
                        $scope.delFlag = true;
                        $scope.status = $scope.statusList[1];
                    }
                }, function () {

                });
                /*var modalInstance = $modal.open({
                    templateUrl: 'views/modal/promptModal.html',
                    controller: 'PromptModalCtrl',
                    resolve: {
                        content: function () {
                            return data.msg;
                        },
                        data: function () {
                            return "";
                        }
                    }
                });
                modalInstance.result.then(function () {
                    $scope.roleId = data.roleId;
                    if(!$scope.delFlag){
                        $scope.delFlag = true;
                        $scope.status = $scope.statusList[1];
                    }
                }, function () {
                });*/
            }else{
                $scope.open(data.msg);
            }
        }, function (data, header, config, status) {
        });
    }

    //删除方法
    $scope.delete = function () {
        Init.iwbhttp('/role/delRole', {roleId:$scope.roleId}, function (data, header, config, status) {
            if(angular.equals("0",data.resFlag)){
                data.url = "dashboard.roleIndex.roleList";
            }
            $scope.open(data.msg,data);
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
