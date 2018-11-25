/**
 * Created by John on 2016/11/1.
 */
'use strict';

angular.module('sbAdminApp')
    .directive('userList',function(){
        return {
            templateUrl:'scripts/directives/user-list/user-list.html',
            restrict: 'E',
            replace: true,
        }
    });

