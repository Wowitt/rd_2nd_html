/**
 * Created by woody on 2015/10/7.
 */
angular.module('sbAdminApp').factory('Modal', ['$modal',function($modal){
    var modalInstance = {
        modal : function (url, controller, resolve,myThen){
            $modal.open({
                templateUrl: url,
                controller: controller,
                resolve: resolve
            }).result.then(function (res) {
                myThen(res);
            }, function () {

            });
        }
    };
    return modalInstance;
}]);
