'use strict';
angular.module('sbAdminApp').controller('ModifyTransferOrgDetailModalCtrl', ['$scope','$modalInstance','Init','amId', 'tpId',function ($scope, $modalInstance,Init,amId,tpId){
	var table = "";
	//申请id
	var AM_ID = amId;
	var TP_ID = tpId;
	//查询修改的转移机构列表
	Init.iwbhttp('/plan/queryModifyTransferOrgList', {AM_ID:AM_ID,TP_ID:TP_ID}, function (data, header, config, status) {
		$scope.app = data.orgList;
		table = $('#modifyTransferOrgTable').DataTable({
			"data": $scope.app,
			"columns": [
				{
					"data": "EN_NAME_ZZ"
				},
				{
					"data": "SEPA_NAME"
				},
				{
					"data": "sysdate"
				}
			],
			"ordering":true,
			"order": [[ 2, "desc" ]],
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
			"pagingType": "full_numbers"
		});
	}, function (data, header, config, status) {
	});

	//取消
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};


}]);