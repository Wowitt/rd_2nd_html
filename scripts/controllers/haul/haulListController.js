'use strict';
angular.module('sbAdminApp').controller('HaulListCtrl', ['$scope', 'Init', 'Modal', 'localStorageService', '$state', 'CheckBrowser', 'CheckParam', function ($scope, Init, Modal, localStorageService, $state, CheckBrowser, CheckParam) {
    CheckBrowser.check();
    $.extend($.fn.dataTable.defaults, {
        searching: true,
        ordering: true
    });
    $scope.param = {};
    var table;
    $scope.searchContent = "";
    $scope.statusList = "";

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    //状态默认全选
    $scope.statusContent = "状态：全部";

    //table数据
    table = $('#haulTable').DataTable({
        "serverSide": true,
        "columns": [
            {
                "data": "TG_ID"
            },
            {
                "data": "EN_NAME_CZ"
            },
            {
                "data": "CZ_DRIVER_NAME"
            },
            {
                "data": "PLATE_NUMBER"
            },
            {
                "data": "BEGINTIME"
            },
            {
                "data": "ENDTIME"
            },
            {
                "data": "STATUSNAME"
            },
            /*{
                "data": "TOTAL_WEIGHT"
            },*/
            {
                "class": "mytable-borderNone",
                "data": "WEIGHT"
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
            var url = "";
            if (table != undefined && table.search() != null) {
                $scope.searchContent = table.search();
            }
            $scope.param.searchContent = CheckParam.checkSql($scope.searchContent);
            $scope.param.statusValue = $scope.statusValue;
            $scope.param.statusCache = ['3','4','5'];
            if (localStorageService.get("userType") == "admin") {
                $scope.param.ROLEID = localStorageService.get("ROLEID");
                $scope.param.orgCode = localStorageService.get("orgCode");
                url = "/transfer/queryHaulListForAdmin";
            } else {
                $scope.param.epId = localStorageService.get("epId");
                url = "/transfer/queryHaulList";
            }
            Init.iwbhttp(url, $scope.param, function (data, header, config, status) {
                var returnData = {};
                if (data.resFlag == 0) {
                    returnData.recordsTotal = data.totalRow;//返回数据全部记录
                    returnData.recordsFiltered = data.totalRow;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = data.haulList;//返回的数据列表
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
    $('#haulTable tbody').on('click', '#a_check', function () {
        var row = table.row($(this).parents('tr'));
        var data = row.data();
        $state.go("dashboard.haulIndex.billList", {TG_ID: data.TG_ID, from: "dashboard.haulIndex.haulList"});
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
            $scope.open("至少选择一个状态");
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
        if (table != undefined && table.search() != null) {
            $scope.searchContent = table.search();
        }
        var url = "";
        $scope.param.searchContent = $scope.searchContent;
        $scope.param.statusValue = $scope.statusValue;
        if (localStorageService.get("userType") == "admin") {
            $scope.param.ROLEID = localStorageService.get("ROLEID");
            $scope.param.orgCode = localStorageService.get("orgCode");
            url = "/transfer/queryHaulListForAdmin";
        } else if (localStorageService.get("userType") == "epAdminCz") {
            $scope.param.epId = localStorageService.get("epId");
            url = "/transfer/queryHaulList";
        }
        Init.iwbhttp(url, $scope.param, function (data, header, config, status) {
            if (data.resFlag == 0) {
                for(var i = 0 ; i < data.haulList.length ; i++)
                {
                    table.row(i).columns = data.haulList[i];
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

    //状态选项卡全选/取消全选
    //$scope.statusAll = function () {
    //    $scope.statusContent = "";
    //    //判断全部是否被选中
    //    var allchecked = $('#statusAll').is(':checked');
    //    var status = $('input[name="status"]');
    //    //给其他赋值
    //    status.prop('checked', allchecked);
    //    if (allchecked) {
    //        $scope.statusFlag = true;
    //        for (var i = 0; i < $scope.statusList.length; i++) {
    //            if ($scope.statusContent == null || $scope.statusContent == "") {
    //                $scope.statusContent = $scope.statusList[i].text;
    //                $scope.statusValue = "'"+$scope.statusList[i].value+"'";
    //            } else {
    //                $scope.statusContent = $scope.statusContent + "，" + $scope.statusList[i].text;
    //                $scope.statusValue = $scope.statusValue + ",'" + $scope.statusList[i].value+"'";
    //            }
    //        }
    //    }else{
    //        $scope.statusFlag = false;
    //        $scope.statusContent = "";
    //        $scope.statusValue = "";
    //    }
    //    //请求后台
    //    $scope.postService();
    //}
}]);