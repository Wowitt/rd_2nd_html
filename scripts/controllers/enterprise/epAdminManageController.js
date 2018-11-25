/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('EpAdminManageCtrl', ['$scope','Init','$state','localStorageService','$timeout','$interval','CheckBrowser','$stateParams','Modal', function ($scope,Init,$state,localStorageService,$timeout,$interval,CheckBrowser,$stateParams,Modal) {
    CheckBrowser.check();
    $scope.adminData = new Array();
    $scope.checkBtnFlag = false;
    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";
    //待完成、已完成标志位
    var action = "";
    //返回按钮是否显示标志位
    $scope.backBtnFlag = false;
    $scope.hideDelBtn = false;
    if($stateParams.from != null && $stateParams.from != ""){
        $("#saveBtn").attr("disabled",!$stateParams.btnFlag);
        $("#submitBtn").attr("disabled",!$stateParams.btnFlag);
        $scope.backBtnFlag = true;
        if($stateParams.from == "dashboard.unfinishedTaskIndex.unfinishedTaskList"){
            action = "unfinished";
        }else if($stateParams.from == "dashboard.finishedTaskIndex.finishedTaskList"){
            action = "finished";
            $scope.hideDelBtn = true;
        }
    }
    if($stateParams.applyId != undefined && $stateParams.applyId != null && $stateParams.applyId != ""){
        $scope.applyId = $stateParams.applyId;
    }
    var par = {epId:localStorageService.get("epId"),action:action, applyId:$stateParams.applyId};
    //查询单位管理员信息
    Init.iwbhttp('/enterprise/queryAdminInfo', par, function (data, header, config, status) {
        $scope.adminData = data.adminData;
        if($stateParams.from == null || $stateParams.from == ""){
            $("#saveBtn").attr("disabled",data.adminInfo.btnFlag);
            $("#submitBtn").attr("disabled",data.adminInfo.btnFlag);
            $scope.hideDelBtn = data.adminInfo.btnFlag;
        }
        if(data.adminInfo.applyId != null && data.adminInfo.applyId != ""){
            $scope.checkBtnFlag = true;
            if($scope.applyId == null || $scope.applyId == ""){
                $scope.applyId = data.adminInfo.applyId;
            }
        }
    }, function (data, header, config, status) {
    });

    //延迟任务，确定启动和禁用按钮显示
    var timer=$interval(function(){
        if($scope.adminData.length>0){
            var count = 0;
            for(var i=0;i<$scope.adminData.length;i++){
                //每行启动按钮id
                var qid = "#q"+$scope.adminData[i].userId;
                //每行禁用按钮id
                var jid = "#j"+$scope.adminData[i].userId;
                if($(jid).is(":hidden") != $(qid).is(":hidden")){
                    count ++;
                }else{
                    if($scope.adminData[i].btnFlag){
                        $(jid).hide();
                        $(qid).show();
                    }else{
                        $(jid).show();
                        $(qid).hide();
                    }
                }
            }
            if(count == $scope.adminData.length){
                $interval.cancel(timer);
            }
        }
    },10);

    //管理员添加
    $scope.adminAdd = function () {
        var tableobj=document.getElementById("adminTable");
        var rowobj=tableobj.insertRow(tableobj.rows.length);
        var index = tableobj.rows.length - 3;
        if(index >= 8){
            $scope.open("最多只能添加八个管理员！");
            return;
        }
        var adminPersonId = "00000" + (index+1);
        var cell1=rowobj.insertCell(rowobj.cells.length);
        var cell2=rowobj.insertCell(rowobj.cells.length);
        var cell3=rowobj.insertCell(rowobj.cells.length);
        var cell4=rowobj.insertCell(rowobj.cells.length);
        var cell5=rowobj.insertCell(rowobj.cells.length);
        var cell6=rowobj.insertCell(rowobj.cells.length);
        var adminNameT = "adminNameT"+tableobj.rows.length;
        var adminPwdT = "adminPwdT"+tableobj.rows.length;
        var adminUserIdT = "adminUserIdT"+tableobj.rows.length;
        var adminPersonIdT = "adminPersonIdT"+tableobj.rows.length;
        cell1.innerHTML="<input type='text' id="+adminNameT+" class='form-control'>";
        cell2.innerHTML="<input type='password' id="+adminPwdT+" class='form-control'>";
        cell3.innerHTML="";
        cell4.innerHTML="<a id='delAdmin' href='javascript:void(0);'>删除</a>";
        cell5.innerHTML="<input type='text' id="+adminUserIdT+" class='form-control'>";
        cell6.innerHTML="<input type='text' id="+adminPersonIdT+" class='form-control' value="+adminPersonId+">";
        cell3.style.display = "none";
        cell5.style.display = "none";
        cell6.style.display = "none";
    }

    //启动和禁用方法
    $scope.adminManage = function(userId, status){
        var parm = {"userId":userId, "status":status};
        //每行启动按钮id
        var qid = "#q"+userId;
        //每行禁用按钮id
        var jid = "#j"+userId;
        var statusPar = status;
        Init.iwbhttp('/enterprise/adminManage', parm, function (data, header, config, status) {
            $scope.open(data.msg);
            if(data.resFlag == "0"){
                if(angular.equals("1",statusPar)){
                    $(jid).show();
                    $(qid).hide();
                }else{
                    $(jid).hide();
                    $(qid).show();
                }
            }
        }, function (data, header, config, status) {
        });
    }

    //重置密码
    $scope.resetPwd = function(userId){
        Init.iwbhttp('/enterprise/resetPwd', {userId:userId}, function (data, header, config, status) {
            $scope.open(data.msg);
        }, function (data, header, config, status) {
        });
    }

    //获取选中行
    $('#adminTable tbody').on( 'click', 'tr', function () {
        $(this).parent().find("tr.tablebg").toggleClass("tablebg");//取消原先选中行
        $(this).toggleClass("tablebg");//设定当前行为选中行
        $scope.adminRow = this.rowIndex;
    });

    //删除未通过验证管理员
    $('#adminTable tbody').on( 'click', '#delAdmin', function () {
        $timeout(function () {
            var userId = document.getElementById("adminTable").rows[$scope.adminRow].cells[4].childNodes[0].value;
            var msg = "确定删除该用户？";
            var parm = {userId:userId};
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
                Init.iwbhttp('/enterprise/adminDel', returnData, function (data, header, config, status) {
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
                            var i = $scope.adminRow;
                            if(i == 0 || i == 1){
                                return;
                            }
                            var tableobj=document.getElementById("adminTable");
                            tableobj.deleteRow(i);
                        }, function () {

                        });
                    }else{
                        if(data.resFlag == '3'){
                            data.msg = "删除成功！"
                        }
                        $scope.open(data.msg,data);
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
                Init.iwbhttp('/enterprise/adminDel', returnData, function (data, header, config, status) {
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
                            var i = $scope.adminRow;
                            if(i == 0 || i == 1){
                                return;
                            }
                            var tableobj=document.getElementById("adminTable");
                            tableobj.deleteRow(i);
                        }, function () {
                            //$log.info('error : ' + new Date());
                        });
                    }else{
                        if(data.resFlag == '3'){
                            data.msg = "删除成功！"
                        }
                        $scope.open(data.msg,data);
                    }
                }, function (data, header, config, status) {
                });
            }, function (returnData) {
                //$log.info('cancel : ' + returnData);
            });*/
        }, 500);
    });

    //生成二维码
    $scope.createCodeInfo = function (userId,personId,personName){
        var para = {};
        if(localStorageService.get("userType") == "epCs"){
            para = {
                "roleType":"3",
                "EN_ID_CS":localStorageService.get("epId"),
                "EN_NAME_CS":localStorageService.get("epName"),
                "USERID":userId,
                "CS_PERSON_ID":personId,
                "CS_PERSON_NAME":personName
            }
        }else{
            para = {
                "roleType":"4",
                "EN_ID_CZ":localStorageService.get("epId"),
                "EN_NAME_CZ":localStorageService.get("epName"),
                "USERID":userId,
                "CZ_PERSON_ID":personId,
                "CZ_PERSON_NAME":personName
            }
        }
        Init.iwbhttp('/enterprise/createCodeInfo', para, function (data, header, config, status) {
            $scope.open(data.msg);
            if(data.resFlag == "0"){

            }else{

            }
        }, function (data, header, config, status) {
        });
    }

    //查看二维码
    $scope.checkCodeInfo = function (personId,personName){
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
                        $log.info('success : ' + new Date());
                    }, function () {
                        $log.info('error : ' + new Date());
                    });*/
                }
            }else{
                $scope.open(data.msg);
            }
        }, function (data, header, config, status) {
        });
    }

    //保存管理员信息
    $scope.save = function (){
        var admins = new Array();
        for(var i=3; i<11; i++){
            var index = admins.length;
            var adminName = "#adminNameT"+i;
            var adminPwd = "#adminPwdT"+i;
            var adminUserId = "#adminUserIdT"+i;
            var adminPersonId = "#adminPersonIdT"+i;
            if($(adminName).val() != undefined){
                if($(adminName).val() != null && $(adminName).val() != "" && $(adminPwd).val() != null && $(adminPwd).val() != ""){
                    admins[index] = new Object();
                    for(var j=0; j<index; j++){
                        if(admins[j].adminName == $(adminName).val()){
                            $scope.content = "管理员名称不能重复";
                            $scope.open($scope.content);
                            return;
                        }
                    }
                    admins[index].adminName = $(adminName).val();
                    admins[index].adminPwd = $(adminPwd).val();
                    if($(adminUserId).val() != null && $(adminUserId).val() != ""){
                        admins[index].userId = $(adminUserId).val();
                    }else{
                        admins[index].userId = "";
                    }
                    if($(adminPersonId).val() != null && $(adminPersonId).val() != ""){
                        admins[index].personId = $(adminPersonId).val();
                    }else{
                        admins[index].personId = "";
                    }
                    if(admins[index].adminName.length > 33){
                        $scope.content = "管理员名称太长";
                        $scope.open($scope.content);
                        return;
                    }
                    if($.trim(admins[index].adminName).length <= 0){
                        $scope.content = "管理员名称不能为空或空格";
                        $scope.open($scope.content);
                        return;
                    }
                    var patrn=/^(?!_)(?!.*?_$)[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
                    if (!patrn.exec(admins[index].adminName)){
                        $scope.open("管理员名称输入不正确，请重新输入");
                        return;
                    }else{
                        admins[index].adminName = $.trim(admins[index].adminName);
                    }
                    var patrn=/^[A-Za-z0-9]+$/;
                    if (!patrn.exec(admins[index].adminPwd) || admins[index].adminPwd.length <5 || admins[index].adminPwd.length >18){
                        $scope.open("密码为5-18位大小写字母和数字组成");
                        return;
                    }
                }else if(($(adminName).val() == null || $(adminName).val() == "") && ($(adminPwd).val() == null || $(adminPwd).val() == "")){
                }else{
                    $scope.content = "请完善管理员信息";
                    $scope.open($scope.content);
                    return;
                }
            }
        }
        var par = {
            admins:admins,
            epId:localStorageService.get("epId"),
            epName:localStorageService.get("epName"),
            belongHbj:localStorageService.get("belongSepa"),
            action:"modifyAdmin"
        };
        //修改管理员信息
        Init.iwbhttp('/enterprise/modifyAdminInfo', par, function (data, header, config, status) {
            $scope.open(data.msg);
            if(data.resFlag == "0"){
                var adminList = new Array();
                adminList = data.adminList;
                $scope.applyId = data.applyId;
                var table=document.getElementById("adminTable");
                var row = table.rows.length;
                for(var i=2; i<row; i++){
                    for(var j=0; j<adminList.length; j++){
                        if(document.getElementById("adminTable").rows[i].cells[0].childNodes[0].value == adminList[j].name){
                            document.getElementById("adminTable").rows[i].cells[4].childNodes[0].value = adminList[j].userId;
                        }
                    }
                }
            }
        }, function (data, header, config, status) {
        });
    }

    //提交管理员信息
    $scope.submit = function (){
        var admins = new Array();
        for(var i=3; i<11; i++){
            var index = admins.length;
            //console.log("index===>"+index);
            var adminName = "#adminNameT"+i;
            var adminPwd = "#adminPwdT"+i;
            var adminUserId = "#adminUserIdT"+i;
            var adminPersonId = "#adminPersonIdT"+i;
            //console.log(adminName+"===>"+$(adminName).val());
            if($(adminName).val() != undefined){
                if($(adminName).val() != null && $(adminName).val() != "" && $(adminPwd).val() != null && $(adminPwd).val() != ""){
                    admins[index] = new Object();
                    for(var j=0; j<index; j++){
                        //console.log("admins[j].adminName===>"+admins[j].adminName);
                        //console.log("adminName===>"+adminName);
                        if(admins[j].adminName == $(adminName).val()){
                            $scope.content = "管理员名称不能重复";
                            $scope.open($scope.content);
                            return;
                        }
                    }
                    admins[index].adminName = $(adminName).val();
                    admins[index].adminPwd = $(adminPwd).val();
                    if($(adminUserId).val() != null && $(adminUserId).val() != ""){
                        admins[index].userId = $(adminUserId).val();
                    }else{
                        admins[index].userId = "";
                    }
                    if($(adminPersonId).val() != null && $(adminPersonId).val() != ""){
                        admins[index].personId = $(adminPersonId).val();
                    }else{
                        admins[index].personId = "";
                    }
                    if(admins[index].adminName.length > 33){
                        $scope.content = "管理员名称太长";
                        $scope.open($scope.content);
                        return;
                    }
                    if($.trim(admins[index].adminName).length <= 0){
                        $scope.content = "管理员名称不能为空或空格";
                        $scope.open($scope.content);
                        return;
                    }
                    var patrn=/^(?!_)(?!.*?_$)[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
                    if (!patrn.exec(admins[index].adminName)){
                        $scope.open("管理员名称输入不正确，请重新输入");
                        return;
                    }else{
                        admins[index].adminName = $.trim(admins[index].adminName);
                    }
                    var patrn=/^[A-Za-z0-9]+$/;
                    if (!patrn.exec(admins[index].adminPwd) || admins[index].adminPwd.length <5 || admins[index].adminPwd.length >18){
                        $scope.open("密码为5-18位大小写字母和数字组成");
                        return;
                    }
                }else if(($(adminName).val() == null || $(adminName).val() == "") && ($(adminPwd).val() == null || $(adminPwd).val() == "")){
                }else{
                    $scope.content = "请完善管理员信息";
                    $scope.open($scope.content);
                    return;
                }
            }
        }
        var par = {
            admins:admins,
            epId:localStorageService.get("epId"),
            epName:localStorageService.get("epName"),
            belongHbj:localStorageService.get("belongSepa"),
            action:"modifyAdmin"
        };
        Init.iwbhttp('/enterprise/submitModifyAdminInfo', par, function (data, header, config, status) {
            $scope.open(data.msg);
            if(data.resFlag == "0"){
                $("#saveBtn").attr("disabled",true);
                $("#submitBtn").attr("disabled",true);
                $scope.btnFlag = true;
                $scope.hideDelBtn = true;
            }
        }, function (data, header, config, status) {
        });
    }

    //查看审批记录
    $scope.check = function (){
        var applyId = $scope.applyId;
        url = 'views/dashboard/admin/approveDetailModal.html';
        ctrlName = 'ApproveDetailModalCtrl';
        resolve = {
            applyId: function () {
                return applyId;
            }
        };
        var modalInstance = Modal.modal(url, ctrlName, resolve, function () {

        }, function () {

        });
        /*var modalInstance = $modal.open({
            templateUrl: 'views/dashboard/admin/approveDetailModal.html',
            controller: 'ApproveDetailModalCtrl',
            resolve: {
                applyId: function () {
                    return applyId;
                }
            }
        });
        modalInstance.result.then(function () {
            //$log.info('success : ' + content);
        }, function () {
            //$log.info('error : ' + new Date());
        });*/
    }

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
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
            if(data != undefined && data != null && data != ""){
                if(data.resFlag == '3'){
                    var i = $scope.adminRow;
                    if(i == 0 || i == 1){
                        return;
                    }
                    var tableobj=document.getElementById("adminTable");
                    tableobj.deleteRow(i);
                }
            }
        }, function () {

        });
    };
}]);
