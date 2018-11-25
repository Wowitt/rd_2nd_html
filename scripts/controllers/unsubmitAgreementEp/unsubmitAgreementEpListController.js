'use strict';
angular.module('sbAdminApp').controller('UnsubmitAgreementEpListCtrl', ['$scope', 'Init', 'Modal',  '$rootScope', 'localStorageService', 'CheckBrowser', '$interval', 'CheckParam', function ($scope, Init, Modal, $rootScope, localStorageService, CheckBrowser, $interval, CheckParam) {
    CheckBrowser.check();
    $.extend($.fn.dataTable.defaults, {
        searching: true,
        ordering: false
    });
    $scope.param = {};
    var table;
    $scope.searchContent = "";
    $scope.sepaList = "";
    $scope.dataList = new Array();
    $scope.sepaFlag = true;
    $scope.path = "";

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    //所属环保局默认全选
    $scope.sepaContent = "所属环保局：全部";

    //table数据
    table = $('#epTable').DataTable({
        "serverSide": true,
        "columns": [
            {
                "visible": false,
                "data": "EP_ID_CS"
            },
            {
                "data": "EP_NAME_CS"
            },
            {
                "visible": false,
                "data": "EP_ID_CZ"
            },
            {
                "data": "EP_NAME_CZ"
            },
            {
                "visible": false,
                "data": "EP_ID_ZZ"
            },
            {
                "data": "EP_NAME_ZZ"
            },
            {
                "data": "TEL"
            },
            {
                "visible": false,
                "data": "BELONGSEPA"
            },
            {
                "data": "SEPA_NAME"
            }
        ],
        ajax: function (data, callback, settings) {
            //请求参数赋值
            $scope.param.ps = data.length + "";
            $scope.param.pn = ((data.start / data.length) + 1) + "";
            $scope.param.ROLEID = localStorageService.get("ROLEID");
            $scope.param.orgCode = localStorageService.get("orgCode");
            if (table != undefined && table.search() != null) {
                $scope.searchContent = table.search();
            }
            $scope.param.searchContent = CheckParam.checkSql($scope.searchContent);
            $scope.param.sepaValue = $scope.sepaValue;
            //查询未提交转移计划
            Init.iwbhttp('/admin/queryUnsubmitPlanEp', $scope.param, function (data, header, config, status) {
                var returnData = {};
                if (data.resFlag == 0) {
                    returnData.recordsTotal = data.totalRow;//返回数据全部记录
                    returnData.recordsFiltered = data.totalRow;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = data.epList;//返回的数据列表
                    $scope.dataList = data.epList;
                    if($scope.dataList.length == 0){
                        $("#export").attr("disabled", true);
                    }else{
                        $("#export").attr("disabled", false);
                    }
                    if($scope.sepaList == ""){
                        if(data.sepaList != null && data.sepaList != ""){
                            $scope.sepaList = data.sepaList;
                        }else{
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
        "scrollX": true,
        "scrollXInner": "100%"
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
        if(checkLength==0){
            $('#sepaDivId input[value='+$scope.sepaValue+']').prop('checked', true);
            $scope.open("至少选择一个所属环保局");
            return;
        }
        $scope.sepaContent = "";
        $scope.sepaValue = "";
        //是否全选
        if(checkLength==$scope.sepaList.length){
            $scope.sepaContent = "所属环保局：全部";
            $scope.sepaValue = "";
        }else{
            $('input[name="sepa"]:checked').each(function () {
                var statusVal = $(this).val();
                for (var i = 0; i < $scope.sepaList.length; i++) {
                    if ($scope.sepaList[i].value == statusVal) {
                        if ($scope.sepaContent == null || $scope.sepaContent == "") {
                            $scope.sepaContent = "所属环保局："+$scope.sepaList[i].text;
                            $scope.sepaValue = "'"+$scope.sepaList[i].value+"'";
                        } else {
                            $scope.sepaContent = $scope.sepaContent + "，" + $scope.sepaList[i].text;
                            $scope.sepaValue = $scope.sepaValue + ",'" + $scope.sepaList[i].value+"'";
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
        //请求参数赋值
        if (table != undefined && table.search() != null) {
            $scope.searchContent = table.search();
        }
        var url = "";
        $scope.param.searchContent = $scope.searchContent;
        $scope.param.sepaValue = $scope.sepaValue;
        //查询未提交转移计划
        Init.iwbhttp('/admin/queryUnsubmitPlanEp', $scope.param, function (data, header, config, status) {
            if (data.resFlag == 0) {
                for(var i = 0 ; i < data.epList.length ; i++)
                {
                    table.row(i).columns = data.epList[i];
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

    $scope.export = function (){
        //请求参数赋值
        $scope.param.ROLEID = localStorageService.get("ROLEID");
        $scope.param.orgCode = localStorageService.get("orgCode");
        if (table != undefined && table.search() != null) {
            $scope.searchContent = table.search();
        }
        $scope.param.searchContent = $scope.searchContent;
        $scope.param.sepaValue = $scope.sepaValue;
        //导出未提交转移计划信息
        Init.iwbhttp('/admin/exportUnSubmitPlan', $scope.param, function (data, header, config, status) {
           console.log(JSON.stringify(data));
            if (data.resFlag == 0) {
                $scope.path = $rootScope.baseUrl + data.path;
                var flag = true;
                //若不延时，<a>未赋值成功则调用点击事件不会下载成功
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


}]);