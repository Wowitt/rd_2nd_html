'use strict';
angular.module('sbAdminApp').controller('MenuCtrl', ['$scope','Init','Modal','CheckBrowser', function ($scope,Init,Modal,CheckBrowser) {
    CheckBrowser.check();
    //菜单树形数据
    $scope.menuTree = new Array();
    //菜单状态选项
    $scope.menuStatus = [
        {"value":"0","type":"请选择..."},
        {"value":"1","type":"停用"},
        {"value":"2","type":"启用"}
    ];
    //菜单状态
    $scope.status = $scope.menuStatus[0];

    //弹框参数
    var resolve = {};
    var url = "";
    var ctrlName = "";

    //树的样式
    $scope.menuTreeOptions = {
        nodeChildren: "children",
        dirSelectable: true,
        injectClasses: {
            ul: "c-ul",
            li: "c-li",
            liSelected: "c-liSelected",
            iExpanded: "c-iExpanded",
            iCollapsed: "c-iCollapsed",
            iLeaf: "c-iLeaf",
            label: "c-label",
            labelSelected: "c-labelSelected"
        }
    }
    $scope.expandedNodes = new Array();
    //查询菜单列表
    Init.iwbhttp('/menu/queryMenu', {}, function (data, header, config, status) {
        $scope.menuTree = data.menuList;
        //重新给expandedNodes赋值，使tree展开
        $scope.spread();
    }, function (data, header, config, status) {
    });

    //重新给expandedNodes赋值，使tree展开
    $scope.spread = function () {
        var count = 0;
        if($scope.menuTree.length > 0){
            for(var i = 0; i < $scope.menuTree.length; i ++){
                $scope.expandedNodes[count] = $scope.menuTree[i];
                count = count + 1;
                if($scope.menuTree[i].children.length > 0){
                    for(var j = 0; j < $scope.menuTree[i].children.length; j ++){
                        $scope.expandedNodes[count] = $scope.menuTree[i].children[j];
                        count = count + 1;
                        if($scope.menuTree[i].children[j].children.length > 0){
                            for(var m = 0; m < $scope.menuTree[i].children[j].children.length; m ++){
                                $scope.expandedNodes[count] = $scope.menuTree[i].children[j].children[m];
                                count = count + 1;
                                if($scope.menuTree[i].children[j].children[m].children.length > 0){
                                    for(var n = 0; n < $scope.menuTree[i].children[j].children[m].children.length; n ++){
                                        $scope.expandedNodes[count] = $scope.menuTree[i].children[j].children[m].children[n];
                                        count = count + 1;
                                        if($scope.menuTree[i].children[j].children[m].children[n].children.length > 0){
                                            for(var s = 0; s < $scope.menuTree[i].children[j].children[m].children[n].children.length; s ++){
                                                $scope.expandedNodes[count] = $scope.menuTree[i].children[j].children[m].children[n].children[s];
                                                count = count + 1;
                                                if($scope.menuTree[i].children[j].children[m].children[n].children[s].children.length > 0){
                                                    for(var t = 0; t < $scope.menuTree[i].children[j].children[m].children[n].children[s].children.length; t ++){
                                                        $scope.expandedNodes[count] = $scope.menuTree[i].children[j].children[m].children[n].children[s].children[t];
                                                        count = count + 1;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    //选中树中的某个节点（某个菜单）
    $scope.selectedNode = "";
    $scope.showSelected = function(sel){
        $scope.selectedNode = sel;
        if(!angular.equals("",$scope.selectedNode)){
            $scope.menuId = $scope.selectedNode.level;
            if($scope.menuId != "WF201703151248356572"){
                Init.iwbhttp('/menu/queryMenuInfo', {menuId:$scope.menuId}, function (data, header, config, status) {
                    //赋值
                    $scope.menuName = data.menuInfo.menuName;
                    $scope.status = $scope.menuStatus[parseInt(data.menuInfo.status)+1];
                }, function (data, header, config, status) {
                });
            }else{
                $scope.menuName = "";
                $scope.status = $scope.menuStatus[0];
            }
        }
    }

    //验证表单、修改菜单
    $scope.save = function(){
        if(angular.equals("",$scope.selectedNode)){
            $scope.data = "请先选中一个菜单，再进行操作";
            $scope.open($scope.data);
            return;
        }
        if($scope.menuName == null || angular.equals("", $scope.menuName)){
            $scope.data = "菜单名称不能为空";
            $scope.open($scope.data);
            return;
        }
        var patrn=/^[\u4e00-\u9fa5a-zA-Z]+$/;
        if (!patrn.exec($scope.menuName)){
            $scope.open("菜单名称输入不正确，请重新输入");
            return;
        }
        if($scope.status.value == null || angular.equals("0", $scope.status.value)){
            $scope.data = "请选择一个状态";
            $scope.open($scope.data);
            return;
        }
        var status1 = (parseInt($scope.status.value)-1) + "";
        var par =
        {
            "menuId":$scope.selectedNode.level,
            "status":status1,
            "menuName":$scope.menuName
        };
        Init.iwbhttp('/menu/updateMenu', par, function (data, header, config, status) {
            $scope.open(data.msg);
        }, function (data, header, config, status) {
        });
    };

    //修改后赋值
    $scope.refreshForModify = function (){
        var menu = {index:$scope.selectedNode.index,grade:$scope.selectedNode.grade,sort:$scope.selectedNode.sort,level:$scope.selectedNode.level,belongId:$scope.selectedNode.belongId,name:$scope.menuName,"children":$scope.selectedNode.children,"type":$scope.selectedNode.type};
        if($scope.menuTree.length > 0){
            for(var i = 0; i < $scope.menuTree.length; i ++){
                if(angular.equals($scope.selectedNode.level, $scope.menuTree[i].level)){
                    $scope.menuTree[i] = menu;
                }
                if($scope.menuTree[i] != undefined && $scope.menuTree[i].children != undefined && $scope.menuTree[i].children != null && $scope.menuTree[i].children.length > 0){
                    for(var j = 0; j < $scope.menuTree[i].children.length; j ++){
                        if(angular.equals($scope.selectedNode.level, $scope.menuTree[i].children[j].level)){
                            $scope.menuTree[i].children[j] = menu;
                        }
                        if($scope.menuTree[i].children[j] != undefined && $scope.menuTree[i].children[j].children != undefined && $scope.menuTree[i].children[j].children != null && $scope.menuTree[i].children[j].children.length > 0){
                            for(var m = 0; m < $scope.menuTree[i].children[j].children.length; m ++){
                                if(angular.equals($scope.selectedNode.level, $scope.menuTree[i].children[j].children[m].level)){
                                    $scope.menuTree[i].children[j].children[m] = menu;
                                }
                                if($scope.menuTree[i].children[j].children[m] != undefined && $scope.menuTree[i].children[j].children[m].children != undefined && $scope.menuTree[i].children[j].children[m].children != null && $scope.menuTree[i].children[j].children[m].children.length > 0){
                                    for(var n = 0; n < $scope.menuTree[i].children[j].children[m].children.length; n ++){
                                        if(angular.equals($scope.selectedNode.level, $scope.menuTree[i].children[j].children[m].children[n].level)){
                                            $scope.menuTree[i].children[j].children[m].children[n] = menu;
                                        }
                                        if($scope.menuTree[i].children[j].children[m].children[n] != undefined && $scope.menuTree[i].children[j].children[m].children[n].children != undefined && $scope.menuTree[i].children[j].children[m].children[n].children != null && $scope.menuTree[i].children[j].children[m].children[n].children.length > 0){
                                            for(var s = 0; s < $scope.menuTree[i].children[j].children[m].children[n].children.length; s ++){
                                                if(angular.equals($scope.selectedNode.level, $scope.menuTree[i].children[j].children[m].children[n].children[s].level)){
                                                    $scope.menuTree[i].children[j].children[m].children[n].children[s] = menu;
                                                }
                                                if($scope.menuTree[i].children[j].children[m].children[n].children[s] != undefined && $scope.menuTree[i].children[j].children[m].children[n].children[s].children != undefined && $scope.menuTree[i].children[j].children[m].children[n].children[s].children != null && $scope.menuTree[i].children[j].children[m].children[n].children[s].children.length > 0){
                                                    for(var t = 0; t < $scope.menuTree[i].children[j].children[m].children[n].children[s].children.length; t ++){
                                                        if(angular.equals($scope.selectedNode.level, $scope.menuTree[i].children[j].children[m].children[n].children[s].children[t].level)){
                                                            $scope.menuTree[i].children[j].children[m].children[n].children[s].children[t] = menu;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
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
        var modalInstance = Modal.modal(url, ctrlName, resolve, function (data) {
            if(angular.equals("保存成功！", data)){
                $scope.refreshForModify();
                $scope.selectedNode = undefined;
                $scope.menuName = "";
                $scope.status = $scope.menuStatus[0];
                $scope.spread();
            }
        }, function () {

        });
    };

}]);