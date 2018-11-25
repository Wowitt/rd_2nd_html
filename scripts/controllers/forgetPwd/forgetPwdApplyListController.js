'use strict';
angular.module('sbAdminApp').controller('ForgetPwdApplyListCtrl', ['$scope', 'Init', 'Modal', '$state', 'CheckBrowser','CheckParam', function ($scope, Init, Modal, $state, CheckBrowser,CheckParam) {
    CheckBrowser.check();
    $.extend($.fn.dataTable.defaults, {
        searching: true,
        ordering: false
    });
    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";
    var table;
    //搜索内容
    $scope.searchContent = "";
    //状态列表
    $scope.statusList = "";
    //状态默认全选
    $scope.statusContent = "状态：全部";
    $scope.param = {};
    //table数据
    table = $('#forgetPwdApplyTable').DataTable({
        serverSide: true,
        "columns": [
            {
                "data": "EP_NAME"
            },
            {
                "data": "ORGCARD"
            },
            {
                "data": "NAME"
            },
            {
                "data": "APPLY_DATE"
            },
            {
                "data": "WF_ID"
            },
            {
                "data": "MAIL"
            },
            {
                "visible": false,
                "data": "APPROVE_MAIL"
            },
            {
                "class": "mytable-borderNone",
                "data": "STATUSNAME"
            },
            {
                "class": "mytable-center",
                "targets": -1,
                "data": null,
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html("<div class='btn-group-vertical'><button type='button' class='btn btn-primary btn-sm dropdown-toggle' data-toggle='dropdown' id='a_check'>查看</button></div>");
                }
            }
        ],
        ajax: function (data, callback, settings) {
            $scope.param.ps = data.length + "";
            $scope.param.start = data.start + "";
            $scope.param.pn = ((data.start / data.length) + 1) + "";
            if(table != undefined && table.search() != null){
                $scope.searchContent = table.search();
            }
            $scope.param.searchContent = CheckParam.checkSql($scope.searchContent);
            $scope.param.statusValue = $scope.statusValue;
            $scope.param.statusCache = ['1','3','4'];
            Init.iwbhttp('/admin/queryForgetPwdApplyList', $scope.param, function (data, header, config, status) {
                var returnData = {};
                if (data.resFlag == 0) {
                    returnData.recordsTotal = data.totalRow;//返回数据全部记录
                    returnData.recordsFiltered = data.totalRow;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = data.forgetPwdApplyList;//返回的数据列表
                    if($scope.statusList == ""){
                        $scope.statusList = data.statusList;
                    }
                    callback(returnData);
                } else {
                    $scope.open(data.msg);
                }
            }, function (data, header, config, status) {
            });
        },
        "ordering": false,
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
        "scrollXInner": "100%",
        "scrollY": "350px",
        "scrollCollapse": true,
        "fixedColumns":   {
            leftColumns:0,
            rightColumns: 1
        }
    });

    //查看详情
    $('#forgetPwdApplyTable tbody').on('click', '#a_check', function () {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var par = {
            "WF_ID": data.WF_ID,
            "EP_NAME": data.EP_NAME,
            "ORGCARD": data.ORGCARD,
            "NAME": data.NAME,
            "MAIL": data.MAIL,
            "APPROVE_MAIL": data.APPROVE_MAIL,
            "STATUS": data.STATUS,
            "from": "dashboard.forgetPwdApplyIndex.forgetPwdApplyList"
        };
        $state.go("dashboard.forgetPwdApplyIndex.forgetPwdApplyInfo", par);
    });

    //单击某个选项三秒单独选中
    var statusTimeout;
    //全不选
    $scope.statusMouseDown = function (obj) {
        statusTimeout = setTimeout(function () {
            $('input[name="status"]').prop('checked', false);
        }, 1000);
    }
    //取消statusMouseDown里要执行的方法
    $scope.statusMouseUp = function (obj) {
        clearTimeout(statusTimeout);
    }

    //单击标题三秒全选
    var statusAllTimeout;
    //全选
    $scope.statusAllMouseDown = function (obj) {
        statusAllTimeout = setTimeout(function () {
            $('input[name="status"]').prop('checked', true);
            $scope.statusChoice();
        }, 1000);
    }
    //取消statusAllMouseDown里要执行的方法
    $scope.statusAllMouseUp = function (obj) {
        clearTimeout(statusAllTimeout);
    }

    //状态选项卡
    $scope.statusChoice = function () {
        var statusLength = $("input[name='status']:checked").length;
        if(statusLength==0){
            $('#statusDivId input[value='+$scope.statusValue+']').prop('checked', true);
            $scope.open("至少选择一个状态");
            return;
        }
        $scope.statusContent = "";
        $scope.statusValue = "";
        //是否全选
        if(statusLength==$scope.statusList.length){
            $scope.statusContent = "状态：全部";
            $scope.statusValue = "";
        }else{
            $('input[name="status"]:checked').each(function () {
                var statusVal = $(this).val();
                for (var i = 0; i < $scope.statusList.length; i++) {
                    if ($scope.statusList[i].value == statusVal) {
                        if ($scope.statusContent == null || $scope.statusContent == "") {
                            $scope.statusContent = "状态："+$scope.statusList[i].text;
                            $scope.statusValue = "'"+$scope.statusList[i].value+"'";
                        } else {
                            $scope.statusContent = $scope.statusContent + "，" + $scope.statusList[i].text;
                            $scope.statusValue = $scope.statusValue + ",'" + $scope.statusList[i].value+"'";
                        }
                    }
                }
            });
        }
        //请求后台
        $scope.postService();
    }

    //请求后台
    $scope.postService = function (){
        if (table != undefined && table.search() != null) {
            $scope.searchContent = table.search();
        }
        $scope.param.searchContent = $scope.searchContent;
        $scope.param.statusValue = $scope.statusValue;
        Init.iwbhttp('/admin/queryForgetPwdApplyList', $scope.param, function (data, header, config, status) {
            if (data.resFlag == 0) {
                for(var i = 0 ; i < data.forgetPwdApplyList.length ; i++)
                {
                    table.row(i).columns = data.forgetPwdApplyList[i];
                }
                table.draw();
            } else {
                $scope.open(data.msg);
            }
        }, function (data, header, config, status) {
        });
    }

    //提示modal弹框
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