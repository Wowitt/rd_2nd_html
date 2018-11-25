/**
 * Created by woody on 2015/10/7.
 */
angular.module('sbAdminApp').factory('Init', ['$http','$rootScope','localStorageService','$state','$location',function($http,$rootScope,localStorageService,$state,$location){
    console.log("========services init =====================");
    var userInit = function(data)
    {
        localStorageService.set('IWBSESSION',data.IWBSESSION);
        localStorageService.set('nickName',data.nickName);
        localStorageService.set('ifLogin',data.ifLogin);
        localStorageService.set('userId',data.userId);
        localStorageService.set('userType',data.userType);
        localStorageService.set('belongS',data.belongS);
        localStorageService.set('belongQ',data.belongQ);
        localStorageService.set('orgCode',data.orgCode);
        localStorageService.set('epId',data.epId);
        localStorageService.set('epName',data.epName);
        localStorageService.set('belongSepa',data.belongSepa);
        localStorageService.set('sepaName',data.sepaName);
        localStorageService.set('status',data.status);
        if(data.newGuideFlag != undefined && data.newGuideFlag != null){
            localStorageService.set('newGuideFlag',data.newGuideFlag);
        }else{
            localStorageService.set('newGuideFlag',false);
        }
        //sessionStorage.setItem('IWBSESSION',data.IWBSESSION);
        //sessionStorage.setItem('nickName',data.nickName);
        //sessionStorage.setItem('ifLogin',data.ifLogin);
        //sessionStorage.setItem('userId',data.userId);
        //sessionStorage.setItem('belongS',data.belongS);
        //sessionStorage.setItem('belongQ',data.belongQ);
        //sessionStorage.setItem('orgCode',data.orgCode);
        //sessionStorage.setItem('epId',data.epId);
        //sessionStorage.setItem('epName',data.epName);
        if(data.userPortrait == '' || data.userPortrait == null || data.userPortrait == undefined)
        {
            localStorageService.set('userPortrait','');
            //sessionStorage.setItem('userPortrait','');
            $rootScope.userPortrait = $rootScope.loginPic;
        }
        else
        {
            localStorageService.set('userPortrait',$rootScope.baseUrl+data.contextPath+data.userPortrait);
            $rootScope.userPortrait = localStorageService.get('userPortrait');
            //sessionStorage.setItem('userPortrait',$rootScope.baseUrl+data.contextPath+data.userPortrait);
            //$rootScope.userPortrait = sessionStorage.getItem('userPortrait');
        }
        if(data.ifLogin == '1')
        {
            $rootScope.nickName = data.nickName;
            $rootScope.tel = data.tel;
            $rootScope.mail = data.mail;
            $rootScope.loginUrl = 'login';
            $rootScope.userId = data.userId;
        }else
        {
            $rootScope.nickName = $rootScope.logintitle;
        }
    };
    var initRes = {
        iwbhttp : function(url,data,success,error){
            //console.log("init=====>>"+JSON.stringify($state.current));
            data['IWBSESSION'] = localStorageService.get('IWBSESSION');
            data['WJWT'] = localStorageService.get('WJWT');
            //data['IWBSESSION'] = sessionStorage.getItem('IWBSESSION');
            data['DEVICE_UUID'] = $rootScope.uuid;
            data['CURRENT_URL'] =  $location.url();
            data['USER_ID'] = localStorageService.get('userId');
            $http({
                url:$rootScope.baseUrl+$rootScope.baseUrlPath+url,
                data: "params="+JSON.stringify(data),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST'
                //method:'GET'
            }).success(function(data,header,config,status){
                localStorageService.set('IWBSESSION',data.IWBSESSION);
                localStorageService.set('WJWT',data.WJWT);
                userInit(data);
                //sessionStorage.setItem('IWBSESSION',data.IWBSESSION);
                //console.log("init11=====>>"+JSON.stringify(data));
                if(data.IWBSESSION == null || angular.equals("",data.IWBSESSION)){
                    if(!angular.equals("/login/epLogin", url) && !angular.equals("/login/adminLogin", url) && !angular.equals("/login/epAdminLogin", url) && !angular.equals("/login/epRegister", url) && !angular.equals("/login/getCheckCode", url) && !angular.equals("/login/getCheckCodeNum", url)){
                        //console.log("url111=====>"+url);
                        localStorageService.clearAll();
                        $state.go("login");
                        return;
                    }
                }
                if(data.resFlag == '2'){
                    localStorageService.set("collapse", 0);
                    $state.go("dashboard.index");
                    return;
                }
                success(data,header,config,status);
            }).error(function(data,header,config,status){
                console.log('========error==============');
                if(localStorageService.get('ifLogin') != '1')
                //if(sessionStorage.getItem('ifLogin') != '1')
                {
                    $rootScope.nickName = $rootScope.logintitle;
                    $rootScope.userPortrait = $rootScope.loginPic;
                }else{
                    $rootScope.nickName = localStorageService.get('nickName');
                    $rootScope.userId = localStorageService.get('userId');
                    //$rootScope.nickName = sessionStorage.getItem('nickName');
                    //$rootScope.userId = sessionStorage.getItem('userId');
                    $rootScope.userPortrait = $rootScope.loginPic;
                    $rootScope.loginUrl = 'user';
                }
                error(data,header,config,status);
            });
        }
    };
    return initRes;
}]);
