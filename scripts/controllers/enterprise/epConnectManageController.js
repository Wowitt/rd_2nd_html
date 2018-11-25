/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('EpConnectManageCtrl', ['$scope','Init','Modal','localStorageService','$timeout','$interval','CheckBrowser', function ($scope,Init,Modal,localStorageService,$timeout,$interval,CheckBrowser) {
    CheckBrowser.check();
    //人员类型
    $scope.personFlag = true;
    $scope.connectTitle = "现场处置人员";
    if(localStorageService.get("userType") == "epCs"){
        $scope.personFlag = false;
        $scope.connectTitle = "交接员";
    }

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";
    $scope.connectRow = 0;
    var par = {epId:localStorageService.get("epId")};
    $scope.connectData = new Array();
    //查询单位信息
    Init.iwbhttp('/enterprise/queryEnterpriseInfo', par, function (data, header, config, status) {
        $scope.connectData = data.connectData;
    }, function (data, header, config, status) {
    });

    //延迟任务，添加下拉框预选值
    var timer=$interval(function(){
        if($scope.connectData.length>0){
            for(var i=0;i<$scope.connectData.length;i++){
                //每行用户类型标签id
                var selectid = "#connectTypeT"+$scope.connectData[i].sort;
                $(selectid).val($scope.connectData[i].connectType);
            }
        }
        var table=document.getElementById("connectTable");
        if(table != null && table.rows != null){
            //交接员修改前行数
            $scope.connectBeforeRow = table.rows.length;
        }
        var count = 0;
        if($scope.connectData.length>0){
            for(var i=0;i<$scope.connectData.length;i++){
                //每行用户类型标签id
                var selectid = "#connectTypeT"+$scope.connectData[i].sort;
                if($(selectid).val() == $scope.connectData[i].connectType){
                    count ++;
                }
            }
            if(count == $scope.connectData.length){
                $interval.cancel(timer);
            }
        }
    },10);

    //交接员添加
    $scope.connectAdd = function () {
        var tableobj=document.getElementById("connectTable");
        var rowobj=tableobj.insertRow(tableobj.rows.length);
        var index = tableobj.rows.length - 3;
        //在table中新增一行
        var cell1=rowobj.insertCell(rowobj.cells.length);
        var cell2=rowobj.insertCell(rowobj.cells.length);
        var cell3=rowobj.insertCell(rowobj.cells.length);
        var cell4=rowobj.insertCell(rowobj.cells.length);
        var cell5=rowobj.insertCell(rowobj.cells.length);
        var cell6=rowobj.insertCell(rowobj.cells.length);
        var connectNameT = "connectNameT"+tableobj.rows.length;
        var connectTypeT = "connectTypeT"+tableobj.rows.length;
        var connectPersonIdT = "connectPersonIdT"+tableobj.rows.length;
        var connectCodePathT = "connectCodePathT"+tableobj.rows.length;
        cell1.innerHTML="<input type='text' id="+connectNameT+" class='form-control'>";
        cell2.innerHTML="<input type='text' class='form-control' value='交接员' readonly='readonly'>";
        cell3.innerHTML="<select class='form-control' id="+connectTypeT+"><option value='0'>请选择</option><option value='1'>现场处置人员</option><option value='2'>司机</option></select>";
        if(localStorageService.get("userType") == "epCs"){
            cell3.style.display = "none";
        }else{
            cell2.style.display = "none";
        }
        cell4.innerHTML="<a id='createCode' href='javascript:void(0);'>生成二维码</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='checkCode' href='javascript:void(0);'>查看二维码</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='delConnect' href='javascript:void(0);'>删除</a>";
        cell5.innerHTML="<input type='text' id="+connectPersonIdT+" class='form-control'>";
        cell5.style.display = "none";
        cell6.innerHTML="<input type='text' id="+connectCodePathT+" class='form-control'>";
        cell6.style.display = "none";
    }

    //交接员删除
    $('#connectTable tbody').on( 'click', 'tr', function () {
        if(this.rowIndex != 0 && this.rowIndex != 1){
            $(this).parent().find("tr.tablebg").toggleClass("tablebg");//取消原先选中行
            $(this).toggleClass("tablebg");//设定当前行为选中行
            $scope.connectRow = this.rowIndex;
        }
    });

    //删除交接员
    $('#connectTable tbody').on( 'click', '#delConnect', function () {
        $timeout(function () {
            var personName = document.getElementById("connectTable").rows[$scope.connectRow].cells[0].childNodes[0].value;
            var personId = document.getElementById("connectTable").rows[$scope.connectRow].cells[4].childNodes[0].value;
            var parm = {personId:personId,epId:localStorageService.get("epId"),personName:personName};
            var msg = "确定删除该用户？";
            url = 'views/modal/confirmModal.html';
            ctrlName = 'ConfirmModalCtrl';
            resolve = {
                content: function () {
                    return msg;
                },
                data: function () {
                    return parm;
                }
            };
            var modalInstance = Modal.modal(url, ctrlName, resolve, function (returnData) {
                Init.iwbhttp('/enterprise/delConnect', returnData, function (data, header, config, status) {
                    if(data.resFlag == "0"){
                        url = 'views/modal/promptModal.html';
                        ctrlName = 'PromptModalCtrl';
                        resolve = {
                            content: function () {
                                return data.msg;
                            },
                            data: function () {
                                return data;
                            }
                        };
                        var modalInstance = Modal.modal(url, ctrlName, resolve, function () {
                            var i = $scope.connectRow;
                            if(i == 0 || i == 1){
                                return;
                            }
                            var tableobj=document.getElementById("connectTable");
                            tableobj.deleteRow(i);
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
                                    return data;
                                }
                            }
                        });
                        modalInstance.result.then(function () {
                            //$log.info('success : ' + data.msg);
                            var i = $scope.connectRow;
                            if(i == 0 || i == 1){
                                return;
                            }
                            var tableobj=document.getElementById("connectTable");
                            tableobj.deleteRow(i);
                        }, function () {
                            //$log.info('error : ' + new Date());
                        });*/
                    }else{
                        if(data.resFlag == '3'){
                            data.msg = "删除成功！"
                        }
                        $scope.open(data.msg, data);
                    }
                }, function (data, header, config, status) {
                });
            }, function () {

            });
            /*var modalInstance = $modal.open({
                templateUrl: 'views/modal/confirmModal.html',
                controller: 'ConfirmModalCtrl',
                resolve: {
                    content: function () {
                        return msg;
                    },
                    data: function () {
                        return parm;
                    }
                }
            });
            modalInstance.result.then(function (returnData) {
                //$log.info('ensure : ' + data.msg);
                Init.iwbhttp('/enterprise/delConnect', returnData, function (data, header, config, status) {
                    if(data.resFlag == "0"){
                        var modalInstance = $modal.open({
                            templateUrl: 'views/modal/promptModal.html',
                            controller: 'PromptModalCtrl',
                            resolve: {
                                content: function () {
                                    return data.msg;
                                },
                                data: function () {
                                    return data;
                                }
                            }
                        });
                        modalInstance.result.then(function () {
                            //$log.info('success : ' + data.msg);
                            var i = $scope.connectRow;
                            if(i == 0 || i == 1){
                                return;
                            }
                            var tableobj=document.getElementById("connectTable");
                            tableobj.deleteRow(i);
                        }, function () {
                            //$log.info('error : ' + new Date());
                        });
                    }else{
                        if(data.resFlag == '3'){
                            data.msg = "删除成功！"
                        }
                        $scope.open(data.msg, data);
                    }
                }, function (data, header, config, status) {
                });
            }, function () {
                //$log.info('cancel : ' + new Date());
            });*/
        }, 500);
    });

    //保存
    $scope.save = function (){
        var connects = new Array();
        var table=document.getElementById("connectTable");
        var row = table.rows.length;
        for(var i=2; i<row; i++){
            var index1 = connects.length;
            var connectName = table.rows[i].cells[0].childNodes[0].value;
            var connectType = table.rows[i].cells[1].childNodes[0].value;
            if(localStorageService.get("userType") == "epCz"){
                connectType = table.rows[i].cells[2].childNodes[0].value;
            }
            var connectPersonId = table.rows[i].cells[4].childNodes[0].value;
            var connectCodePath = table.rows[i].cells[5].childNodes[0].value;
            if(connectName != undefined){
                var flag1 = false;
                var flag2 = false;
                if(localStorageService.get("userType") == "epCs"){
                    flag1 = connectName != null && connectName != "";
                    flag2 = connectName == null || connectName == "";
                }else{
                    flag1 = connectName != null && connectName != "" && connectType != null && connectType != ""  && connectType != 0;
                    flag2 = (connectName == null || connectName == "") && (connectType == null || connectType == "" || connectType == 0);
                }
                if(flag1){
                    connects[index1] = new Object();
                    for(var j=0; j<index1; j++){
                        if(connects[j].connectName == connectName){
                            $scope.content = $scope.connectTitle+"名称不能重复";
                            $scope.open($scope.content);
                            return;
                        }
                    }
                    var patrn=/^(?!_)(?!.*?_$)[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
                    if (!patrn.exec(connectName)){
                        $scope.open($scope.connectTitle + "名称输入不正确，请重新输入");
                        return;
                    }else{
                        connectName = $.trim(connectName);
                    }
                    connects[index1].connectName = connectName;
                    connects[index1].connectCodePath = connectCodePath;
                    if(localStorageService.get("userType") == "epCs"){
                        connects[index1].connectType = "1";
                    }else{
                        connects[index1].connectType = connectType;
                    }
                    if(connectPersonId != null && connectPersonId != ""){
                        connects[index1].personId = connectPersonId;
                    }else{
                        connects[index1].personId = "";
                    }
                    if(connects[index1].connectName.length > 33){
                        $scope.content = $scope.connectTitle+"名称太长";
                        $scope.open($scope.content);
                        return;
                    }
                }else if(flag2){
                }else{
                    $scope.content = "请完善"+$scope.connectTitle+"信息";
                    $scope.open($scope.content);
                    return;
                }
            }
        }
        var par = {
            epId: localStorageService.get("epId"),
            connects:connects
        };
        Init.iwbhttp('/enterprise/connectManage', par, function (data, header, config, status) {
            $scope.open(data.msg);
            var connectList = new Array;
            connectList = data.connectList;
            for(var i=2; i<row; i++){
                for(var j=0; j<connectList.length; j++){
                    if(document.getElementById("connectTable").rows[i].cells[0].childNodes[0].value == connectList[j].personName){
                        document.getElementById("connectTable").rows[i].cells[4].childNodes[0].value = connectList[j].personId;
                    }
                }
            }
        }, function (data, header, config, status) {
        });
    }

    //生成二维码
    $('#connectTable tbody').on( 'click', '#createCode', function () {
        $timeout(function () {
            var personName = document.getElementById("connectTable").rows[$scope.connectRow].cells[0].childNodes[0].value;
            var personId = document.getElementById("connectTable").rows[$scope.connectRow].cells[4].childNodes[0].value;
            var para = {};
            if(localStorageService.get("userType") == "epCs"){
                para = {
                    "roleType":"5",
                    "EN_ID_CS":localStorageService.get("epId"),
                    "EN_NAME_CS":localStorageService.get("epName"),
                    "CS_PERSON_ID":personId,
                    "CS_PERSON_NAME":personName
                }
            }else{
                var role = document.getElementById("connectTable").rows[$scope.connectRow].cells[2].childNodes[0].value;
                if(role == "1"){
                    para = {
                        "roleType":"0",
                        "EN_ID_CZ":localStorageService.get("epId"),
                        "EN_NAME_CZ":localStorageService.get("epName"),
                        "CZ_PERSON_ID":personId,
                        "CZ_PERSON_NAME":personName
                    }
                }else{
                    para = {
                        "roleType":"1",
                        "EN_ID_CZ":localStorageService.get("epId"),
                        "EN_NAME_CZ":localStorageService.get("epName"),
                        "CZ_DRIVER_ID":personId,
                        "CZ_DRIVER_NAME":personName
                    }
                }
            }
            Init.iwbhttp('/enterprise/createCodeInfo', para, function (data, header, config, status) {
                $scope.open(data.msg);
                if(data.resFlag == "0"){
                    document.getElementById("connectTable").rows[$scope.connectRow].cells[5].childNodes[0].value = data.codePath;
                }
            }, function (data, header, config, status) {
            });
        }, 500);
    });

    //查看二维码
    $('#connectTable tbody').on( 'click', '#checkCode', function () {
        $timeout(function () {
            var personName = document.getElementById("connectTable").rows[$scope.connectRow].cells[0].childNodes[0].value;
            var personId = document.getElementById("connectTable").rows[$scope.connectRow].cells[4].childNodes[0].value;
            var para = {};
            if(localStorageService.get("userType") == "epCs"){
                para = {
                    tablename:"WOBO_PERSON_CS",
                    epId:localStorageService.get("epId"),
                    personId:personId,
                    personName:personName
                };
            }else{
                para = {
                    tablename:"WOBO_PERSON_CZ",
                    epId:localStorageService.get("epId"),
                    personId:personId,
                    personName:personName
                };
            }
            Init.iwbhttp('/enterprise/queryCodeInfo', para, function (data, header, config, status) {
                if(data.resFlag == "0"){
                    if(data.path == ""){
                        $scope.open("该人员还未生成二维码！");
                    }else{
                        url = 'views/dashboard/enterprise/checkCodeModal.html';
                        ctrlName = 'CheckCodeModalCtrl';
                        resolve = {
                            path: function () {
                                return data.path;
                            }
                        };
                        var modalInstance = Modal.modal(url, ctrlName, resolve, function () {

                        }, function () {

                        });
                        /*var modalInstance = $modal.open({
                            templateUrl: 'views/dashboard/enterprise/checkCodeModal.html',
                            controller: 'CheckCodeModalCtrl',
                            resolve: {
                                path: function () {
                                    return data.path;
                                }
                            }
                        });
                        modalInstance.result.then(function () {
                            //$log.info('success : ' + new Date());
                        }, function () {
                            //$log.info('error : ' + new Date());
                        });*/
                    }
                }else{
                    $scope.open(data.msg);
                }
            }, function (data, header, config, status) {
            });
        }, 500);
    });

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
            if(data != undefined && data != null && data != "") {
                if (data.resFlag == "3") {
                    var i = $scope.connectRow;
                    if (i == 0 || i == 1) {
                        return;
                    }
                    var tableobj = document.getElementById("connectTable");
                    tableobj.deleteRow(i);
                }
            }
        }, function () {

        });
        /*var modalInstance = $modal.open({
            templateUrl: 'views/modal/promptModal.html',
            controller: 'PromptModalCtrl',
            resolve: {
                content: function () {
                    return content;
                },
                data: function () {
                    return data;
                }
            }
        });
        modalInstance.result.then(function () {
            if(data != undefined && data != null && data != "") {
                if (data.resFlag == "3") {
                    var i = $scope.connectRow;
                    if (i == 0 || i == 1) {
                        return;
                    }
                    var tableobj = document.getElementById("connectTable");
                    tableobj.deleteRow(i);
                }
            }
        }, function () {
            //$log.info('error : ' + new Date());
        });*/
    };

}]);