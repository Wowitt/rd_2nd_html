/**
 * Created by admin on 2017/7/11.
 */
'use strict';
angular.module('sbAdminApp').controller('batchOperationController', ['$scope','Init','Modal', function ($scope,Init,Modal) {
    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";
    $scope.execSql=function()
    {
        if($scope.pwd == "" || $scope.pwd == null )
        {
            $scope.open('请输入执行密码!');
            return;
        }
        if($scope.sql == "" || $scope.sql == null )
        {
            $scope.open('请输入执行语句!');
            return;
        }
        if($scope.sql.indexOf('#') != 0)
        {
            $scope.open('执行语句格式非法！');
            return;
        }
        Init.iwbhttp('/executeSql/getExeSqlCodeKey', {}, function (data, header, config, status) {
            if(data.resFlag == "0"){
                var exeSqlCodeKey=data.exeSqlCodeKey;
                if($scope.pwd != exeSqlCodeKey)
                {
                    $scope.open('执行密码错误不允许操作!');
                    return;
                }
                //DES加密
                var keyHex = CryptoJS.enc.Utf8.parse(exeSqlCodeKey+"!@#$%");
                var encrypted = CryptoJS.DES.encrypt($scope.sql, keyHex, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                var desSql = encrypted.toString();
                //base64加密
                var str = CryptoJS.enc.Utf8.parse(desSql);
                var base64 = CryptoJS.enc.Base64.stringify(str);
                Init.iwbhttp('/executeSql/executeSql', {sql:base64}, function (data, header, config, status) {
                    if(data.resFlag == "0"){
                        $scope.influenceRows=data.influenceRows;
                        var tableHtml=data.tableHtml == undefined ? "" : data.tableHtml;
                        document.getElementById("queryList").innerHTML=tableHtml;
                    }else{
                        $scope.open(data.msg);
                    }
                }, function (data, header, config, status) {
                });
            }else{
                $scope.open(data.msg);
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
