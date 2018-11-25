'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('notifications',function(){
		return {
			templateUrl:'scripts/directives/notifications/notifications.html',
			restrict: 'E',
			replace: true,
			controller:function($scope,Init,$rootScope,localStorageService,$modal){
				$scope.finishedTaskFlagI = true;
				$scope.agreementFlagI = false;
				$scope.planFlagI = false;
				$scope.haulFlagI = false;
				$scope.agreementUrlI = "#";
				$scope.planUrlI = "#";
				if(localStorageService.get("userType") == "admin"){
					$scope.agreementUrlI = "dashboard.agreementForAdminIndex.agreementForAdminList";
					$scope.planUrlI = "dashboard.transferForAdminIndex.transferForAdminList";
				}else if(localStorageService.get("userType") == "epAdminCs"){
					$scope.agreementUrlI = "dashboard.agreementIndex.agreementList";
					$scope.planUrlI = "dashboard.transferIndex.transferList";
				}else if(localStorageService.get("userType") == "epAdminCz"){
					$scope.agreementUrlI = "dashboard.agreementIndexCz.agreementListCz";
				}
				var par = {
					"orgCode":localStorageService.get("orgCode"),
					"BTOF_ID":localStorageService.get("btofId"),
					"ROLEID":localStorageService.get("ROLEID"),
					"epId":localStorageService.get("epId")
				};
				Init.iwbhttp('/admin/queryData', par, function (data, header, config, status) {
					if (angular.equals("0", data.resFlag)) {
						$scope.finishedTaskNumI = data.finishedTaskNumI;
						if(data.agreementNumI >= 0){
							$scope.agreementFlagI = true;
							$scope.agreementNumI = data.agreementNumI;
						}
						if(data.planNumI >= 0){
							$scope.planFlagI = true;
							$scope.planNumI = data.planNumI;
						}
						if(data.hualNumI >= 0){
							$scope.hualFlagI = true;
							$scope.hualNumI = data.hualNumI;
						}
						if(data.billNumI >= 0){
							$scope.billFlagI = true;
							$scope.billNumI = data.billNumI;
						}
					} else {
						$scope.open(data.msg);
					}
				}, function (data, header, config, status) {
				});

				//ÌáÊ¾modalµ¯¿ò
				$scope.open = function (content,data) {
					var modalInstance = $modal.open({
						templateUrl: 'views/modal/promptModal.html',
						controller: 'PromptModalCtrl',
						resolve: {
							content: function () {
								return content;
							},
							data: function () {
								return data;
							}
						}
					});
					modalInstance.result.then(function () {
						//$log.info('success : ' + content);
					}, function () {
						//$log.info('error : ' + new Date());
					});
				};
			}
    	}
	});


