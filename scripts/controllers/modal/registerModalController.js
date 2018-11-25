'use strict';
angular.module('sbAdminApp').controller('RegisterModalCtrl', ['$scope','$modalInstance','content','data','$state','$interval', function ($scope, $modalInstance,content,data,$state,$interval){
	$scope.content = content;
	$scope.cancel = function () {
		$interval.cancel(timer);
		if(data != undefined && data != null && data.url != null && !angular.equals("",data.url)){
			$state.go(data.url,data,{reload: true });
		}
		$modalInstance.close('cancel');
	};

	var timer;

	if(data != undefined && data != null){
		//设定倒数秒数
		var t = 3;

		$scope.seconds = 3 + "秒后自动关闭窗口并跳转至首页......";

		timer = $interval(function(){
			t -= 1;
			$scope.seconds = t + "秒后自动关闭窗口并跳转至首页......";
			if(t==0){
				if($("#myModal").on('shown.bs.modal')){
					$scope.cancel();
				}
			}
		}, 1000, 3);
	}

}]);