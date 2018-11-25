/**
 * Created by woody on 2015/10/7.
 */
angular.module('sbAdminApp').factory('CheckBrowser', ['$http','$rootScope','localStorageService','$state',function($http,$rootScope,localStorageService,$state){
    //console.log("========checkBrowser init =====================");
    var checkRes = {
        check : function(){
            var explorer = window.navigator.userAgent ;
            var currentUrl = window.location.href;
            var url = "";
            if(currentUrl.indexOf("/rd_2nd_html")>0){
                url = currentUrl.split("/rd_2nd_html")[0] + "/rd_2nd_html/index.html";
            }
            if(currentUrl.indexOf("#/")>0){
                url = currentUrl.split("#/")[0] + "/index.html";
            }
            if(currentUrl.indexOf("/main.html")>0){
                url = currentUrl.split("/main.html")[0] + "/index.html";
            }
            //console.log(currentUrl);
            //console.log(url);
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                //console.log("ie new");
                window.location.href = url;
            }else{
                //console.log("old");
                if (explorer.indexOf("MSIE") >= 0) {
                    //console.log("ie");
                    window.location.href = url;
                }
                else if (explorer.indexOf("Firefox") >= 0) {
                    //console.log("firefox");
                }
                else if(explorer.indexOf("Chrome") >= 0){
                    //console.log("Chrome");
                }
                else if(explorer.indexOf("Opera") >= 0){
                    //console.log("Opera");
                    window.location.href = url;
                }
                else if(explorer.indexOf("Safari") >= 0){
                    //console.log("Safari");
                }
                else if(explorer.indexOf("UCBrowser") >= 0){
                    //console.log("UCBrowser");
                }
                else{
                    //console.log("else");
                    window.location.href = url;
                }
            }
        }
    };
    return checkRes;
}]);
