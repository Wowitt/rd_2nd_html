'use strict';
angular.module('sbAdminApp').controller('UnfinishedTaskListCtrl', ['$scope', 'Init', 'Modal', 'localStorageService', '$state', 'CheckBrowser', 'CheckParam', function ($scope, Init, Modal, localStorageService, $state, CheckBrowser, CheckParam) {
    CheckBrowser.check();
    $.extend($.fn.dataTable.defaults, {
        searching: true,
        ordering: false
    });

    //弹框参数
    var resolve= {};
    var url = "";
    var ctrlName = "";

    //搜索内容
    $scope.searchContent = "";
    //所属环保局列表
    $scope.sepaList = "";
    //所属环保局默认全选
    $scope.sepaContent = "所属环保局：全部";
    $scope.sepaFlag = true;
    $scope.param = {};
    var table = $('#applyTable').DataTable({
        serverSide: true,
        "columns": [
            {
                "visible": false,
                "data": "AYL_ID"
            },
            {
                "visible": false,
                "data": "EP_ID"
            },
            {
                "data": "EP_NAME"
            },
            {
                "visible": false,
                "data": "BIZ_ID"
            },
            {
                "data": "BIZ_NAME"
            },
            {
                "data": "STEP_NAME"
            },
            {
                "visible": false,
                "data": "BELONG_SEPA"
            },
            {
                "data": "SEPA_NAME"
            },
            {
                "data": "APPLY_DATE"
            },
            {
                "class": "mytable-borderNone",
                "data": "AYL_ID"
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
            if (localStorageService.get("userType") == "admin") {
                $scope.param = {
                    "orgCode": localStorageService.get("orgCode"),
                    "action": "new",
                    "BTOF_ID": localStorageService.get("btofId"),
                    "ROLEID": localStorageService.get("ROLEID")
                };
            } else if (localStorageService.get("userType") == "epCz" || localStorageService.get("userType") == "epCs") {
                $scope.param = {"action": "new", "epId": localStorageService.get("epId")};
            } else {
                $scope.param = {"action": "new", "epId": localStorageService.get("epId")};
            }
            $scope.param.ps = data.length + "";
            $scope.param.start = data.start + "";
            $scope.param.pn = ((data.start / data.length) + 1) + "";
            if (table != undefined && table.search() != null) {
                $scope.searchContent = table.search();
            }
            $scope.param.searchContent = CheckParam.checkSql($scope.searchContent);
            $scope.param.sepaValue = $scope.sepaValue;
            //待办业务查询
            Init.iwbhttp('/admin/adminTask', $scope.param, function (data, header, config, status) {
                var returnData = {};
                if (data.resFlag == 0) {
                    returnData.recordsTotal = data.totalRow;//返回数据全部记录
                    returnData.recordsFiltered = data.totalRow;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = data.applys;//返回的数据列表
                    if ($scope.sepaList == "") {
                        if (data.sepaList != null && data.sepaList != "") {
                            $scope.sepaList = data.sepaList;
                        } else {
                            $scope.sepaFlag = false;
                        }
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
        "columnDefs": [
            {
                searchable: false,
                targets: [0, 1, 3]
            }
        ],
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
    $('#applyTable tbody').on('click', '#a_check', function () {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        var bizId = data.BIZ_ID;
        var applyId = data.AYL_ID;
        var bizIdStart = bizId.substring(0, 2);
        if (angular.equals("EP", bizIdStart)) {
            if (localStorageService.get("userType") == "admin") {
                $state.go("dashboard.unfinishedTaskIndex.approveEpInfo", {
                    "bizId": bizId,
                    "applyId": applyId,
                    "btnFlag": true,
                    "from": "dashboard.unfinishedTaskIndex.unfinishedTaskList"
                });
            } else if (localStorageService.get("userType") == "epCz" || localStorageService.get("userType") == "epCs") {
                $state.go("dashboard.unfinishedTaskIndex.submitEpInfo", {
                    "bizId": bizId,
                    "applyId": applyId,
                    "btnFlag": true,
                    "from": "dashboard.unfinishedTaskIndex.unfinishedTaskList"
                });
            }
        } else if (angular.equals("TP", bizIdStart)) {
            if (localStorageService.get("userType") == "admin") {
                $state.go("dashboard.unfinishedTaskIndex.approveTransferInfo", {
                    "bizId": bizId,
                    "applyId": applyId,
                    "btnFlag": true,
                    "from": "dashboard.unfinishedTaskIndex.unfinishedTaskList"
                });
            } else if (localStorageService.get("userType") == "epAdminCs") {
                $state.go("dashboard.unfinishedTaskIndex.transferInfoForEpAdmin", {
                    "transferId": bizId,
                    "from": "dashboard.unfinishedTaskIndex.unfinishedTaskList"
                });
            }
        } else if (angular.equals("PE", bizIdStart)) {
            if (localStorageService.get("userType") == "admin") {
                $state.go("dashboard.unfinishedTaskIndex.approveEpModifyInfoUnfinished", {
                    "bizId": bizId,
                    "applyId": applyId,
                    "btnFlag": true,
                    "from": "dashboard.unfinishedTaskIndex.unfinishedTaskList"
                });
            } else if (localStorageService.get("userType") == "epCz" || localStorageService.get("userType") == "epCs") {
                $state.go("dashboard.unfinishedTaskIndex.epInfoModifyTask", {
                    "bizId": bizId,
                    "applyId": applyId,
                    "btnFlag": true,
                    "from": "dashboard.unfinishedTaskIndex.unfinishedTaskList"
                });
            }
        } else if (angular.equals("PI", bizIdStart)) {
            if (localStorageService.get("userType") == "admin") {
                $state.go("dashboard.unfinishedTaskIndex.epAdminManageUnfinishedTaskForAdmin", {
                    "bizId": bizId,
                    "applyId": applyId,
                    "btnFlag": true,
                    "from": "dashboard.unfinishedTaskIndex.unfinishedTaskList"
                });
            } else if (localStorageService.get("userType") == "epCz" || localStorageService.get("userType") == "epCs") {
                $state.go("dashboard.unfinishedTaskIndex.epAdminManageUnfinishedTask", {
                    "bizId": bizId,
                    "applyId": applyId,
                    "btnFlag": true,
                    "from": "dashboard.unfinishedTaskIndex.unfinishedTaskList"
                });
            }
        } else if (angular.equals("TM", bizIdStart)) {
            if (localStorageService.get("userType") == "admin") {
                $state.go("dashboard.unfinishedTaskIndex.approveTransferRunningInfo", {
                    "bizId": bizId,
                    "applyId": applyId,
                    "btnFlag": true,
                    "from": "dashboard.unfinishedTaskIndex.unfinishedTaskList"
                });
            } else if (localStorageService.get("userType") == "epAdminCs") {
                $state.go("dashboard.unfinishedTaskIndex.transferRunningInfoForEpAdmin", {
                    "transferId": bizId,
                    "bizId": bizId,
                    "applyId": applyId,
                    "from": "dashboard.unfinishedTaskIndex.unfinishedTaskList"
                });
            }
        }
    });

    //单击某个选项三秒单独选中
    var sepaTimeout;
    //全不选
    $scope.sepaMouseDown = function (obj) {
        sepaTimeout = setTimeout(function () {
            $('input[name="sepa"]').prop('checked', false);
        }, 1000);
    }
    //取消sepaMouseDown里要执行的方法
    $scope.sepaMouseUp = function (obj) {
        clearTimeout(sepaTimeout);
    }

    //单击标题三秒全选
    var sepaAllTimeout;
    //全选
    $scope.sepaAllMouseDown = function (obj) {
        sepaAllTimeout = setTimeout(function () {
            $('input[name="sepa"]').prop('checked', true);
            $scope.sepaChoice();
        }, 1000);
    }
    //取消sepaAllMouseDown里要执行的方法
    $scope.sepaAllMouseUp = function (obj) {
        clearTimeout(sepaAllTimeout);
    }


    //所属环保局选项卡
    $scope.sepaChoice = function () {
        var checkLength = $("input[name='sepa']:checked").length;
        if (checkLength == 0) {
            $('#sepaDivId input[value=' + $scope.sepaValue + ']').prop('checked', true);
            $scope.open("至少选择一个所属环保局");
            return;
        }
        $scope.sepaContent = "";
        $scope.sepaValue = "";
        //是否全选
        if (checkLength == $scope.sepaList.length) {
            $scope.sepaContent = "所属环保局：全部";
            $scope.sepaValue = "";
        } else {
            $('input[name="sepa"]:checked').each(function () {
                var statusVal = $(this).val();
                for (var i = 0; i < $scope.sepaList.length; i++) {
                    if ($scope.sepaList[i].value == statusVal) {
                        if ($scope.sepaContent == null || $scope.sepaContent == "") {
                            $scope.sepaContent = "所属环保局：" + $scope.sepaList[i].text;
                            $scope.sepaValue = "'" + $scope.sepaList[i].value + "'";
                        } else {
                            $scope.sepaContent = $scope.sepaContent + "，" + $scope.sepaList[i].text;
                            $scope.sepaValue = $scope.sepaValue + ",'" + $scope.sepaList[i].value + "'";
                        }
                    }
                }
            });
        }
        //请求后台
        $scope.postService();
    }

    //请求后台
    $scope.postService = function () {
        if (table != undefined && table.search() != null) {
            $scope.searchContent = table.search();
        }
        $scope.param.searchContent = $scope.searchContent;
        $scope.param.sepaValue = $scope.sepaValue;
        Init.iwbhttp('/admin/adminTask', $scope.param, function (data, header, config, status) {
            if (data.resFlag == 0) {
                for (var i = 0; i < data.applys.length; i++) {
                    table.row(i).columns = data.applys[i];
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