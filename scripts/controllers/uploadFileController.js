/**
 * Created by John on 2016/11/11.
 */
'use strict';
angular.module('sbAdminApp').controller('UploaderController', ['$scope','Init','$http', function ($scope,Init,$http) {
    $scope.setFile = function(element) {
        $scope.$apply(function($scope) {
            $scope.theFile = element.files[0];
            console.log($scope.theFile);
            var fd = new FormData();
            fd.append('Filedata', $scope.theFile);
            $http({
                method: 'POST',
                url: "http://192.168.0.201:9001/demo/uploadFile",
                data: fd,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).success(function (response) {
                //上传成功的操作
                console.log(response);
                console.log(response.fileInfo.upload_path);
                $scope.avatar = response.fileInfo.upload_path;
                //$("#imgFile").attr("src",response.fileInfo.upload_path);
                alert("uplaod success");
            }).error(function (response) {
                //上传失败的操作
                console.log(response);
                console.log("uplaod error");
            });
        });
    };
}]);