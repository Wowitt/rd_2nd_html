'use strict';
angular.module('sbAdminApp').controller('ApproveDetailModalCtrl', ['$scope','$modalInstance','Init','applyId', function ($scope, $modalInstance,Init,applyId){
	var table = "";
	//申请id
	var aa = applyId;
	//查询申请的流程列表
	Init.iwbhttp('/admin/checkApproveDetail', {applyId:aa}, function (data, header, config, status) {
		$scope.app = data.approveList;
		table = $('#approvesTable').DataTable({
			"data": $scope.app,
			"columns": [
				{
					"data": "CHECK_DATE"
				},
				{
					"data": "BIZ_TYPE"
				},
				{
					"data": "BTOF_NAME"
				},
				{
					"data": "BTO_NAME"
				},
				{
					"data": "CHECK_RESULT"
				},
				{
					"data": "CHECK_ADVICE"
				}
			],
			"ordering":true,
			"order": [[ 0, "desc" ]],
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
			"scrollXInner": "100%"
		});
	}, function (data, header, config, status) {
	});

	//取消
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};


}]);