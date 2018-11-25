'use strict';
angular.module('sbAdminApp').controller('PromptModalCtrl', ['$scope','$modalInstance','content','data','$state', 'localStorageService',function ($scope, $modalInstance,content,data,$state,localStorageService){
	$scope.content = content;
	$scope.cancel = function () {
		if(data != undefined && data != null && data.url != null && !angular.equals("",data.url)){
			$state.go(data.url,data,{reload: true });
		}
		if(angular.equals($scope.content,"系统异常，请重新登录！")){
			localStorageService.clearAll();
			$state.go("login");
		}
		$modalInstance.close(content);
	};
}]);