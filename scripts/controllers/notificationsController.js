'use strict';
angular.module('sbAdminApp').controller('NotificationsCtrl', ['$scope', '$modal','$log', function ($scope, $modal, $log){
	$scope.items = ['item1', 'item2', 'item3'];
	$scope.open = function (size) {
	    var modalInstance = $modal.open({
	      templateUrl: 'views/modal/modal.html',
	      controller: 'ModalCtrl',
	      size: size,
	      resolve: {
	        items: function () {
	          return $scope.items;
	        }
	      }
	    });
	    modalInstance.result.then(function (selectedItem) {
	      $scope.selected = selectedItem;
	      $log.info('iii  selectedddd is : ' + $scope.selected);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
  	};
}]);