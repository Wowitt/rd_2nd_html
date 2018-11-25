/**
 * Created by John on 2017/6/21.
 */
'use strict';
angular.module('sbAdminApp').controller('TransferSummaryListForCSCtrl', ['$scope','$rootScope','$interval','CheckBrowser','Init','Modal','localStorageService','CheckParam', function ($scope,$rootScope,$interval,CheckBrowser,Init,Modal,localStorageService,CheckParam) {

    CheckBrowser.check();
    //参数
    $scope.param = {};
    $scope.searchContent = "";
    $scope.table;
    $scope.orgNum = "";
    $scope.weight = "";
    $scope.transferNum = "";
    $scope.dataList = new Array();
    $scope.showFlag = false;
    $scope.hideFlag = true;
    if(localStorageService.get("userType") == 'epAdminCs'){
        $scope.hideFlag = false;
    }

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    //查询转移汇总
    $scope.table = $('#transferSummaryForCSTable').DataTable({
        serverSide: true,
        "columns": [
            {
                "data": "EN_NAME_CS"
            },
            {
                "data": "SEPANAME"
            },
            {
                "data": "WEIGHT"
            },
            {
                "data": "COUNT"
            }
        ],
        ajax: function (data, callback, settings) {
            //请求参数赋值
            $scope.param.ps = data.length + "";
            $scope.param.start = data.start + "";
            $scope.param.pn = ((data.start / data.length) + 1) + "";
            if(localStorageService.get("ROLEID") == null || localStorageService.get("ROLEID") == ""){
                $scope.param.ROLEID = "";
            }else{
                $scope.param.ROLEID = localStorageService.get("ROLEID");
            }
            if(localStorageService.get("orgCode") == null || localStorageService.get("orgCode") == ""){
                $scope.param.orgCode = "";
            }else{
                $scope.param.orgCode = localStorageService.get("orgCode");
            }
            $scope.param.userType = localStorageService.get("userType");
            $scope.param.epId = localStorageService.get("epId");
            if ($scope.table != undefined && $scope.table.search() != null) {
                $scope.searchContent = $scope.table.search();
            }
            $scope.param.searchContent = CheckParam.checkSql($scope.searchContent);
            if ($("#ENDTIME").val() != "" && $("#BEGINTIME").val() != "") {
                if ($("#ENDTIME").val() <= $("#BEGINTIME").val()) {
                    $scope.open("结束时间必须大于开始时间");
                    $("#ENDTIME").val("");
                    return;
                }else{
                    $scope.param.BEGINTIME = $("#BEGINTIME").val();
                    $scope.param.ENDTIME = $("#ENDTIME").val();
                }
            }else{
                $scope.param.BEGINTIME = $("#BEGINTIME").val();
                $scope.param.ENDTIME = $("#ENDTIME").val();
            }
            //查询生产单位转移汇总
            Init.iwbhttp('/transferSummary/queryTransferSummaryForCS', $scope.param, function (data, header, config, status) {
                var returnData = {};
                if (data.resFlag == 0) {
                    returnData.recordsTotal = data.totalRow;//返回数据全部记录
                    returnData.recordsFiltered = data.totalRow;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = data.dataList;//返回的数据列表
                    $scope.dataList = data.dataList;
                    if(data.dataList.length == 0){
                        $scope.showFlag = false;
                        $("#exportByCS").attr("disabled", true);
                    }else{
                        $scope.showFlag = true;
                        $("#exportByCS").attr("disabled", false);
                    }
                    callback(returnData);
                    if (data.num != null) {
                        $scope.orgNum = data.num.CS_NUM;
                        $scope.weight = data.num.WEIGHT;
                        $scope.transferNum = data.num.AMOUNT;
                    }
                } else {
                    $scope.open(data.msg);
                }
            }, function (data, header, config, status) {
            });
        },
        "searching": true,
        "ordering": false,
        "language": {
            "lengthMenu": "每页 _MENU_ 条记录 ",
            "zeroRecords": "没有找到记录",
            "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页,共_TOTAL_条 )",
            "infoEmpty": "无记录",
            "search": "搜索 _INPUT_",
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
        "scrollXInner": "100%"
    });

    //请求后台
    $scope.query = function(){
        $scope.table.draw();
    };

    $scope.export = function (){
        //请求参数赋值
        if(localStorageService.get("ROLEID") == null || localStorageService.get("ROLEID") == ""){
            $scope.param.ROLEID = "";
        }else{
            $scope.param.ROLEID = localStorageService.get("ROLEID");
        }
        if(localStorageService.get("orgCode") == null || localStorageService.get("orgCode") == ""){
            $scope.param.orgCode = "";
        }else{
            $scope.param.orgCode = localStorageService.get("orgCode");
        }
        $scope.param.orgCode = localStorageService.get("orgCode");
        $scope.param.userType = localStorageService.get("userType");
        $scope.param.epId = localStorageService.get("epId");
        if ($scope.table != undefined && $scope.table.search() != null) {
            $scope.searchContent = $scope.table.search();
        }
        $scope.param.searchContent = $scope.searchContent;
        if ($("#ENDTIME").val() != "" && $("#BEGINTIME").val() != "") {
            if ($("#ENDTIME").val() <= $("#BEGINTIME").val()) {
                $scope.open("结束时间必须大于开始时间");
                $("#ENDTIME").val("");
                return;
            }else{
                $scope.param.BEGINTIME = $("#BEGINTIME").val();
                $scope.param.ENDTIME = $("#ENDTIME").val();
            }
        }else{
            $scope.param.BEGINTIME = $("#BEGINTIME").val();
            $scope.param.ENDTIME = $("#ENDTIME").val();
        }
        //导出生产单位转移汇总
        Init.iwbhttp('/transferSummary/exportTransferSummaryForCS', $scope.param, function (data, header, config, status) {
            if (data.resFlag == 0) {
                $scope.path = $rootScope.baseUrl + data.path;
                var flag = true;
                var timer = $interval(function(){
                    if(flag){
                        document.getElementById("download").click();
                        flag = false;
                        $interval.cancel(timer);
                    }
                },1000);
            } else {
                $scope.open("导出失败");
            }
        }, function (data, header, config, status) {
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

    //延迟任务，时间控件点击
    var timer=$interval(function(){
        if($rootScope.dateClick){
            $("#BEGINTIME").click();
            $rootScope.dateClick = false;
        }
    },10,3);

}]);