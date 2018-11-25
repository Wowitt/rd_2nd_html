/**
 * Created by John on 2016/11/2.
 */
'use strict';
angular.module('sbAdminApp').controller('RoleMenuCtrl', ['$scope','Init','$state','$stateParams','Modal','$log','$rootScope','localStorageService','CheckBrowser', function ($scope,Init,$state,$stateParams,Modal,$log,$rootScope,localStorageService,CheckBrowser) {
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
    //角色id
    $scope.roleId = $stateParams.roleId;
    $scope.visible = true;
    var table = "";
    //查询角色菜单
    Init.iwbhttp('/role/queryRoleMenu',{roleId: $scope.roleId},function(data,header,config,status) {
        $scope.appData = data.menuList;
        table = $('#menuTable').DataTable({
            "data":$scope.appData,
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
                    "data":"FUNC_ID"
                },
                {
                    "data":"NAME"
                },
                {
                    "data":"FUNC_PATH"
                },
                {
                    "data":"ACTIONPATH"
                }
            ],
            "order":[1,'asc'],
            "language": {
                "lengthMenu": "每页 _MENU_ 条记录 ",
                "zeroRecords": "没有找到记录",
                "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页,共_TOTAL_条 )",
                "infoEmpty": "无记录",
                "search": "搜索 : ",
                "paginate": {
                    "first":      "首页",
                    "last":       "尾页",
                    "next":       "下一页",
                    "previous":   "前一页"
                },
                "infoFiltered": "(从 _MAX_ 条记录过滤)"
            },
            "pagingType":   "full_numbers",
            "bFilter": true,
            "scrollX": true,
            "scrollXInner": "100%"
        });
    });
    //把选中的菜单赋给当前的角色
    $scope.save = function () {
        var menuIds = "";
        table.column(0).data().each(function(value, index ){
            if($(this.row(index).node()).find(".myCheckBox").prop("checked") == true)
            {
                menuIds = menuIds + this.row(index).data().FUNC_ID + ",";
            }else
            {
                menuIds = menuIds;
            }
        });
        menuIds = menuIds.substring(0, menuIds.length - 1);
        var par = {
            "roleId":$scope.roleId,
            "menuIds":menuIds
        }
        Init.iwbhttp('/role/manageRoleMenu',par,function(data,header,config,status){
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
