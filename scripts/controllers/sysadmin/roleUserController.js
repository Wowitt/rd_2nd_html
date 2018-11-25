/**
 * Created by John on 2016/11/2.
 */
'use strict';
angular.module('sbAdminApp').controller('RoleUserCtrl', ['$scope','Init','$state','$stateParams','Modal','localStorageService','CheckBrowser','CheckParam', function ($scope,Init,$state,$stateParams,Modal,localStorageService,CheckBrowser,CheckParam) {
    CheckBrowser.check();
    if($stateParams.from == null || $stateParams.from == ""){
        localStorageService.set("collapse", 0);
        $state.go("dashboard.index");
        return;
    }
    $.extend( $.fn.dataTable.defaults, {
        searching: true,
        ordering:  true
    } );

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    $scope.param = {};
    var table;
    //角色id
    $scope.roleId = $stateParams.roleId;
    $scope.visible = true;
    $scope.searchContent = "";

    table = $('#userTable').DataTable({
        "serverSide": true,
        "columns":[
            {
                "mDataProp": "check",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    if(sData == "1")
                    {
                        $(nTd).html("<input class='myCheckBox' type='checkbox'  checked='true' id='a_check'/>");
                    }else
                    {
                        $(nTd).html("<input class='myCheckBox' type='checkbox' id='a_check'/>");
                    }
                }
            },
            {
                "visible":false,
                "data":"USER_ID"
            },
            {
                "data":"USER_ID"
            },
            {
                "data":"NAME"
            },
            {
                "visible":false,
                "data":"EP_ID"
            },
            {
                "data":"EP_NAME"
            }
        ],
        ajax:function(data, callback, settings){
            //请求参数
            $scope.param.ps = data.length +"";
            $scope.param.start = data.start + "";
            $scope.param.pn = ((data.start/data.length) +1)+"";
            $scope.param.roleId = $scope.roleId;
            if(table != undefined && table.search() != null){
                $scope.searchContent = table.search();
            }
            $scope.param.searchContent = CheckParam.checkSql($scope.searchContent);
            //查询角色人员列表
            Init.iwbhttp('/role/queryRoleUser', $scope.param, function(data,header,config,status){
                var returnData = {};
                if(data.resFlag == 0){
                    returnData.recordsTotal = data.totalRow;//返回数据全部记录
                    returnData.recordsFiltered = data.totalRow;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = data.userList;//返回的数据列表
                    callback(returnData);
                }else{
                    $scope.open(data.msg);
                }
            },function(data,header,config,status){
            });
        },
        "ordering":  false,
        "language": {
            "lengthMenu": "每页 _MENU_ 条记录 ",
            "zeroRecords": "没有找到记录",
            "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页,共_TOTAL_条 )",
            "infoEmpty": "无记录",
            "search": "搜索 : ",
            "paginate": {
                "first": "首页",
                "last": "尾页",
                "next": "下一页",
                "previous": "前一页"
            },
            "infoFiltered": "(从 _MAX_ 条记录过滤)"
        },
        "pagingType": "full_numbers",
        "bFilter": true,
        "scrollX": true,
        "scrollXInner": "100%"
    });
    //给选中的人员赋给当前角色
    $scope.save = function () {
        var userIds = "";
        var allUserId = "";
        table.column(0).data().each(function(value, index ){
            if($(this.row(index).node()).find(".myCheckBox").prop("checked") == true)
            {
                userIds = userIds + this.row(index).data().USER_ID + ",";
            }else
            {
                userIds = userIds;
            }
            allUserId = allUserId + this.row(index).data().USER_ID + ",";
        });
        userIds = userIds.substring(0, userIds.length - 1);
        allUserId = allUserId.substring(0, allUserId.length - 1);
        var par = {
            "roleId":$scope.roleId,
            "userIds":userIds,
            "allUserId":allUserId
        }
        Init.iwbhttp('/role/manageRoleUser',par,function(data,header,config,status){
            $scope.open(data.msg);
        },function(data,header,config,status){
        });
    };

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
