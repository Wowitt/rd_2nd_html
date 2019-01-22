/**
 * Created by John on 2016/12/21.
 */
'use strict';
angular.module('sbAdminApp').controller('EpCarManageCtrl', ['$rootScope', '$scope', 'Init', 'Modal', 'localStorageService', '$timeout', '$interval', 'CheckBrowser', function ($rootScope, $scope, Init, Modal, localStorageService, $timeout, $interval, CheckBrowser) {
    CheckBrowser.check();
    $scope.carRow = 0;
    var par = {epId: localStorageService.get("epId")};
    $scope.carData = new Array();
    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";
    //查询单位信息
    Init.iwbhttp('/enterprise/queryEnterpriseInfo', par, function (data, header, config, status) {
        $scope.carData = data.carData;
    }, function (data, header, config, status) {
    });
    //获取车辆类型
    $scope.carType = new Array();
    Init.iwbhttp('/enterprise/queryCarType', {}, function (data, header, config, status) {
        $scope.carType = data.carTypeList;
        $scope.id = $scope.carType[0];
    }, function (data, header, config, status) {
    });

    //延迟任务，添加下拉框预选值
    var timer=$interval(function(){
        if($scope.carData.length>0){
            for(var i=0;i<$scope.carData.length;i++){
                //每行用户类型标签id
                var selectid = "#carTypeT"+$scope.carData[i].sort;
                $(selectid).val($scope.carData[i].carType);
            }
        }
        var table=document.getElementById("carTable");
        if(table != null && table.rows != null){
            //交接员修改前行数
            $scope.carBeforeRow = table.rows.length;
        }
        var count = 0;
        if($scope.carData.length>0){
            for(var i=0;i<$scope.carData.length;i++){
                //每行用户类型标签id
                var selectid = "#carTypeT"+$scope.carData[i].sort;
                if($(selectid).val() == $scope.carData[i].carType){
                    count ++;
                }
            }
            if(count == $scope.carData.length){
                $interval.cancel(timer);
            }
        }
    },10);

    //拼接select下拉框
    function spellStr(carTypeT){
        var str = "";
        if($scope.carType.length > 0){
            str = "<select id='" + carTypeT + "' class='form-control'>";
            for(var i = 0; i < $scope.carType.length; i ++){
                str += "<option value='" + $scope.carType[i].value + "'>" + $scope.carType[i].name + "</option>";
            }
            str += "</select>";
        }
        return str;
    }

    //车添加
    $scope.carAdd = function () {
        var tableobj = document.getElementById("carTable");
        var rowobj = tableobj.insertRow(tableobj.rows.length);
        var index = tableobj.rows.length - 3;
        var cell1 = rowobj.insertCell(rowobj.cells.length);
        var cell2 = rowobj.insertCell(rowobj.cells.length);
        var cell3 = rowobj.insertCell(rowobj.cells.length);
        var cell4 = rowobj.insertCell(rowobj.cells.length);
        var cell5 = rowobj.insertCell(rowobj.cells.length);
        var cell6 = rowobj.insertCell(rowobj.cells.length);
        var cell7 = rowobj.insertCell(rowobj.cells.length);
        var carNumT = "carNumT" + tableobj.rows.length;
        var carTypeT = "carTypeT" + tableobj.rows.length;
        var permitT = "permitT" + tableobj.rows.length;
        var carIdT = "carIdT" + tableobj.rows.length;
        var tareT = "tareT" + tableobj.rows.length;
        var carCodePathT = "carCodePathT" + tableobj.rows.length;
        cell1.innerHTML = "<input type='text' id=" + carNumT + " class='form-control'>";
        cell2.innerHTML = spellStr(carTypeT);
        cell3.innerHTML = "<input type='text' id=" + permitT + " class='form-control'>";
        cell4.innerHTML = "<input type='text' id=" + tareT + " class='form-control'>";
        cell5.innerHTML = "<a id='createCode' href='javascript:void(0);'>生成二维码</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='checkCode' href='javascript:void(0);'>查看二维码</a></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id='delCar' href='javascript:void(0);'>删除</a>";
        cell6.innerHTML = "<input type='text' id=" + carIdT + " class='form-control'>";
        cell6.style.display = "none";
        cell7.innerHTML = "<input type='text' id=" + carCodePathT + " class='form-control'>";
        cell7.style.display = "none";
    }
    //车添加、删除
    $('#carTable tbody').on('click', 'tr', function () {
        if(this.rowIndex != 0 && this.rowIndex != 1){
            $(this).parent().find("tr.tablebg").toggleClass("tablebg");//取消原先选中行
            $(this).toggleClass("tablebg");//设定当前行为选中行
            $scope.carRow = this.rowIndex;
        }
    });

    //车删除
    $('#carTable tbody').on('click', '#delCar', function () {
        $timeout(function () {
            var carNum = document.getElementById("carTable").rows[$scope.carRow].cells[0].childNodes[0].value;
            var carId = document.getElementById("carTable").rows[$scope.carRow].cells[5].childNodes[0].value;
            var parm = {
                carId: carId,
                epId: localStorageService.get("epId"),
                carNum: carNum
            };
            var msg = "确定删除该车辆？";
            url = 'views/modal/confirmModal.html';
            ctrlName = 'ConfirmModalCtrl';
            resolve = {
                content: function () {
                    return msg;
                },
                data: function () {
                    return parm;
                }
            };
            var modalInstance = Modal.modal(url, ctrlName, resolve, function (returnData) {
                Init.iwbhttp('/enterprise/delCar', returnData, function (data, header, config, status) {
                    if (data.resFlag == "0") {
                        url = 'views/modal/promptModal.html';
                        ctrlName = 'PromptModalCtrl';
                        resolve = {
                            content: function () {
                                return data.msg;
                            },
                            data: function () {
                                return data;
                            }
                        };
                        var modalInstance = Modal.modal(url, ctrlName, resolve, function () {
                            var i = $scope.carRow;
                            if (i == 0 || i == 1) {
                                return;
                            }
                            var tableobj = document.getElementById("carTable");
                            tableobj.deleteRow(i);
                        }, function () {

                        });
                        /*var modalInstance = $modal.open({
                            templateUrl: 'views/modal/promptModal.html',
                            controller: 'PromptModalCtrl',
                            resolve: {
                                content: function () {
                                    return data.msg;
                                },
                                data: function () {
                                    return data;
                                }
                            }
                        });
                        modalInstance.result.then(function () {
                            var i = $scope.carRow;
                            if (i == 0 || i == 1) {
                                return;
                            }
                            var tableobj = document.getElementById("carTable");
                            tableobj.deleteRow(i);
                        }, function () {
                        });*/
                    } else {
                        if(data.resFlag == '3'){
                            data.msg = "删除成功！"
                        }
                        $scope.open(data.msg, data);
                    }
                }, function (data, header, config, status) {
                });
            }, function () {

            });
            /*var modalInstance = $modal.open({
                templateUrl: 'views/modal/confirmModal.html',
                controller: 'ConfirmModalCtrl',
                resolve: {
                    content: function () {
                        return msg;
                    },
                    data: function () {
                        return parm;
                    }
                }
            });
            modalInstance.result.then(function (returnData) {
                //$log.info('ensure : ' + returnData);
                Init.iwbhttp('/enterprise/delCar', returnData, function (data, header, config, status) {
                    if (data.resFlag == "0") {
                        var modalInstance = $modal.open({
                            templateUrl: 'views/modal/promptModal.html',
                            controller: 'PromptModalCtrl',
                            resolve: {
                                content: function () {
                                    return data.msg;
                                },
                                data: function () {
                                    return data;
                                }
                            }
                        });
                        modalInstance.result.then(function () {
                            //$log.info('success : ' + data.msg);
                            var i = $scope.carRow;
                            if (i == 0 || i == 1) {
                                return;
                            }
                            var tableobj = document.getElementById("carTable");
                            tableobj.deleteRow(i);
                        }, function () {
                            //$log.info('error : ' + new Date());
                        });
                    } else {
                        if(data.resFlag == '3'){
                            data.msg = "删除成功！"
                        }
                        $scope.open(data.msg, data);
                    }
                }, function (data, header, config, status) {
                });
            }, function (returnData) {
                //$log.info('cancel : ' + returnData);
            });*/
        }, 500);
    });

    //保存
    $scope.save = function () {
        var cars = new Array();
        var table = document.getElementById("carTable");
        var row = table.rows.length;
        for (var i = 2; i < row; i++) {
            var index2 = cars.length;
            //给table的某行单元格赋值
            var carNum = table.rows[i].cells[0].childNodes[0].value;
            var carType = table.rows[i].cells[1].childNodes[0].value;
            var permit = table.rows[i].cells[2].childNodes[0].value;
            var carId = table.rows[i].cells[5].childNodes[0].value;
            var tare = table.rows[i].cells[3].childNodes[0].value;
            var carCodePath = table.rows[i].cells[6].childNodes[0].value;
            if (carNum != undefined) {
                if (carNum != null && carNum != "" && carType != null && carType != "" && permit != null && permit != "" && tare != null && tare != "") {
                    cars[index2] = new Object();
                    for (var j = 0; j < index2; j++) {
                        if (cars[j].carNum == carNum) {
                            $scope.content = "车辆牌照号不能重复";
                            $scope.open($scope.content);
                            return;
                        }
                        if (cars[j].permit == permit) {
                            $scope.content = "运输许可证号不能重复";
                            $scope.open($scope.content);
                            return;
                        }
                    }
                    cars[index2].carNum = carNum;
                    cars[index2].carType = carType;
                    cars[index2].permit = permit;
                    cars[index2].tare = tare;
                    cars[index2].codePath = carCodePath;
                    if (carId != null && carId != "") {
                        cars[index2].carId = carId;
                    } else {
                        cars[index2].carId = "";
                    }
                    if($.trim(cars[index2].carNum).length > 0 && $.trim(cars[index2].carNum).length > 30){
                        $scope.content = "车辆牌照号太长";
                        $scope.open($scope.content);
                        return;
                    }
                    var patrn=/^[冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5}[a-zA-Z0-9挂学警港澳]{1}$/;
                    if (!patrn.exec(cars[index2].carNum)){
                        $scope.open("车辆牌照号输入不正确，请重新输入");
                        return;
                    }else{
                        cars[index2].carNum = $.trim(cars[index2].carNum);
                    }
                    if (cars[index2].carType.length > 3) {
                        $scope.content = "车辆类型太长";
                        $scope.open($scope.content);
                        return;
                    }
                    if (cars[index2].permit.length > 20) {
                        $scope.content = "运输许可证号太长";
                        $scope.open($scope.content);
                        return;
                    }
                    if (cars[index2].tare.length > 20) {
                        $scope.content = "皮重数值太大";
                        $scope.open($scope.content);
                        return;
                    }
                    //var patrn = /^(([1-9]+)|([0-9]+\.[0-9]{0,3}))$/;
                    var patrn = /^[1-9]\d{0,6}(?:|\.\d{0,6})$/;
                    if (!patrn.exec(cars[index2].tare)) {
                        $scope.content = "您输入的皮重格式不对，请重新输入";
                        $scope.open($scope.content);
                        return;
                    }
                } else if ((carNum == null || carNum == "") && (carType == null || carType == "") && (permit == null || permit == "") && (tare == null || tare == "")) {
                } else {
                    $scope.content = "请完善车辆信息";
                    $scope.open($scope.content);
                    return;
                }
            }
        }
        var par = {
            epId: localStorageService.get("epId"),
            cars: cars
        };
        //车辆管理
        Init.iwbhttp('/enterprise/carManage', par, function (data, header, config, status) {
            $scope.open(data.msg);
            var carList = new Array;
            carList = data.carList;
            for (var i = 2; i < row; i++) {
                for (var j = 0; j < carList.length; j++) {
                    if (document.getElementById("carTable").rows[i].cells[0].childNodes[0].value == carList[j].carNum) {
                        document.getElementById("carTable").rows[i].cells[5].childNodes[0].value = carList[j].carId;
                    }
                }
            }
        }, function (data, header, config, status) {
        });
    }

    //生成二维码
    $('#carTable tbody').on('click', '#createCode', function () {
        $timeout(function () {
            var carNum = document.getElementById("carTable").rows[$scope.carRow].cells[0].childNodes[0].value;
            var carType = document.getElementById("carTable").rows[$scope.carRow].cells[1].childNodes[0].value;
            var permit = document.getElementById("carTable").rows[$scope.carRow].cells[2].childNodes[0].value;
            var tare = document.getElementById("carTable").rows[$scope.carRow].cells[3].childNodes[0].value;
            var carId = document.getElementById("carTable").rows[$scope.carRow].cells[5].childNodes[0].value;
            var para = {
                "roleType": "2",
                "PLATE_NUMBER": carNum,
                "CI_ID": carId,
                "EN_ID_CZ": localStorageService.get("epId"),
                "EN_NAME_CZ": localStorageService.get("epName"),
                "CARTYPE": carType,
                "PERMITNUM": permit,
                "TARE": tare
            };
            Init.iwbhttp('/enterprise/createCodeInfo', para, function (data, header, config, status) {
                $scope.open(data.msg);
                if (data.resFlag == "0") {
                    document.getElementById("carTable").rows[$scope.carRow].cells[6].childNodes[0].value = data.codePath;
                }
            }, function (data, header, config, status) {
            });
        }, 500);
    });

    //查看二维码
    $('#carTable tbody').on('click', '#checkCode', function () {
        $timeout(function () {
            var plateNumber = document.getElementById("carTable").rows[$scope.carRow].cells[0].childNodes[0].value;
            var carId = document.getElementById("carTable").rows[$scope.carRow].cells[5].childNodes[0].value;
            var para = {
                plateNumber: plateNumber,
                epId: localStorageService.get("epId"),
                carId: carId
            };
            Init.iwbhttp('/enterprise/queryCodeInfoForCar', para, function (data, header, config, status) {
                if (data.resFlag == "0") {
                    if (data.path == "") {
                        $scope.open("该车辆还未生成二维码！");
                    } else {
                        url = 'views/dashboard/enterprise/checkCodeModal.html';
                        ctrlName = 'CheckCodeModalCtrl';
                        resolve = {
                            path: function () {
                                return data.path;
                            }
                        };
                        var modalInstance = Modal.modal(url, ctrlName, resolve, function () {

                        }, function () {

                        });
                        /*var modalInstance = $modal.open({
                            templateUrl: 'views/dashboard/enterprise/checkCodeModal.html',
                            controller: 'CheckCodeModalCtrl',
                            resolve: {
                                path: function () {
                                    return data.path;
                                }
                            }
                        });
                        modalInstance.result.then(function () {
                            //$log.info('success : ' + new Date());
                        }, function () {
                            //$log.info('error : ' + new Date());
                        });*/
                    }
                } else {
                    $scope.open(data.msg);
                }
            }, function (data, header, config, status) {
            });
        }, 500);
    });

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
            //删除车辆信息
            if(data != undefined && data != null && data != "") {
                //判断是否删除成功
                if (data.resFlag == "3") {
                    var i = $scope.carRow;
                    if (i == 0 || i == 1) {
                        return;
                    }
                    var tableobj = document.getElementById("carTable");
                    tableobj.deleteRow(i);
                }
            }
        }, function () {

        });
    };
}]);
