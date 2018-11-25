'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('headerNotification',function(){
		return {
			templateUrl: 'scripts/directives/header/header-notification/header-notification.html',
			restrict: 'E',
			replace: true,
			scope: {

			},
			controller: function ($scope, Init, $rootScope,$location,$state,localStorageService,$modal,$log) {
				//$scope.title = localStorageService.get("appName");
				$scope.name = localStorageService.get("nickName");
				if(localStorageService.get("sepaName") != null && localStorageService.get("sepaName") != ""){
					var area = localStorageService.get("sepaName");
					if(area.indexOf("，") < 0){
						if(!angular.equals("admin", localStorageService.get("userType"))){
							//if (angular.equals("epAdminCs", localStorageService.get("userType")) || angular.equals("epAdminCz", localStorageService.get("userType"))){
							//	localStorageService.set("sepaName", "，" + localStorageService.get("epName") + "，" + localStorageService.get("sepaName") + "环保局");
							//}else{
							localStorageService.set("sepaName", localStorageService.get("sepaName") + "环保局");
							$scope.epName = localStorageService.get("epName");
							$scope.adminFlag = false;
							//}
						}else{
							localStorageService.set("sepaName", localStorageService.get("sepaName"));
							$scope.epName = localStorageService.get("sepaName");
							$scope.adminFlag = true;
						}
					}
				}
				$scope.area = localStorageService.get("sepaName");
				$scope.URL = "";
				var url = $location.url().substring(1);
				for(var i=0;i<url.length;i++){
					if(url.indexOf("/")>=0){
						url = url.replace("/",".");
					}else{
						break;
					}
				}
				$scope.URL = url;

				//注销
				$scope.logout = function () {
					Init.iwbhttp('/user/logout',{"name":localStorageService.get('userId')},function(data,header,config,status){
						if(data.resFlag == 0){
							var mail = localStorageService.get("MAIL");
							localStorageService.clearAll();
							localStorageService.set("MAIL", mail);
							$state.go("login");
						}
					},function(data,header,config,status){
					});
				};

				//个人设置
				$scope.modifyPwd = function () {
					$state.go("dashboard.modifyPwd");
				}


			}
		}
	});


