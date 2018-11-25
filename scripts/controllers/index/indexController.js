/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('IndexCtrl', ['$scope','Init','Modal','localStorageService','CheckBrowser', function ($scope,Init,Modal,localStorageService,CheckBrowser) {
    CheckBrowser.check();
    $scope.taskFlag = true;
    $scope.operatorFlag = true;
    $scope.dataFlag = true;
    if(localStorageService.get("userType") == "sysAdmin"){
        $scope.taskFlag = false;
        $scope.dataFlag = false;
    }

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    var par = {};
    if(localStorageService.get("userType") == "admin"){
        par = {"orgCode":localStorageService.get("orgCode"), "userType":localStorageService.get("userType"), "ROLEID":localStorageService.get("ROLEID")};
    }else if(localStorageService.get("userType") == "epCz" || localStorageService.get("userType") == "epCs"){
        par = {"action":"new", "epId":localStorageService.get("epId")};
    }else if(localStorageService.get("userType") == "epAdminCs"){
        par = {"action":"new", "epId":localStorageService.get("epId")};
    }else if(localStorageService.get("userType") == "epAdminCz"){
        par = {"epId":localStorageService.get("epId")};
    }
    //获取待办业务数量、协议数量、忘记密码数量、未提交转移计划数量
    Init.iwbhttp('/admin/adminTaskNum', par, function (data, header, config, status) {
        if (angular.equals("0", data.resFlag)) {
            $scope.taskNum = data.taskNum;
            if(data.agreementNum != null){
                $scope.agreementFlag = true;
                $scope.agreementNum = data.agreementNum;
            }
            if(data.forgetPwdNum != null){
                $scope.forgetPwdFlag = true;
                $scope.forgetPwdNum = data.forgetPwdNum;
            }
            if(data.unSubmitPlanNum != null){
                $scope.unSubmitPlanFlag = true;
                $scope.unSubmitPlanNum = data.unSubmitPlanNum;
            }
        } else {
            $scope.open(data.msg);
        }
    }, function (data, header, config, status) {
    });

    //医疗机构流程    hospitalBusiness
    $scope.hospitalBusiness = [
        {
            li_class : '',
            div_class : '',
            step : '第一步',
            tital : '单位注册',
            content : '在系统登录页面选择单位登录后，点击【注册】按钮，跳转至单位注册页面，选择单位类型，填写单位名称、统一社会代码，及登录密码等信息。'
        },
        {
            li_class : 'timeline-inverted',
            div_class : ' warning',
            step : '第二步',
            tital : '单位信息完善',
            content : '单位注册成功之后，会跳转至系统首页，或者使用单位名称和密码在单位登录页面进行登录，选择“单位信息维护”菜单，会跳转至单位信息修改页面，填写完单位信息和单位人员信息后单击【保存】按钮。'
        },
        {
            li_class : '',
            div_class : ' danger',
            step : '第三步',
            tital : '提交审核',
            content : '单位信息保存之后，可以在待办任务页，或者单位信息维护页面，点击【提交】按钮，该申请就会提交至所属区级，进行审批流程。'
        },
        {
            li_class : 'timeline-inverted',
            div_class : ' info',
            step : '第四步',
            tital : '管理员登录',
            content : '当单位信息市级审核通过后，可以用统一社会信息用码和设置的管理员、密码，在单位管理员登录标签卡进行登录。'
        },
        {
            li_class : '',
            div_class : ' success',
            step : '第五步',
            tital : '操作业务',
            content : '制作医疗危废处置协议(需处置机构同意)，制作医疗废物转移计划(需区市管理部门审批)'
        },
        {
            li_class : 'timeline-inverted',
            div_class : ' primary',
            step : '第六步',
            tital : '转移',
            content : '管理员或交接员在医废转移app中，进行交接流程'
        }
    ];

    //处置机构流程    handleBusiness
    $scope.handleBusiness = [
        {
            li_class : '',
            div_class : '',
            step : '第一步',
            title : '单位注册',
            content : '在系统登录页面选择单位登录后，点击【注册】按钮，跳转至单位注册页面，选择单位类型，填写单位名称、统一社会代码，及登录密码等信息。'
        },
        {
            li_class : 'timeline-inverted',
            div_class : ' warning',
            step : '第二步',
            title : '单位信息完善',
            content : '单位注册成功之后，会跳转至系统首页，或者使用单位名称和密码在单位登录页面进行登录，选择“单位信息维护”菜单，会跳转至单位信息修改页面，填写完单位信息和单位人员信息后单击【保存】按钮。'
        },
        {
            li_class : '',
            div_class : ' danger',
            step : '第三步',
            title : '提交审核',
            content : '单位信息保存之后，可以在待办任务页，或者单位信息维护页面，点击【提交】按钮，该申请就会提交至所属区级，进行审批流程。'
        },
        {
            li_class : 'timeline-inverted',
            div_class : ' info',
            step : '第四步',
            title : '管理员登录',
            content : '当单位信息市级审核通过后，可以用统一社会信息用码和设置的管理员、密码，在单位管理员登录标签卡进行登录。'
        },
        {
            li_class : '',
            div_class : ' success',
            step : '第五步',
            title : '操作业务',
            content : '审批医疗危废处置协议'
        },
        {
            li_class : 'timeline-inverted',
            div_class : ' primary',
            step : '第六步',
            title : '转移',
            content : '司机和管理员、交接员在医废转移app中，开启转移流程'
        }
    ];

    //管理部门流程    manageBusiness
    $scope.manageBusiness = [
        {
            li_class : '',
            div_class : '',
            step : '第一步',
            title : '管理员登录',
            content : '操作员可以直接用危废系统中的用户名和密码进行登录系统。'
        },
        {
            li_class : 'timeline-inverted',
            div_class : ' warning',
            step : '第二步',
            title : '审批',
            content : '审批“单位信息维护”、“单位信息变更”、“管理员变更”，“医疗维护转移计划”等流程'
        },
        {
            li_class : '',
            div_class : ' danger',
            step : '第三步',
            title : '查询统计',
            content : '查询统计“转移汇总（按产生单位）”、“转移汇总（按处置单位）”'
        }
    ];

    //sysadmin    sysadminBusiness
    $scope.sysadminBusiness = [
        {
            li_class : '',
            div_class : '',
            step : '第一步',
            title : '系统管理员登录',
            content : '系统管理员在登录页面选择管理员登录，输入用户名和密码登录进行登录系统。'
        },
        {
            li_class : 'timeline-inverted',
            div_class : ' warning',
            step : '第二步',
            title : '角色维护',
            content : '“角色维护”、“角色菜单管理”、“角色人员管理”等流程'
        },
        {
            li_class : '',
            div_class : ' danger',
            step : '第三步',
            title : '菜单维护',
            content : '选中要修改的菜单，修改菜单名称'
        }
    ];

    //业务流程指南
    $scope.business = new Array();
    //医疗机构流程
    if(localStorageService.get("userType") == "epCs" || localStorageService.get("userType") == "epAdminCs"){
        $scope.business = $scope.hospitalBusiness;
    }
    //处置机构流程
    if(localStorageService.get("userType") == "epCz" || localStorageService.get("userType") == "epAdminCz"){
        $scope.business = $scope.handleBusiness;
    }
    //管理部门流程
    if(localStorageService.get("userType") == "admin" || localStorageService.get("userType") == "admin"){
        $scope.business = $scope.manageBusiness;
    }
    if(localStorageService.get("userType") == "sysAdmin"){
        $scope.business = $scope.sysadminBusiness;
    }

    //提示框modal
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
