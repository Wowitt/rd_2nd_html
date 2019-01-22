/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('EnterpriseManageCtrl', ['$scope','Init','Modal','$state','localStorageService','$interval','CheckBrowser','$stateParams', function ($scope,Init,Modal,$state,localStorageService,$interval,CheckBrowser,$stateParams) {
    CheckBrowser.check();
    //车辆添加模块是否显示
    $scope.carFlag = true;
    $scope.ADFlag = true;
    $scope.connectTitle = "现场处置人员";
    if(localStorageService.get("userType") == "epCs"){
        $scope.carFlag = false;
        $scope.connectTitle = "交接员";
    }
    $scope.orgTypeFlag = false;
    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";
    //管理员用户数据
    $scope.adminData = new Array();
    //单位名称
    $scope.epName = localStorageService.get("epName");
    //单位代码
    $scope.epCode = localStorageService.get("epCode");
    //所属区域信息
    $scope.areas = new Array();
    //所属市区信息
    $scope.cities = new Array();
    //所属环保局信息
    $scope.hbjList = new Array();
    //医疗机构等级
    $scope.hospitalGradeList = new Array();
    $scope.belongCity = $scope.cities[0];
    //单位类型选项
    $scope.orgTypes = [
        {"value":"0","type":"请选择"},
        {"value":"1","type":"是"},
        {"value":"2","type":"否"}
    ];

    //交接员类型
    $scope.connectPersons = [
        {"value":"0","personName":"请选择"},
        {"value":"1","personName":"现场处置人员"},
        {"value":"2","personName":"司机"}
    ];
    //获取车辆类型
    $scope.carType = new Array();
    Init.iwbhttp('/enterprise/queryCarType', {}, function (data, header, config, status) {
        $scope.carType = data.carTypeList;
        $scope.id = $scope.carType[0];
    }, function (data, header, config, status) {
    });

    //拼接select下拉框
    function spellStr(carTypeT){
        var str = "";
        if($scope.carType.length > 0){
            str = "<select id='" + carTypeT + "' class='form-control'>";
            for(var i = 0; i < $scope.carType.length; i ++){
                str += "<option value='" + $scope.carType[i].value + "'>" + $scope.carType[i].name + "</option>";
            }
            str += "</select>";
        }
        return str;
    }

    //中转单位信息
    $scope.belongOrgs = new Array();
    //交接员信息
    $scope.connectData = new Array();
    //车辆信息
    $scope.carData = new Array();
    //单位ID
    $scope.epId = "";
    //单位类型
    $scope.epType = "";
    $scope.adminRow = 0;
    $scope.connectRow = 0;
    $scope.carRow = 0;
    //审批记录按钮是否显示
    $scope.checkBtnFlag = false;
    //返回按钮和查看审批过程按钮是否显示
    $scope.backBtnFlag = false;
    if($stateParams.from != null && $stateParams.from != ""){
        $scope.backBtnFlag = true;
    }
    var par = {epId:localStorageService.get("epId")};
    //查询单位信息
    Init.iwbhttp('/enterprise/queryEnterpriseInfo', par, function (data, header, config, status) {
        if(data.resFlag == "0"){
            //查询成功，给页面赋值
            $scope.adminData = data.adminData;
            $scope.connectData = data.connectData;
            $scope.carData = data.carData;
            $scope.belongOrgs = data.transferOrgData;
            $scope.epId = data.epInfo.epId;
            $scope.epName = data.epInfo.epName;
            $scope.epType =  data.epInfo.epType;
            $scope.epCode = data.epInfo.orgCode;
            $scope.linkMan = data.epInfo.linkMan;
            $scope.belongStreet = data.epInfo.belongStreet;
            $scope.applyId = data.epInfo.applyId;
            if($scope.applyId != null && $scope.applyId != ""){
                $scope.checkBtnFlag = true;
            }
            $scope.areas = data.areaList;
            $scope.cities = data.cityList;
            $scope.hbjList = data.areaList;
            $scope.hospitalGradeList = data.hospitalGradeList;
            if(data.epInfo.belongCity != null && !angular.equals("",data.epInfo.belongCity)){
                for(var i=0;i<$scope.cities.length;i++){
                    if(angular.equals($scope.cities[i].value,data.epInfo.belongCity)){
                        $scope.belongCity = $scope.cities[i];
                        break;
                    }
                }
            }else{
                $scope.belongCity = $scope.cities[0];
            }
            if(data.epInfo.belongArea != null && !angular.equals("",data.epInfo.belongArea)){
                for(var i=0;i<$scope.areas.length;i++){
                    if(angular.equals($scope.areas[i].value,data.epInfo.belongArea)){
                        $scope.belongArea = $scope.areas[i];
                        break;
                    }
                }
            }else{
                $scope.belongArea = $scope.areas[0];
            }
            if(data.epInfo.belongSepa != null && !angular.equals("",data.epInfo.belongSepa)){
                for(var i=0;i<$scope.hbjList.length;i++){
                    if(angular.equals($scope.hbjList[i].value,data.epInfo.belongSepa)){
                        $scope.belongSepa = $scope.hbjList[i];
                        break;
                    }
                }
            }else{
                $scope.belongSepa = $scope.hbjList[0];
            }
            $scope.contancts = data.epInfo.contancts;
            $scope.tel = data.epInfo.tel;
            $scope.mobilephone = data.epInfo.mobilephone;
            $scope.postalCode = data.epInfo.postalCode;
            $scope.eMail = data.epInfo.eMail;
            $scope.longitude = data.epInfo.longitude;
            $scope.latitude = data.epInfo.latitude;
            if(data.epInfo.step != null && !angular.equals("",data.epInfo.step)){
                for(var i=0;i<$scope.hospitalGradeList.length;i++){
                    if(angular.equals($scope.hospitalGradeList[i].value,data.epInfo.step)){
                        $scope.step = $scope.hospitalGradeList[i];
                        break;
                    }
                }
            }else{
                $scope.step = $scope.hospitalGradeList[0];
            }
            if(data.epInfo.orgType == "0"){
                $scope.orgCheckT = true;
                $scope.orgCheckF = false;
                $scope.orgType = true;
                if(localStorageService.get("userType") == "epCs"){
                    $scope.orgTypeFlag = false;
                }
            }else if(data.epInfo.orgType == "1"){
                $scope.orgCheckT = false;
                $scope.orgCheckF = true;
                $scope.orgType = false;
                if(localStorageService.get("userType") == "epCs"){
                    $scope.orgTypeFlag = true;
                }
            }
            if(data.epInfo.orgBelongSepa != null && !angular.equals("",data.epInfo.orgBelongSepa)){
                for(var i=0;i<$scope.areas.length;i++){
                    if(angular.equals($scope.areas[i].value,data.epInfo.orgBelongSepa)){
                        $scope.orgBelongSepa = $scope.areas[i];
                        break;
                    }
                }
            }else{
                $scope.orgBelongSepa = $scope.areas[0];
            }
            if(data.epInfo.belongOrg != null && !angular.equals("",data.epInfo.belongOrg)){
                $scope.belongOrgFlag = true;
                for(var i=0;i<$scope.belongOrgs.length;i++){
                    if(angular.equals($scope.belongOrgs[i].value,data.epInfo.belongOrg)){
                        $scope.belongOrg = $scope.belongOrgs[i];
                        break;
                    }
                }
            }else{
                $scope.belongOrg = $scope.belongOrgs[0];
                $scope.belongOrgFlag = false;
            }
            $scope.btnFlag = data.btnFlag;
            $("#saveBtn").attr("disabled",$scope.btnFlag);
            $("#submitBtn").attr("disabled",$scope.btnFlag);
            $("#orgTypeT").attr("disabled",$scope.btnFlag);
            $("#orgTypeF").attr("disabled",$scope.btnFlag);
            $("#belongOrgFlag").attr("disabled",$scope.btnFlag);
            $("#orgBelongSepa").attr("disabled",$scope.btnFlag);
            $("#belongOrg").attr("disabled",$scope.btnFlag);
            $scope.ADFlag = !$scope.btnFlag;
        }else{
            $scope.open(data.msg);
        }
    }, function (data, header, config, status) {
    });
    //延迟任务，添加下拉框预选值
    var connectTimer=$interval(function(){
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
                $interval.cancel(connectTimer);
            }
        }
    },10);

    //延迟任务，添加下拉框预选值
    var carTimer=$interval(function(){
        if($scope.carData.length>0){
            for(var i=0;i<$scope.carData.length;i++){
                //每行用户类型标签id
                var selectid = "#carTypeT"+$scope.carData[i].sort;
                $(selectid).val($scope.carData[i].carType);
            }
        }
        var table=document.getElementById("carTable");
        if(table != null && table.rows != null){
            //车辆修改前行数
            $scope.carBeforeRow = table.rows.length;
        }
        var count = 0;
        if($scope.carData.length>0){
            for(var i=0;i<$scope.carData.length;i++){
                //每行用户类型标签id
                var selectid = "#carTypeT"+$scope.carData[i].sort;
                if($(selectid).val() == $scope.carData[i].carType){
                    count ++;
                }
            }
            if(count == $scope.carData.length){
                $interval.cancel(carTimer);
            }
        }
    },10);

    //是否是中转单位
    $scope.orgTypeChange = function(result){
        if(result == "true"){
            $scope.orgTypeFlag = false;
            $scope.belongOrgFlag = false;
            $scope.belongOrg = $scope.belongOrgs[0];
        }else{
            $scope.orgTypeFlag = true;
        }
    }

    //是否需要中转单位
    $scope.belongOrgChange = function(){
        $scope.orgBelongSepa = $scope.areas[0];
        $scope.belongOrgs = [{"value":"0","orgName":"请选择"}];
        $scope.belongOrg = $scope.belongOrgs[0];
    }

    //选择所属中转机构 联动
    $scope.selectBelongOrgSepa = function(){
        var par = {sepa:$scope.orgBelongSepa.value, epId:$scope.epId};
        Init.iwbhttp('/enterprise/queryBelongOrgBySepa', par, function (data, header, config, status) {
            $scope.belongOrgs =  data.transferOrgData;
            $scope.belongOrg = $scope.belongOrgs[0];
        }, function (data, header, config, status) {
        });
    }

    //管理员添加
    $scope.adminAdd = function () {
        var tableobj=document.getElementById("adminTable");
        var rowobj=tableobj.insertRow(tableobj.rows.length);
        var index = tableobj.rows.length - 3;
        if(index >= 8){
            $scope.open("最多只能添加八个管理员！");
            return;
        }
        var adminUserId = "00000" + (index+1);
        //给table新增一行
        var cell1=rowobj.insertCell(rowobj.cells.length);
        var cell2=rowobj.insertCell(rowobj.cells.length);
        var cell3=rowobj.insertCell(rowobj.cells.length);
        var cell4=rowobj.insertCell(rowobj.cells.length);
        var adminNameT = "adminNameT"+tableobj.rows.length;
        var adminPwdT = "adminPwdT"+tableobj.rows.length;
        var adminUserIdT = "adminUserIdT"+tableobj.rows.length;
        var adminPersonIdT = "adminPersonIdT"+tableobj.rows.length;
        cell1.innerHTML="<input type='text' id="+adminNameT+" class='form-control'>";
        cell2.innerHTML="<input type='password' id="+adminPwdT+" class='form-control'>";
        cell3.innerHTML="<input type='text' id="+adminUserIdT+" class='form-control' value="+adminUserId+">";
        cell4.innerHTML="<input type='text' id="+adminPersonIdT+" class='form-control'>";
        cell3.style.display = "none";
        cell4.style.display = "none";
    }
    //管理员删除
    $scope.adminDel = function (i) {
        var parm = $scope.adminRow;
        if(parm==undefined || parm==null || angular.equals("",parm) || parm == 0 || parm == 1){
            $scope.open("请先选择要删除用户");
            return;
        }
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
            var tableobj=document.getElementById("adminTable");
            tableobj.deleteRow(returnData);
            $scope.adminRow = "";
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
            var tableobj=document.getElementById("adminTable");
            tableobj.deleteRow(returnData);
            $scope.adminRow = "";
        }, function (returnData) {
        });*/
    }
    $('#adminTable tbody').on( 'click', 'tr', function () {
        if(this.rowIndex != 0 && this.rowIndex != 1){
            $(this).parent().find("tr.tablebg").toggleClass("tablebg");//取消原先选中行
            $(this).toggleClass("tablebg");//设定当前行为选中行
            $scope.adminRow = this.rowIndex;
        }
    });

    //交接员添加
    $scope.connectAdd = function () {
        var tableobj=document.getElementById("connectTable");
        var rowobj=tableobj.insertRow(tableobj.rows.length);
        var index = tableobj.rows.length - 3;
        //给table新增一行
        var cell1=rowobj.insertCell(rowobj.cells.length);
        var cell2=rowobj.insertCell(rowobj.cells.length);
        var cell3=rowobj.insertCell(rowobj.cells.length);
        var cell4=rowobj.insertCell(rowobj.cells.length);
        var cell5=rowobj.insertCell(rowobj.cells.length);
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
        cell4.innerHTML="<input type='text' id="+connectPersonIdT+" class='form-control'>";
        cell4.style.display = "none";
        cell5.innerHTML="<input type='text' id="+connectCodePathT+" class='form-control'>";
        cell5.style.display = "none";
    }
    //交接员删除
    $scope.connectDel = function (i) {
        var parm = $scope.connectRow;
        if(parm==undefined || parm==null || angular.equals("",parm) || parm == 0 || parm == 1){
            $scope.open("请先选择要删除用户");
            return;
        }
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
            var tableobj=document.getElementById("connectTable");
            tableobj.deleteRow(returnData);
            $scope.connectRow = "";
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
            var tableobj=document.getElementById("connectTable");
            tableobj.deleteRow(returnData);
            $scope.connectRow = "";
        }, function (returnData) {
        });*/
    }
    $('#connectTable tbody').on( 'click', 'tr', function () {
        if(this.rowIndex != 0 && this.rowIndex != 1){
            $(this).parent().find("tr.tablebg").toggleClass("tablebg");//取消原先选中行
            $(this).toggleClass("tablebg");//设定当前行为选中行
            $scope.connectRow = this.rowIndex;
        }
    });

    //车添加
    $scope.carAdd = function () {
        var tableobj=document.getElementById("carTable");
        var rowobj=tableobj.insertRow(tableobj.rows.length);
        var index = tableobj.rows.length - 3;
        //给table新增一行
        var cell1=rowobj.insertCell(rowobj.cells.length);
        var cell2=rowobj.insertCell(rowobj.cells.length);
        var cell3=rowobj.insertCell(rowobj.cells.length);
        var cell4=rowobj.insertCell(rowobj.cells.length);
        var cell5=rowobj.insertCell(rowobj.cells.length);
        var cell6=rowobj.insertCell(rowobj.cells.length);
        var carNumT = "carNumT"+tableobj.rows.length;
        var carTypeT = "carTypeT"+tableobj.rows.length;
        var permitT = "permitT"+tableobj.rows.length;
        var carIdT = "carIdT"+tableobj.rows.length;
        var tareT = "tareT"+tableobj.rows.length;
        var carCodePathT = "carCodePathT"+tableobj.rows.length;
        cell1.innerHTML="<input type='text' id="+carNumT+" class='form-control'>";
        cell2.innerHTML=spellStr(carTypeT);
        cell3.innerHTML="<input type='text' id="+permitT+" class='form-control'>";
        cell4.innerHTML="<input type='text' id="+tareT+" class='form-control'>";
        cell5.innerHTML="<input type='text' id="+carIdT+" class='form-control'>";
        cell5.style.display = "none";
        cell6.innerHTML="<input type='text' id="+carCodePathT+" class='form-control'>";
        cell6.style.display = "none";
    }
    //车添加、删除
    $scope.carDel = function (i) {
        var parm = $scope.carRow;
        if(parm==undefined || parm==null || angular.equals("",parm) || parm == 0 || parm == 1){
            $scope.open("请先选择要删除车辆");
            return;
        }
        var msg = "确定删除该车辆？";
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
            var tableobj=document.getElementById("carTable");
            tableobj.deleteRow(returnData);
            $scope.carRow = "";
        }, function () {

        });
       /* var modalInstance = $modal.open({
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
            var tableobj=document.getElementById("carTable");
            tableobj.deleteRow(returnData);
            $scope.carRow = "";
        }, function (returnData) {
            //$log.info('cancel : ' + returnData);
        });*/
    }
    $('#carTable tbody').on( 'click', 'tr', function () {
        if(this.rowIndex != 0 && this.rowIndex != 1){
            $(this).parent().find("tr.tablebg").toggleClass("tablebg");//取消原先选中行
            $(this).toggleClass("tablebg");//设定当前行为选中行
            $scope.carRow = this.rowIndex;
        }
    });

    //保存
    $scope.save = function (){
        if($("#epName").val() == null || angular.equals("", $("#epName").val())){
            $("#epName").val("");
        }else{
            if($("#epName").val().length > 33){
                $scope.content = "单位全称太长";
                $scope.open($scope.content);
                return;
            }
        }
        if($("#belongSepa").val() == 0){
            $scope.content = "请选择所属环保局";
            $scope.open($scope.content);
            return;
        }
        if($("#epCode").val() == null || angular.equals("", $("#epCode").val())){
            $("#epCode").val("");
        }else{
            if($("#epCode").val().length > 30){
                $scope.content = "统一社会信用代码太长";
                $scope.open($scope.content);
                return;
            }
        }

        if($("#linkMan").val() == null || angular.equals("", $("#linkMan").val())){
            $("#linkMan").val("");
        }else{
            if($("#linkMan").val().length > 100){
                $scope.content = "法人名称太长";
                $scope.open($scope.content);
                return;
            }
        }
        if($("#contancts").val() == null || angular.equals("", $("#contancts").val())){
            $("#contancts").val("");
        }else{
            if($("#contancts").val().length > 100){
                $scope.content = "联系人名称太长";
                $scope.open($scope.content);
                return;
            }
        }
        if($("#tel").val() == null || angular.equals("", $("#tel").val())){
            $("#tel").val("");
        }else{
            patrn=/^([0-9]{3,4}-)?[0-9]{7,8}$/;
            if (!patrn.exec($("#tel").val())){
                $scope.open("请输入正确座机号码！");
                return;
            }
        }
        if($("#mobilephone").val() == null || angular.equals("", $("#mobilephone").val())){
            $("#mobilephone").val("");
        }else{
            patrn=/^((13[0-9]{9})|(15[0-9]{9})|(18[0-9]{9})|(17[0-9]{9}))$/;
            if (!patrn.exec($("#mobilephone").val())){
                $scope.open("请输入正确手机号！");
                return;
            }
        }
        if($("#postalCode").val() == null || angular.equals("", $("#postalCode").val())){
            $("#postalCode").val("");
        }else{
            patrn=/^[1-9][0-9]{5}$/;
            if (!patrn.exec($("#postalCode").val())){
                $scope.open("请输入正确邮政编码！");
                return;
            }
        }
        if($("#eMail").val() == null || angular.equals("", $("#eMail").val())){
            $("#eMail").val("");
        }else{
            patrn=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            if (!patrn.exec($("#eMail").val())){
                $scope.open("请输入正确邮箱地址！");
                return;
            }
        }
        if($("#longitude").val() == null || angular.equals("", $("#longitude").val())){
            $("#longitude").val("");
        }else{
            patrn = /^\d*\.?\d{0,3}$/;
            if (!patrn.exec($("#longitude").val())){
                $scope.open("请输入正确经度！");
                return;
            }else{
                if($("#longitude").val().length > 16){
                    $scope.open("经度数值位数过长，请重新输入");
                    return;
                }
            }
        }
        if($("#latitude").val() == null || angular.equals("", $("#latitude").val())){
            $("#latitude").val("");
        }else{
            patrn =  /^\d*\.?\d{0,3}$/;
            if (!patrn.exec($("#latitude").val())){
                $scope.open("请输入正确纬度！");
                return;
            }else{
                if($("#latitude").val().length > 16){
                    $scope.open("纬度数值位数过长，请重新输入");
                    return;
                }
            }
        }
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
                        if(admins[j].adminName == null || admins[j].adminName == ""){
                            admins[j].adminName == ""
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
                    if(admins[index].adminName == undefined || admins[index].adminName == null || admins[index].adminName == ""){
                        admins[index].adminName = "";
                    }else{
                        if(admins[index].adminName.length > 33){
                            $scope.content = "管理员名称太长";
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
                    }
                    if(admins[index].adminPwd == undefined || admins[index].adminPwd == null || admins[index].adminPwd == ""){
                        admins[index].adminPwd = "";
                    }else{
                        patrn=/^[A-Za-z0-9]+$/;
                        if (!patrn.exec(admins[index].adminPwd) || admins[index].adminPwd.length <5 || admins[index].adminPwd.length >18){
                            $scope.open("密码为5-18位大小写字母和数字组成");
                            return;
                        }
                    }
                }else if(($(adminName).val() == null || $(adminName).val() == "") && ($(adminPwd).val() == null || $(adminPwd).val() == "")){
                }else{
                    $scope.content = "请完善管理员信息";
                    $scope.open($scope.content);
                    return;
                }
            }else{
            }
        }
        var connects = new Array();
        var table=document.getElementById("connectTable");
        var row = table.rows.length;
        if($scope.connectBeforeRow > row){
            row = $scope.connectBeforeRow;
        }else{
            $scope.connectBeforeRow = row;
        }
        for(var i=3; i<=row; i++){
            var index1 = connects.length;
            var connectName = "#connectNameT"+i;
            var connectType = "#connectTypeT"+i;
            var connectPersonId = "#connectPersonIdT"+i;
            var connectCodePath = "#connectCodePathT"+i;
            if($(connectName).val() != undefined){
                var flag1 = false;
                var flag2 = false;
                if(localStorageService.get("userType") == "epCs"){
                    flag1 = $(connectName).val() != null && $(connectName).val() != "";
                    flag2 = $(connectName).val() == null || $(connectName).val() == "";
                }else{
                    flag1 = $(connectName).val() != null && $(connectName).val() != "" && $(connectType).val() != null && $(connectType).val() != ""  && $(connectType).val() != 0;
                    flag2 = ($(connectName).val() == null || $(connectName).val() == "") && ($(connectType).val() == null || $(connectType).val() == "" || $(connectType).val() == 0);
                }
                if(flag1){
                    connects[index1] = new Object();
                    for(var j=0; j<index1; j++){
                        if(connects[j].connectName == null || connects[j].connectName == ""){
                            connects[j].connectName == ""
                        }
                    }
                    connects[index1].connectName = $(connectName).val();
                    connects[index1].connectCodePath = $(connectCodePath).val();
                    if(localStorageService.get("userType") == "epCs"){
                        connects[index1].connectType = "1";
                    }else{
                        connects[index1].connectType = $(connectType).val();
                    }
                    if($(connectPersonId).val() != null && $(connectPersonId).val() != ""){
                        connects[index1].personId = $(connectPersonId).val();
                    }else{
                        connects[index1].personId = "";
                    }
                    if(connects[index1].connectName.length > 33){
                        $scope.content = $scope.connectTitle+"名称太长";
                        $scope.open($scope.content);
                        return;
                    }
                    var patrn=/^(?!_)(?!.*?_$)[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
                    if (!patrn.exec(connects[index1].connectName)){
                        $scope.open("交接员名称输入不正确，请重新输入");
                        return;
                    }else{
                        connects[index1].connectName = $.trim(connects[index1].connectName);
                    }
                }else if(flag2){
                }else{
                    $scope.content = "请完善"+$scope.connectTitle+"信息";
                    $scope.open($scope.content);
                    return;
                }
            }
        }
        var cars = new Array();
        var table1=document.getElementById("carTable");
        var row1 = table1.rows.length;
        if($scope.carBeforeRow > row1){
            row1 = $scope.carBeforeRow;
        }else{
            $scope.carBeforeRow = row1;
        }
        for(var i=3; i<=row1; i++){
            var index2 = cars.length;
            var carNum = "#carNumT"+i;
            var carType = "#carTypeT"+i;
            var permit = "#permitT"+i;
            var carId = "#carIdT"+i;
            var tare = "#tareT"+i;
            var carCodePath = "#carCodePathT"+i;
            if($(carNum).val() != undefined){
                if($(carNum).val() != null && $(carNum).val() != "" && $(carType).val() != null && $(carType).val() != "" && $(permit).val() != null && $(permit).val() != "" && $(tare).val() != null && $(tare).val() != ""){
                    cars[index2] = new Object();
                    cars[index2].carNum = $(carNum).val();
                    cars[index2].carType = $(carType).val();
                    cars[index2].permit = $(permit).val();
                    cars[index2].tare = $(tare).val();
                    cars[index2].codePath = $(carCodePath).val();
                    if($(carId).val() != null && $(carId).val() != ""){
                        cars[index2].carId = $(carId).val();
                    }else{
                        cars[index2].carId = "";
                    }
                    if(cars[index2].carNum.length > 30){
                        $scope.content = "车辆牌照号太长";
                        $scope.open($scope.content);
                        return;
                    }
                    if($.trim(cars[index2].carNum).length > 0 && $.trim(cars[index2].carNum).length > 30){
                        $scope.content = "车辆牌照号太长";
                        $scope.open($scope.content);
                        return;
                    }
                    var patrn=/^[冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5}[a-zA-Z0-9挂学警港澳]{1}$/;
                    if (!patrn.exec(cars[index2].carNum)){
                        $scope.open("车辆牌照号输入不正确，请重新输入");
                        return;
                    }else{
                        cars[index2].carNum = $.trim(cars[index2].carNum);
                    }
                    if(cars[index2].carType.length > 3){
                        $scope.content = "车辆类型太长";
                        $scope.open($scope.content);
                        return;
                    }
                    if(cars[index2].permit.length > 20){
                        $scope.content = "运输许可证号太长";
                        $scope.open($scope.content);
                        return;
                    }
                    if(cars[index2].tare.length > 20){
                        $scope.content = "皮重数值太大";
                        $scope.open($scope.content);
                        return;
                    }
                }else if(($(carNum).val() == null || $(carNum).val() == "") && ($(carType).val() == null || $(carType).val() == "") && ($(permit).val() == null || $(permit).val() == "") && ($(tare).val() == null || $(tare).val() == "")){
                }else{
                    $scope.content = "请完善车辆信息";
                    $scope.open($scope.content);
                    return;
                }
            }
        }
        if($scope.orgType == true){
            $scope.orgTypeValue = "0";
        }else{
            $scope.orgTypeValue = "1";
        }
        var par1 = "";
        if(localStorageService.get("userType") == "epCs"){
            par1 = {
                epId: $scope.epId,
                epType: $scope.epType,
                epName:localStorageService.get("epName"),
                epInfo:{
                    epName:$("#epName").val(),
                    epCode:$("#epCode").val(),
                    belongSepa:$scope.belongSepa.value,
                    linkMan:$("#linkMan").val(),
                    belongCity:$scope.belongCity.value,
                    belongArea:$scope.belongArea.value,
                    belongStreet:$("#belongStreet").val(),
                    contancts:$("#contancts").val(),
                    tel:$("#tel").val(),
                    mobilephone:$("#mobilephone").val(),
                    postalCode:$("#postalCode").val(),
                    eMail:$("#eMail").val(),
                    longitude:$("#longitude").val(),
                    latitude:$("#latitude").val(),
                    step:$scope.step.value,
                    orgType:$scope.orgTypeValue,
                    belongOrg:$scope.belongOrg.value
                },
                admins:admins,
                connects:connects,
                cars:cars
            };
        }else{
            par1 = {
                epId: $scope.epId,
                epType: $scope.epType,
                epName:localStorageService.get("epName"),
                epInfo:{
                    epName:$("#epName").val(),
                    epCode:$("#epCode").val(),
                    belongSepa:$scope.belongSepa.value,
                    linkMan:$("#linkMan").val(),
                    belongCity:$scope.belongCity.value,
                    belongArea:$scope.belongArea.value,
                    belongStreet:$("#belongStreet").val(),
                    contancts:$("#contancts").val(),
                    tel:$("#tel").val(),
                    mobilephone:$("#mobilephone").val(),
                    postalCode:$("#postalCode").val(),
                    eMail:$("#eMail").val(),
                    longitude:$("#longitude").val(),
                    latitude:$("#latitude").val(),
                    step:$scope.step.value,
                    orgType:"",
                    belongOrg:""
                },
                admins:admins,
                connects:connects,
                cars:cars
            };
        }
        Init.iwbhttp('/enterprise/updateEnterpriseInfo', par1, function (data, header, config, status) {
            $scope.open(data.msg);
        }, function (data, header, config, status) {
        });
    };

    //提交
    $scope.submit = function (content) {
        if($("#epName").val() == null || angular.equals("", $("#epName").val())){
            $scope.content = "单位全称不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#epName").val().length > 66){
            $scope.content = "单位全称太长";
            $scope.open($scope.content);
            return;
        }
        if($("#belongSepa").val() == 0){
            $scope.content = "请选择所属环保局";
            $scope.open($scope.content);
            return;
        }
        if($("#epCode").val() == null || angular.equals("", $("#epCode").val())){
            $scope.content = "统一社会信用代码不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#epCode").val().length > 30){
            $scope.content = "统一社会信用代码太长";
            $scope.open($scope.content);
            return;
        }
        if($("#linkMan").val() == null || angular.equals("", $("#linkMan").val())){
            $scope.content = "法人不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#linkMan").val().length > 100){
            $scope.content = "法人名称太长";
            $scope.open($scope.content);
            return;
        }
        if($("#belongCity").val() == 0){
            $scope.content = "请选择单位地址所在市";
            $scope.open($scope.content);
            return;
        }
        if($("#belongArea").val() == 0){
            $scope.content = "请输入单位地址所在区";
            $scope.open($scope.content);
            return;
        }
        if($("#belongStreet").val() == null || angular.equals("", $("#belongStreet").val())){
            $scope.content = "请输入单位地址所在街道";
            $scope.open($scope.content);
            return;
        }else{
            if($("#belongStreet").val().length > 100){
                $scope.content = "输入单位地址所在街道过长，请重新输入";
                $scope.open($scope.content);
                return;
            }
        }
        if($("#contancts").val() == null || angular.equals("", $("#contancts").val())){
            $scope.content = "联系人不能为空";
            $scope.open($scope.content);
            return;
        }
        if($("#contancts").val().length > 100){
            $scope.content = "联系人名称太长";
            $scope.open($scope.content);
            return;
        }
        if($("#tel").val() == null || angular.equals("", $("#tel").val())){
            $scope.content = "座机号码不能为空";
            $scope.open($scope.content);
            return;
        }
        var patrn=/^([0-9]{3,4}-)?[0-9]{7,8}$/;
        if (!patrn.exec($("#tel").val())){
            $scope.open("请输入正确座机号码！");
            return;
        }
        if($("#mobilephone").val() == null || angular.equals("", $("#mobilephone").val())){
            $scope.content = "手机号不能为空";
            $scope.open($scope.content);
            return;
        }
        patrn=/^((13[0-9]{9})|(15[0-9]{9})|(18[0-9]{9})|(17[0-9]{9}))$/;
        if (!patrn.exec($("#mobilephone").val())){
            $scope.open("请输入正确手机号！");
            return;
        }
        if($("#postalCode").val() == null || angular.equals("", $("#postalCode").val())){
            $scope.content = "邮政编码不能为空";
            $scope.open($scope.content);
            return;
        }
        patrn=/^[1-9][0-9]{5}$/;
        if (!patrn.exec($("#postalCode").val())){
            $scope.open("请输入正确邮政编码！");
            return;
        }
        if($("#eMail").val() == null || angular.equals("", $("#eMail").val())){
            $scope.content = "邮箱地址不能为空";
            $scope.open($scope.content);
            return;
        }else{
            if($("#eMail").val().length > 50){
                $scope.content = "邮箱地址过长";
                $scope.open($scope.content);
                return;
            }else{
                //patrn=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                patrn=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                //patrn=/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
                if (!patrn.exec($("#eMail").val())){
                    $scope.open("请输入正确邮箱地址！");
                    return;
                }
            }
        }
        if($("#longitude").val() == null || angular.equals("", $("#longitude").val())){
            $scope.content = "经度不能为空";
            $scope.open($scope.content);
            return;
        }
        patrn =  /^\d*\.?\d{0,3}$/;
        if (!patrn.exec($("#longitude").val())){
            $scope.open("请输入正确经度！");
            return;
        }else{
            if($("#longitude").val().length > 16){
                $scope.open("经度数值位数过长，请重新输入");
                return;
            }
        }
        if($("#latitude").val() == null || angular.equals("", $("#latitude").val())){
            $scope.content = "纬度不能为空";
            $scope.open($scope.content);
            return;
        }
        patrn =  /^\d*\.?\d{0,3}$/;
        if (!patrn.exec($("#latitude").val())){
            $scope.open("请输入正确纬度！");
            return;
        }else{
            if($("#latitude").val().length > 16){
                $scope.open("纬度数值位数过长，请重新输入");
                return;
            }
        }
        if(localStorageService.get("userType") == "epCs"){
            if($("#step").val() == 0){
                $scope.content = "请选择医疗机构等级";
                $scope.open($scope.content);
                return;
            }
            //console.log("orgType====>"+$scope.orgType);
            if($scope.orgType != true && $scope.orgType != false){
                $scope.content = "请选择机构类型";
                $scope.open($scope.content);
                return;
            }
            if($scope.belongOrgFlag == true && $scope.belongOrg.value == "0"){
                $scope.content = "请选择中转机构";
                $scope.open($scope.content);
                return;
            }
        }
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
                    var patrn=/^(?!_)(?!.*?_$)[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
                    if (!patrn.exec(admins[index].adminName)){
                        $scope.open("管理员名称输入不正确，请重新输入");
                        return;
                    }else{
                        admins[index].adminName = $.trim(admins[index].adminName);
                    }
                    patrn=/^[A-Za-z0-9]+$/;
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
            }else{
            }
        }
        if(admins.length <= 0){
            $scope.content = "必须添加一个管理员";
            $scope.open($scope.content);
            return;
        }
        var connects = new Array();
        var table=document.getElementById("connectTable");
        var row = table.rows.length;
        if($scope.connectBeforeRow > row){
            row = $scope.connectBeforeRow;
        }else{
            $scope.connectBeforeRow = row;
        }
        for(var i=3; i<=row; i++){
            var index1 = connects.length;
            var connectName = "#connectNameT"+i;
            var connectType = "#connectTypeT"+i;
            var connectPersonId = "#connectPersonIdT"+i;
            var connectCodePath = "#connectCodePathT"+i;
            if($(connectName).val() != undefined){
                var flag1 = false;
                var flag2 = false;
                if(localStorageService.get("userType") == "epCs"){
                    flag1 = $(connectName).val() != null && $(connectName).val() != "";
                    flag2 = $(connectName).val() == null || $(connectName).val() == "";
                }else{
                    flag1 = $(connectName).val() != null && $(connectName).val() != "" && $(connectType).val() != null && $(connectType).val() != ""  && $(connectType).val() != 0;
                    flag2 = ($(connectName).val() == null || $(connectName).val() == "") && ($(connectType).val() == null || $(connectType).val() == "" || $(connectType).val() == 0);
                }
                if(flag1){
                    connects[index1] = new Object();
                    for(var j=0; j<index1; j++){
                        if(connects[j].connectName == $(connectName).val()){
                            $scope.content = $scope.connectTitle+"名称不能重复";
                            $scope.open($scope.content);
                            return;
                        }
                    }
                    connects[index1].connectName = $(connectName).val();
                    connects[index1].connectCodePath = $(connectCodePath).val();
                    if(localStorageService.get("userType") == "epCs"){
                        connects[index1].connectType = "1";
                    }else{
                        connects[index1].connectType = $(connectType).val();
                    }
                    if($(connectPersonId).val() != null && $(connectPersonId).val() != ""){
                        connects[index1].personId = $(connectPersonId).val();
                    }else{
                        connects[index1].personId = "";
                    }
                    if(connects[index1].connectName.length > 33){
                        $scope.content = $scope.connectTitle+"名称太长";
                        $scope.open($scope.content);
                        return;
                    }
                    var patrn=/^(?!_)(?!.*?_$)[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
                    if (!patrn.exec(connects[index1].connectName)){
                        $scope.open("交接员名称输入不正确，请重新输入");
                        return;
                    }else{
                        connects[index1].connectName = $.trim(connects[index1].connectName);
                    }
                }else if(flag2){
                }else{
                    $scope.content = "请完善"+$scope.connectTitle+"信息";
                    $scope.open($scope.content);
                    return;
                }
            }
        }
        var cars = new Array();
        var table1=document.getElementById("carTable");
        var row1 = table1.rows.length;
        if($scope.carBeforeRow > row1){
            row1 = $scope.carBeforeRow;
        }else{
            $scope.carBeforeRow = row1;
        }
        for(var i=3; i<=row1; i++){
            var index2 = cars.length;
            var carNum = "#carNumT"+i;
            var carType = "#carTypeT"+i;
            var permit = "#permitT"+i;
            var carId = "#carIdT"+i;
            var tare = "#tareT"+i;
            var carCodePath = "#carCodePathT"+i;
            if($(carNum).val() != undefined){
                if($(carNum).val() != null && $(carNum).val() != "" && $(carType).val() != null && $(carType).val() != "" && $(permit).val() != null && $(permit).val() != "" && $(tare).val() != null && $(tare).val() != ""){
                    cars[index2] = new Object();
                    for(var j=0; j<index2; j++){
                        if(cars[j].carNum == $(carNum).val()){
                            $scope.content = "车辆牌照号不能重复";
                            $scope.open($scope.content);
                            return;
                        }
                        if(cars[j].permit == $(permit).val()){
                            $scope.content = "运输许可证号不能重复";
                            $scope.open($scope.content);
                            return;
                        }
                    }
                    cars[index2].carNum = $(carNum).val();
                    cars[index2].carType = $(carType).val();
                    cars[index2].permit = $(permit).val();
                    cars[index2].tare = $(tare).val();
                    cars[index2].codePath = $(carCodePath).val();
                    if($(carId).val() != null && $(carId).val() != ""){
                        cars[index2].carId = $(carId).val();
                    }else{
                        cars[index2].carId = "";
                    }
                    if($.trim(cars[index2].carNum).length > 0 && $.trim(cars[index2].carNum).length > 30){
                        $scope.content = "车辆牌照号太长";
                        $scope.open($scope.content);
                        return;
                    }
                    var patrn=/^[冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5}[a-zA-Z0-9挂学警港澳]{1}$/;
                    if (!patrn.exec(cars[index2].carNum)){
                        $scope.open("车辆牌照号输入不正确，请重新输入");
                        return;
                    }else{
                        cars[index2].carNum = $.trim(cars[index2].carNum);
                    }
                    if(cars[index2].carType.length > 3){
                        $scope.content = "车辆类型太长";
                        $scope.open($scope.content);
                        return;
                    }
                    if(cars[index2].permit.length > 20){
                        $scope.content = "运输许可证号太长";
                        $scope.open($scope.content);
                        return;
                    }
                    if(cars[index2].tare.length > 20){
                        $scope.content = "皮重数值太大";
                        $scope.open($scope.content);
                        return;
                    }
                    //var patrn = /^(([1-9]+)|([0-9]+\.[0-9]{0,3}))$/;
                    var patrn = /^[1-9]\d{0,6}(?:|\.\d{0,6})$/;
                    if (!patrn.exec(cars[index2].tare)) {
                        $scope.content = "您输入的皮重格式不对，请重新输入";
                        $scope.open($scope.content);
                        return;
                    }
                }else if(($(carNum).val() == null || $(carNum).val() == "") && ($(carType).val() == null || $(carType).val() == "") && ($(permit).val() == null || $(permit).val() == "") && ($(tare).val() == null || $(tare).val() == "")){
                }else{
                    $scope.content = "请完善车辆信息";
                    $scope.open($scope.content);
                    return;
                }
            }
        }
        if($scope.orgType == true){
            $scope.orgTypeValue = "0";
        }else{
            $scope.orgTypeValue = "1";
        }
        var par1 = "";
        if(localStorageService.get("userType") == "epCs"){
            par1 = {
                epId: $scope.epId,
                epType: $scope.epType,
                epName:localStorageService.get("epName"),
                epInfo:{
                    epName:$("#epName").val(),
                    epCode:$("#epCode").val(),
                    belongSepa:$scope.belongSepa.value,
                    linkMan:$("#linkMan").val(),
                    belongCity:$scope.belongCity.value,
                    belongArea:$scope.belongArea.value,
                    belongStreet:$("#belongStreet").val(),
                    contancts:$("#contancts").val(),
                    tel:$("#tel").val(),
                    mobilephone:$("#mobilephone").val(),
                    postalCode:$("#postalCode").val(),
                    eMail:$("#eMail").val(),
                    longitude:$("#longitude").val(),
                    latitude:$("#latitude").val(),
                    step:$scope.step.value,
                    orgType:$scope.orgTypeValue,
                    belongOrg:$scope.belongOrg.value
                },
                admins:admins,
                connects:connects,
                cars:cars
            };
        }else{
            par1 = {
                epId: $scope.epId,
                epType: $scope.epType,
                epName:localStorageService.get("epName"),
                epInfo:{
                    epName:$("#epName").val(),
                    epCode:$("#epCode").val(),
                    belongSepa:$scope.belongSepa.value,
                    linkMan:$("#linkMan").val(),
                    belongCity:$scope.belongCity.value,
                    belongArea:$scope.belongArea.value,
                    belongStreet:$("#belongStreet").val(),
                    contancts:$("#contancts").val(),
                    tel:$("#tel").val(),
                    mobilephone:$("#mobilephone").val(),
                    postalCode:$("#postalCode").val(),
                    eMail:$("#eMail").val(),
                    longitude:$("#longitude").val(),
                    latitude:$("#latitude").val(),
                    step:$scope.step.value,
                    orgType:"",
                    belongOrg:""
                },
                admins:admins,
                connects:connects,
                cars:cars
            };
        }
        Init.iwbhttp('/enterprise/submitEpAddInfoApply', par1, function (data, header, config, status) {
            $scope.open(data.msg);
            if(data.resFlag == "0"){
                $("#saveBtn").attr("disabled",true);
                $("#submitBtn").attr("disabled",true);
                $("#checkBtn").attr("disabled",false);
                $("#orgTypeT").attr("disabled",true);
                $("#orgTypeF").attr("disabled",true);
                $("#belongOrgFlag").attr("disabled",true);
                $("#orgBelongSepa").attr("disabled",true);
                $("#belongOrg").attr("disabled",true);
                $scope.btnFlag = true;
                $scope.ADFlag = false;
            }
        }, function (data, header, config, status) {
        });
    };

    //返回上一页
    $scope.back = function (){
        $state.go($stateParams.from);
    }

    //查看审批记录
    $scope.check = function (){
        var applyId = $stateParams.applyId;
        if($stateParams.applyId == undefined || $stateParams.applyId == null || $stateParams.applyId == ""){
            applyId = $scope.applyId;
        }
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
       /* var modalInstance = $modal.open({
            templateUrl: 'views/dashboard/admin/approveDetailModal.html',
            controller: 'ApproveDetailModalCtrl',
            resolve: {
                applyId: function () {
                    return applyId;
                }
            }
        });
        modalInstance.result.then(function () {
            $log.info('success : ' + content);
        }, function () {
            $log.info('error : ' + new Date());
        });*/
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
