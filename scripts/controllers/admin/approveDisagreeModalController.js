'use strict';
angular.module('sbAdminApp').controller('DisagreeModalCtrl', ['$scope','$modalInstance','Init','parm','Modal', function ($scope, $modalInstance,Init,parm,Modal){
	//弹框标题
	$scope.content = "提示";
	//传入参数
	$scope.parm = parm;
	//弹框参数
	var resolve = {	};
	var url = "";
	var ctrlName = "";
	//确认
	$scope.ensureSave = function () {
		if($("#reason").val() == null || angular.equals("", $("#reason").val())){
			$scope.open("原因不能为空！");
			return;
		}else{
			if($("#reason").val().length > 200){
				$scope.open("原因字数不能超过200字！");
				return;
			}
		}
		var par = "";
		//管理员处理待办业务
		if(angular.equals("/admin/adminDealTask", parm.httpUrl)){
			par = {
				approveInfo:{
					epId:parm.epId,
					epName:parm.epName,
					bizId:parm.bizId,
					bizName:parm.bizName,
					bizStep:parm.bizStep,
					checkResult:parm.checkResult,
					checkAdvice:$("#reason").val(),
					btoId:parm.btoId,
					btoName:parm.btoName,
					btofId:parm.btofId,
					btofName:parm.btofName,
					applyId:parm.applyId
				}
			};
		}else if(angular.equals("/agreement/reject", parm.httpUrl)){//处置单位驳回医疗废物处置协议
			par = {
				AM_ID:parm.AM_ID,
				REASON:$("#reason").val()
			};
		}
		$("#sureBtn").attr("disabled",true);
		Init.iwbhttp(parm.httpUrl, par, function (data, header, config, status) {
			$scope.open(data.msg);
			if($scope.closeFlag = true){
				if(data.resFlag == '0'){
					$modalInstance.close('succeed');
				}else{
					$("#sureBtn").attr("disabled",false);
				}
			}
		}, function (data, header, config, status) {
		});

	};
	//取消
	$scope.cancel = function () {
		$modalInstance.close('cancel');
	};

	//弹框提示
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
			$scope.closeFlag = true;
		}, function () {
		});
	};
}]);