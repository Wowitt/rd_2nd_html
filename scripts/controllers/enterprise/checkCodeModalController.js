'use strict';
angular.module('sbAdminApp').controller('CheckCodeModalCtrl', ['$scope','$modalInstance','path','$interval','$rootScope', function ($scope, $modalInstance,path,$interval,$rootScope){
	//弹框标题
	$scope.content = "二维码";
	//传入参数
	$scope.path = $rootScope.baseUrl + path;
	//取消
	$scope.cancel = function () {
		$modalInstance.close('cancel');
	};

	var connectTimer=$interval(function(){
		var oldPath = $("#codeImg").attr("src");
		if(oldPath == $rootScope.baseUrl+path){
			$interval.cancel(connectTimer);
		}else{
			$("#codeImg").attr("src", $rootScope.baseUrl+path);
		}
	},10);


}]);