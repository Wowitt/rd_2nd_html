'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
    .directive('sidebar', ['$location', 'Init', function ($location, Init) {
        var getMenuList = function ($scope) {
            Init.iwbhttp('/menu/getMenuList', {}, function (data, header, config, status) {
                var menulist = (new Function("return " + data.menulist))();
                angular.forEach(menulist, function (value, i) {
                    value.son = (new Function("return " + value.son))();
                });
                $scope.menuList = menulist;
            }, function (data, header, config, status) {
            });
        }
        return {
            templateUrl: 'scripts/directives/sidebar/sidebar.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function ($scope, Init, $rootScope, localStorageService, $location, $timeout,$state) {
                getMenuList($scope);
                $scope.selectedMenu = 'dashboard';
                $scope.collapseVar = 0;
                if (localStorageService.get("collapse") != null) {
                    $scope.collapseVar = localStorageService.get("collapse");
                }
                var currentUrl = $location.path();
                if (currentUrl == "/dashboard/index" && localStorageService.get("newGuideFlag") == true) {
                    $(".newGuide").popover('show');
                    $timeout(function () {
                        $(".newGuide").popover('hide');
                    }, 2000);
                }
                $scope.multiCollapseVar = 0;
                $scope.check = function (x) {
                    if (x == $scope.collapseVar) {
                        $scope.collapseVar = 0;
                        localStorageService.set("collapse", 0);
                    } else {
                        $scope.collapseVar = x;
                        localStorageService.set("collapse", x);
                    }
                };

                $scope.multiCheck = function (y) {
                    if (y == $scope.multiCollapseVar) {
                        $scope.multiCollapseVar = 0;
                    } else {
                        $scope.multiCollapseVar = y;
                    }
                };
                //解决之前的提示未及时关闭的情况
                $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
                    if($(".newGuide")!=undefined && $(".newGuide")!=null)
                    {
                        $(".newGuide").popover('hide');
                    }
                })

            }
        }
    }]);