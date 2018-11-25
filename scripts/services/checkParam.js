/**
 * Created by woody on 2015/10/7.
 */
angular.module('sbAdminApp').factory('CheckParam', ['$http',function($http){
    var checkRes = {
        checkSql : function(param){
            if(param != undefined && param != null && (param + "").indexOf("'") > -1){
                return param.replace(/'/g,'');
            }else{
                return param;
            }
        }
    };
    return checkRes;
}]);
