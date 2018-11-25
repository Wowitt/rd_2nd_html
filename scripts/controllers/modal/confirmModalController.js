'use strict';
angular.module('sbAdminApp').controller('ConfirmModalCtrl', ['$scope','$modalInstance','content','data', function ($scope, $modalInstance,content,data){
	$scope.content = content;
	//关闭方法
	$scope.cancel = function () {
		$modalInstance.dismiss('close');
	};
	//确定方法
	$scope.ensure = function () {
		$modalInstance.close(data);
	};
}]);