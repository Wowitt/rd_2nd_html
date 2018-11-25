'use strict';
angular.module('sbAdminApp').controller('TransferRunningListCtrl', ['$scope','Init','Modal','localStorageService','$state','CheckBrowser','CheckParam', function ($scope,Init,Modal,localStorageService,$state,CheckBrowser,CheckParam) {
    CheckBrowser.check();
    $.extend( $.fn.dataTable.defaults, {
        searching: true,
        ordering:  true
    } );

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    $scope.param = {};
    $scope.table;
    $scope.searchContent = "";

    //table数据
    $scope.table = $('#transferPlanRunningTable').DataTable({
        "serverSide": true,
        "columns": [
            {
                "data": "TP_ID"
            },
            {
                "data": "AM_ID"
            },
            {
                "data": "EN_NAME_CS"
            },
            {
                "data": "EN_NAME_ZZ"
            },
            {
                "data": "EN_NAME_CZ"
            },
            {
                "data": "BEGINTIME"
            },
            {
                "class": "mytable-borderNone",
                "data": "ENDTIME"
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
        ajax:function(data, callback, settings){
            $scope.param.ps = data.length +"";
            $scope.param.start = data.start + "";
            $scope.param.pn = ((data.start/data.length) +1)+"";
            $scope.param.EP_ID = localStorageService.get("epId");
            if($scope.table != undefined && $scope.table.search() != null){
                $scope.searchContent = $scope.table.search();
            }
            $scope.param.searchContent = CheckParam.checkSql($scope.searchContent);
            Init.iwbhttp('/plan/queryTransferRunningList', $scope.param, function(data,header,config,status){
                var returnData = {};
                if(data.resFlag == 0){
                    returnData.recordsTotal = data.totalRow;//返回数据全部记录
                    returnData.recordsFiltered = data.totalRow;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = data.dataList;//返回的数据列表
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
        "scrollXInner": "100%",
        "scrollY": "350px",
        "scrollCollapse": true,
        "fixedColumns":   {
            leftColumns:0,
            rightColumns: 1
        }
    });
    //查看详情
    $('#transferPlanRunningTable tbody').on('click', '#a_check', function () {
        var row = $scope.table.row($(this).parents('tr'));
        var data = row.data();
        $state.go("dashboard.transferRunningIndex.transferRunningInfo", {transferId:data.TP_ID,from:"dashboard.transferRunningIndex.transferRunningList"});
    });

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