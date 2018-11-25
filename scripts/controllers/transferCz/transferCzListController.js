'use strict';
angular.module('sbAdminApp').controller('TransferCzListCtrl', ['$scope', 'Init', 'Modal', 'localStorageService', '$state', 'CheckBrowser', 'CheckParam', function ($scope, Init, Modal, localStorageService, $state, CheckBrowser, CheckParam) {
    CheckBrowser.check();
    $.extend($.fn.dataTable.defaults, {
        searching: true,
        ordering: false
    });
    $scope.table;
    $scope.param = {};
    $scope.btnFlag = true;
    $scope.statusList = new Array();

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    //状态默认全选
    $scope.statusContent = "状态：全部";

    //table数据
    $scope.table = $('#transferCzTable').DataTable({
        serverSide: true,
        "columns": [
            {
                "data": "WC_ID"
            },
            {
                "data": "EP_SMALL_NAME"
            },
            {
                "data": "M_PERSON_NAME"
            },
            {
                "data": "EP_BIG_NAME"
            },
            {
                "data": "PERSON_NAME"
            },
            {
                "data": "UNIT_NUM"
            },
            {
                "data": "TBDATE"
            },
            {
                "class": "mytable-borderNone",
                "data": "STATUS"
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
            //请求参数赋值
            $scope.param.ps = data.length + "";
            $scope.param.start = data.start + "";
            $scope.param.pn = ((data.start / data.length) + 1) + "";
            $scope.param.epId = localStorageService.get("epId");
            if($scope.table != undefined && $scope.table.search() != null){
                $scope.searchContent = $scope.table.search();
            }
            $scope.param.searchContent = CheckParam.checkSql($scope.searchContent);
            $scope.param.statusValue = $scope.statusValue;
            $scope.param.statusCache = ['1','3'];
            //查询中转转移信息
            Init.iwbhttp('/conduitTransfer/queryApplyTransferConduitList', $scope.param, function (data, header, config, status) {
                var returnData = {};
                $scope.btnFlag = data.btnFlag;
                if (data.resFlag == 0) {
                    returnData.recordsTotal = data.totalRow;//返回数据全部记录
                    returnData.recordsFiltered = data.totalRow;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = data.transferList;//返回的数据列表
                    if($scope.statusList.length <= 0){
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
    $('#transferCzTable tbody').on('click', '#a_check', function () {
        var row = $scope.table.row($(this).parents('tr'));
        var data = row.data();
        var par = {
            "WC_ID": data.WC_ID,
            "STATUS": data.STATUS,
            "from": "dashboard.transferCzIndex.transferCzList",
            "btnFlag": $scope.btnFlag
        };
        $state.go("dashboard.transferCzIndex.transferCzInfo", par);
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
        var checkLength = $("input[name='status']:checked").length;
        if(checkLength==0){
            $('#statusDivId input[value='+$scope.statusValue+']').prop('checked', true);
            $scope.open("状态不能为空");
            return;
        }
        $scope.statusContent = "";
        $scope.statusValue = "";
        //是否全选
        if(checkLength==$scope.statusList.length){
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
        if ($scope.table != undefined && $scope.table.search() != null) {
            $scope.searchContent = $scope.table.search();
        }
        var url = "/conduitTransfer/queryApplyTransferConduitList";
        $scope.param.searchContent = $scope.searchContent;
        $scope.param.statusValue = $scope.statusValue;
        Init.iwbhttp(url, $scope.param, function (data, header, config, status) {
            if (data.resFlag == 0) {
                for(var i = 0 ; i < data.transferList.length ; i++)
                {
                    $scope.table.row(i).columns = data.transferList[i];
                }
                $scope.table.draw();
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