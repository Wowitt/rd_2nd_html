'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
var iwoboApp = angular.module('sbAdminApp', [
    'LocalStorageModule',
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'duScroll',
    'treeControl'
]);
iwoboApp.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function ($httpProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
    });

    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'views/dashboard/main.html',
            resolve: {
                loadMyDirectives: function ($ocLazyLoad) {
                    return $ocLazyLoad.load(
                        {
                            name: 'sbAdminApp',
                            files: [
                                'scripts/controllers/modal/modalController.js',
                                'scripts/directives/header/header.js',
                                'scripts/directives/header/header-notification/header-notification.js',
                                'scripts/directives/sidebar/sidebar.js',
                                'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                            ]
                        }),
                        $ocLazyLoad.load(
                            {
                                name: 'toggle-switch',
                                files: ["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                                    "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                                ]
                            }),
                        $ocLazyLoad.load(
                            {
                                name: 'ngAnimate',
                                files: ['bower_components/angular-animate/angular-animate.js']
                            }),
                        $ocLazyLoad.load(
                            {
                                name: 'ngCookies',
                                files: ['bower_components/angular-cookies/angular-cookies.js']
                            }),
                        $ocLazyLoad.load(
                            {
                                name: 'ngResource',
                                files: ['bower_components/angular-resource/angular-resource.js']
                            }),
                        $ocLazyLoad.load(
                            {
                                name: 'ngSanitize',
                                files: ['bower_components/angular-sanitize/angular-sanitize.js']
                            })
                    $ocLazyLoad.load(
                        {
                            name: 'ngTouch',
                            files: ['bower_components/angular-touch/angular-touch.js']
                        })
                }
            }
        })
        .state('dashboard.home', {
            url: '/home',
            controller: 'MainCtrl',
            templateUrl: 'views/dashboard/home.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.form', {
            templateUrl: 'views/form.html',
            url: '/form'
        })
        .state('dashboard.blank', {
            templateUrl: 'views/pages/blank.html',
            url: '/blank'
        })
        .state('login', {
            templateUrl: 'views/pages/login.html',
            url: '/login',
            controller: 'LoginCtrl',
            params: {
                "from": null
            },
            resolve: {
                loadMyFile: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/loginController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('register', {
            templateUrl: 'views/pages/register.html',
            url: '/register',
            controller: 'RegisterCtrl',
            resolve: {
                loadMyFile: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/registerController.js',
                            'scripts/controllers/modal/registerModalController.js'
                        ]
                    })
                }
            }
        })
        .state('forgetPwd', {
            templateUrl: 'views/pages/forgetPwd.html',
            url: '/forgetPwd',
            controller: 'ForgetPwdCtrl',
            resolve: {
                loadMyFile: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/forgetPwdController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.epInfoManage', {
            url: '/epInfoManage',
            controller: 'EnterpriseManageCtrl',
            templateUrl: 'views/dashboard/enterprise/epInfoManage.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/modal/confirmModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js',
                            'scripts/controllers/enterprise/epInfoManageController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.epInfoModifyIndex', {
            url: '/epInfoModifyIndex',
            controller: 'EpInfoModifyIndexCtrl',
            templateUrl: 'views/dashboard/enterprise/epInfoModifyIndex.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/enterprise/epInfoModifyIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.epInfoModifyIndex.epInfoModify', {
            url: '/epInfoModify',
            controller: 'EnterpriseModifyCtrl',
            templateUrl: 'views/dashboard/enterprise/epInfoModify.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js',
                            'scripts/controllers/enterprise/epInfoModifyController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.epInfoModifyIndex.epInfoHistory', {
            url: '/epInfoHistory',
            controller: 'EpInfoHistoryCtrl',
            templateUrl: 'views/dashboard/enterprise/epInfoHistory.html',
            params: {
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/enterprise/epInfoHistoryController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.epInfoHistoryForUnfinished', {
            url: '/epInfoHistoryForUnfinished',
            controller: 'EpInfoHistoryCtrl',
            templateUrl: 'views/dashboard/enterprise/epInfoHistory.html',
            params: {
                "from": null,
                "oldFrom": null,
                "bizId": null,
                "applyId": null,
                "btnFlag": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/enterprise/epInfoHistoryController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.epInfoHistoryForFinished', {
            url: '/epInfoHistoryForFinished',
            controller: 'EpInfoHistoryCtrl',
            templateUrl: 'views/dashboard/enterprise/epInfoHistory.html',
            params: {
                "from": null,
                "oldFrom": null,
                "bizId": null,
                "applyId": null,
                "btnFlag": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/enterprise/epInfoHistoryController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.epInfoModifyTask', {
            url: '/epInfoModifyTask',
            controller: 'EnterpriseModifyCtrl',
            templateUrl: 'views/dashboard/enterprise/epInfoModify.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js',
                            'scripts/controllers/enterprise/epInfoModifyController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.epInfoModifyFinishedTask', {
            url: '/epInfoModifyFinishedTask',
            controller: 'EnterpriseModifyCtrl',
            templateUrl: 'views/dashboard/enterprise/epInfoModify.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js',
                            'scripts/controllers/enterprise/epInfoModifyController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.submitEpInfo', {
            url: '/submitEpInfo',
            controller: 'EnterpriseManageCtrl',
            templateUrl: 'views/dashboard/enterprise/epInfoManage.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/modal/ConfirmModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js',
                            'scripts/controllers/enterprise/epInfoManageController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.submitEpInfoFinished', {
            url: '/submitEpInfoFinished',
            controller: 'EnterpriseManageCtrl',
            templateUrl: 'views/dashboard/enterprise/epInfoManage.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js',
                            'scripts/controllers/enterprise/epInfoManageController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.index', {
            url: '/index',
            controller: 'IndexCtrl',
            templateUrl: 'views/dashboard/index/index.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/index/indexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex', {
            url: '/unfinishedTaskIndex',
            controller: 'UnfinishedTaskIndexCtrl',
            templateUrl: 'views/dashboard/task/unfinishedTaskIndex.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/task/unfinishedTaskIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.unfinishedTaskList', {
            url: '/unfinishedTaskList',
            controller: 'UnfinishedTaskListCtrl',
            templateUrl: 'views/dashboard/task/unfinishedTaskList.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/task/unfinishedTaskListController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex', {
            url: '/finishedTaskIndex',
            controller: 'FinishedTaskIndexCtrl',
            templateUrl: 'views/dashboard/task/finishedTaskIndex.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/task/finishedTaskIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.finishedTaskList', {
            url: '/finishedTaskList',
            controller: 'FinishedTaskListCtrl',
            templateUrl: 'views/dashboard/task/finishedTaskList.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/task/finishedTaskListController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.approveEpInfo', {
            url: '/approveEpInfo',
            controller: 'ApproveEpInfoCtrl',
            templateUrl: 'views/dashboard/admin/approveEpInfo.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/admin/approveEpInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.approveEpModifyInfo', {
            url: '/approveEpModifyInfo',
            controller: 'ApproveEpModifyInfoCtrl',
            templateUrl: 'views/dashboard/admin/approveEpModifyInfo.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/admin/approveEpModifyInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.approveEpModifyInfoUnfinished', {
            url: '/approveEpModifyInfoUnfinished',
            controller: 'ApproveEpModifyInfoCtrl',
            templateUrl: 'views/dashboard/admin/approveEpModifyInfo.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/admin/approveEpModifyInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.approveEpInfoHistory', {
            url: '/approveEpInfoHistory',
            controller: 'ApproveEpInfoHistoryCtrl',
            templateUrl: 'views/dashboard/admin/approveEpInfoHistory.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "oldFrom": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/admin/approveEpInfoHistoryController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.approveEpInfo', {
            url: '/approveEpInfo',
            controller: 'ApproveEpInfoCtrl',
            templateUrl: 'views/dashboard/admin/approveEpInfo.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/admin/approveEpInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.approveEpInfoTransition', {
            url: '/approveEpInfoTransition',
            controller: 'ApproveEpInfoTransitionCtrl',
            templateUrl: 'views/dashboard/admin/approveEpInfoTransition.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "oldFrom": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/admin/approveEpInfoTransitionController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.agreementIndex', {
            templateUrl: 'views/dashboard/agreement/agreementIndex.html',
            url: '/agreementIndex',
            controller: 'AgreementIndexCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/agreement/agreementIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.agreementIndex.agreementList', {
            templateUrl: 'views/dashboard/agreement/agreementList.html',
            url: '/agreementList',
            controller: 'AgreementListCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/agreement/agreementListController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.agreementIndex.agreementInfo', {
            url: '/agreementInfo',
            controller: 'AgreementInfoCtrl',
            templateUrl: 'views/dashboard/agreement/agreementInfo.html',
            params: {
                "agreementId": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/directives/dateTools/WdatePicker.js',
                            'scripts/controllers/agreement/agreementInfoController.js',
                            'scripts/controllers/modal/modifyTransferOrgDetailModalController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.agreementIndexCz', {
            templateUrl: 'views/dashboard/agreementcz/agreementIndexCz.html',
            url: '/agreementIndexCz',
            controller: 'AgreementIndexCzCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/agreementcz/agreementIndexCzController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.agreementIndexCz.agreementListCz', {
            templateUrl: 'views/dashboard/agreementcz/agreementListCz.html',
            url: '/agreementListCz',
            controller: 'AgreementListCzCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/agreementcz/agreementListCzController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.agreementIndexCz.agreementInfoCz', {
            url: '/agreementInfoCz',
            controller: 'AgreementInfoCzCtrl',
            templateUrl: 'views/dashboard/agreementcz/agreementInfoCz.html',
            params: {
                "agreementId": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/agreementcz/agreementInfoCzController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferIndex', {
            url: '/transferIndex',
            templateUrl: 'views/dashboard/transfer/transferIndex.html',
            controller: 'TransferIndexCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/transfer/transferIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferIndex.transferList', {
            url: '/transferList',
            templateUrl: 'views/dashboard/transfer/transferList.html',
            controller: 'TransferListCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/transfer/transferListController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferIndex.transferInfo', {
            url: '/transferInfo',
            controller: 'TransferInfoCtrl',
            templateUrl: 'views/dashboard/transfer/transferInfo.html',
            params: {
                "transferId": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/transfer/transferInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/modal/modifyTransferOrgDetailModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.transferInfoForEpAdmin', {
            url: '/transferInfoForEpAdmin',
            controller: 'TransferInfoCtrl',
            templateUrl: 'views/dashboard/transfer/transferInfo.html',
            params: {
                "transferId": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/transfer/transferInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.transferInfoForEpAdminFinshed', {
            url: '/transferInfoForEpAdminFinshed',
            controller: 'TransferInfoCtrl',
            templateUrl: 'views/dashboard/transfer/transferInfo.html',
            params: {
                "transferId": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/transfer/transferInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.approveTransferInfo', {
            url: '/approveTransferInfo',
            controller: 'ApproveTransferInfoCtrl',
            templateUrl: 'views/dashboard/admin/approveTransferInfo.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/admin/approveTransferInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.approveTransferInfo', {
            url: '/approveTransferInfo',
            controller: 'ApproveTransferInfoCtrl',
            templateUrl: 'views/dashboard/admin/approveTransferInfo.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/admin/approveTransferInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.epAdminManage', {
            url: '/epAdminManage',
            controller: 'EpAdminManageCtrl',
            templateUrl: 'views/dashboard/enterprise/epAdminManage.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/modal/confirmModalController.js',
                            'scripts/controllers/enterprise/checkCodeModalController.js',
                            'scripts/controllers/enterprise/epAdminManageController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.epAdminManageFinishedTask', {
            url: '/epAdminManageFinishedTask',
            controller: 'EpAdminManageCtrl',
            templateUrl: 'views/dashboard/enterprise/epAdminManage.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/enterprise/checkCodeModalController.js',
                            'scripts/controllers/enterprise/epAdminManageController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.epAdminManageUnfinishedTask', {
            url: '/epAdminManageUnfinishedTask',
            controller: 'EpAdminManageCtrl',
            templateUrl: 'views/dashboard/enterprise/epAdminManage.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/enterprise/checkCodeModalController.js',
                            'scripts/controllers/enterprise/epAdminManageController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.epAdminManageUnfinishedTaskForAdmin', {
            url: '/epAdminManageUnfinishedTaskForAdmin',
            controller: 'ApproveEpAdminInfoCtrl',
            templateUrl: 'views/dashboard/admin/approveEpAdminInfo.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/enterprise/checkCodeModalController.js',
                            'scripts/controllers/admin/approveEpAdminInfoController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.epAdminManageUnfinishedTaskForAdminTransition', {
            url: '/epAdminManageUnfinishedTaskForAdminTransition',
            controller: 'ApproveEpAdminInfoTranstionCtrl',
            templateUrl: 'views/dashboard/admin/approveEpAdminInfoTransition.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null,
                "oldFrom": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/enterprise/checkCodeModalController.js',
                            'scripts/controllers/admin/approveEpAdminInfoTransitionController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.epAdminManageFinishedTaskForAdminTransition', {
            url: '/epAdminManageFinishedTaskForAdminTransition',
            controller: 'ApproveEpAdminInfoTranstionCtrl',
            templateUrl: 'views/dashboard/admin/approveEpAdminInfoTransition.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null,
                "oldFrom": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/enterprise/checkCodeModalController.js',
                            'scripts/controllers/admin/approveEpAdminInfoTransitionController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.epAdminManageFinishedTaskForAdmin', {
            url: '/epAdminManageFinishedTaskForAdmin',
            controller: 'ApproveEpAdminInfoCtrl',
            templateUrl: 'views/dashboard/admin/approveEpAdminInfo.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/enterprise/checkCodeModalController.js',
                            'scripts/controllers/admin/approveEpAdminInfoController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.epConnectManage', {
            url: '/epConnectManage',
            controller: 'EpConnectManageCtrl',
            templateUrl: 'views/dashboard/enterprise/epConnectManage.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/modal/confirmModalController.js',
                            'scripts/controllers/enterprise/checkCodeModalController.js',
                            'scripts/controllers/enterprise/epConnectManageController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.epCarManage', {
            url: '/epCarManage',
            controller: 'EpCarManageCtrl',
            templateUrl: 'views/dashboard/enterprise/epCarManage.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/modal/confirmModalController.js',
                            'scripts/controllers/enterprise/checkCodeModalController.js',
                            'scripts/controllers/enterprise/epCarManageController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.roleIndex', {
            url: '/roleIndex',
            controller: 'RoleIndexCtrl',
            templateUrl: 'views/dashboard/sysadmin/roleIndex.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/sysadmin/roleIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.roleIndex.roleList', {
            url: '/roleList',
            controller: 'RoleListCtrl',
            templateUrl: 'views/dashboard/sysadmin/roleList.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/sysadmin/roleListController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.roleIndex.roleInfo', {
            url: '/roleInfo',
            controller: 'RoleInfoCtrl',
            templateUrl: 'views/dashboard/sysadmin/roleInfo.html',
            params: {
                "roleId": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/sysadmin/roleInfoController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.roleIndex.roleMenu', {
            url: '/roleMenu',
            controller: 'RoleMenuCtrl',
            templateUrl: 'views/dashboard/sysadmin/roleMenu.html',
            params: {
                "roleId": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/sysadmin/roleMenuController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.roleIndex.roleUser', {
            url: '/roleUser',
            controller: 'RoleUserCtrl',
            templateUrl: 'views/dashboard/sysadmin/roleUser.html',
            params: {
                "roleId": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/sysadmin/roleUserController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.menu', {
            templateUrl: 'views/dashboard/menu/menu.html',
            url: '/menu',
            controller: 'MenuCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/menu/menuController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.modifyPwd', {
            templateUrl: 'views/dashboard/modifyPwd.html',
            url: '/modifyPwd',
            controller: 'ModifyPwdCtrl',
            resolve: {
                loadMyFile: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/modifyPwdController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.haulIndex', {
            url: '/haulIndex',
            templateUrl: 'views/dashboard/haul/haulIndex.html',
            controller: 'HaulIndexCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/haul/haulIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.haulIndex.haulList', {
            url: '/haulList',
            templateUrl: 'views/dashboard/haul/haulList.html',
            controller: 'HaulListCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/haul/haulListController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.haulIndex.billList', {
            url: '/billList',
            templateUrl: 'views/dashboard/haul/billList.html',
            controller: 'BillListCtrl',
            params: {
                "TG_ID": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/haul/billListController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.haulIndex.billInfo', {
            url: '/billInfo',
            controller: 'BillInfoCtrl',
            templateUrl: 'views/dashboard/haul/billInfo.html',
            params: {
                "TG_ID": null,
                "TB_ID": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/haul/billInfoController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.forgetPwdApplyIndex', {
            url: '/forgetPwdApplyIndex',
            controller: 'ForgetPwdApplyIndexCtrl',
            templateUrl: 'views/dashboard/forgetPwd/forgetPwdApplyIndex.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/forgetPwd/forgetPwdApplyIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.forgetPwdApplyIndex.forgetPwdApplyList', {
            url: '/forgetPwdApplyList',
            controller: 'ForgetPwdApplyListCtrl',
            templateUrl: 'views/dashboard/forgetPwd/forgetPwdApplyList.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/forgetPwd/forgetPwdApplyListController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.forgetPwdApplyIndex.forgetPwdApplyInfo', {
            url: '/forgetPwdApplyInfo',
            controller: 'ForgetPwdApplyInfoCtrl',
            templateUrl: 'views/dashboard/forgetPwd/forgetPwdApplyInfo.html',
            params: {
                "WF_ID": null,
                "EP_NAME": null,
                "ORGCARD": null,
                "NAME": null,
                "MAIL": null,
                "APPROVE_MAIL": null,
                "STATUS": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/forgetPwd/forgetPwdApplyInfoController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferCzIndex', {
            url: '/transferCzIndex',
            controller: 'TransferCzIndexCtrl',
            templateUrl: 'views/dashboard/transferCz/transferCzIndex.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/transferCz/transferCzIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferCzIndex.transferCzList', {
            url: '/transferCzList',
            controller: 'TransferCzListCtrl',
            templateUrl: 'views/dashboard/transferCz/transferCzList.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/transferCz/transferCzListController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferCzIndex.transferCzInfo', {
            url: '/transferCzInfo',
            controller: 'TransferCzInfoCtrl',
            templateUrl: 'views/dashboard/transferCz/transferCzInfo.html',
            params: {
                "WC_ID": null,
                "STATUS": null,
                "from": null,
                "btnFlag": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/transferCz/transferCzInfoController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unsubmitAgreementEpIndex', {
            url: '/unsubmitAgreementEpIndex',
            controller: 'UnsubmitAgreementEpIndexCtrl',
            templateUrl: 'views/dashboard/unsubmitAgreementEp/unsubmitAgreementEpIndex.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/unsubmitAgreementEp/unsubmitAgreementEpIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unsubmitAgreementEpIndex.unsubmitAgreementEpList', {
            url: '/unsubmitAgreementEpList',
            controller: 'UnsubmitAgreementEpListCtrl',
            templateUrl: 'views/dashboard/unsubmitAgreementEp/unsubmitAgreementEpList.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/unsubmitAgreementEp/unsubmitAgreementEpListController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unsubmitAgreementEp.unsubmitAgreementEpInfo', {
            url: '/unsubmitAgreementEpInfo',
            controller: 'UnsubmitAgreementEpInfoCtrl',
            templateUrl: 'views/dashboard/unsubmitAgreementEp/unsubmitAgreementEpInfo.html',
            params: {
                "epIdCs": null,
                "epIdCz": null,
                "epNameCs": null,
                "epNameCz": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/unsubmitAgreementEp/unsubmitAgreementEpInfoController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.billCsIndex', {
            url: '/billCsIndex',
            templateUrl: 'views/dashboard/billcs/billCsIndex.html',
            controller: 'BillCsIndexCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/billcs/billCsIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.billCsIndex.billCsList', {
            url: '/billCsList',
            templateUrl: 'views/dashboard/billcs/billCsList.html',
            controller: 'BillCsListCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/billcs/billCsListController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.billCsIndex.billCsInfo', {
            url: '/billCsInfo',
            controller: 'BillInfoCtrl',
            templateUrl: 'views/dashboard/haul/billInfo.html',
            params: {
                "TG_ID": null,
                "TB_ID": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/haul/billInfoController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.epForAdminIndex', {
            url: '/epForAdminIndex',
            templateUrl: 'views/dashboard/enterpriseAdmin/epForAdminIndex.html',
            controller: 'EpForAdminIndexCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/enterpriseAdmin/epForAdminIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.epForAdminIndex.epForAdminList', {
            url: '/epForAdminList',
            templateUrl: 'views/dashboard/enterpriseAdmin/epForAdminList.html',
            controller: 'EpForAdminListCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/enterpriseAdmin/epForAdminListController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.epForAdminIndex.epForAdminInfo', {
            url: '/epForAdminInfo',
            controller: 'EpForAdminInfoCtrl',
            templateUrl: 'views/dashboard/enterpriseAdmin/epForAdminInfo.html',
            params: {
                "epId": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'styles/mine.css',
                            'scripts/controllers/enterpriseAdmin/epForAdminInfoController.js',
                            'scripts/controllers/modal/promptModalController.js',
                        ]
                    })
                }
            }
        })
        .state('dashboard.agreementForAdminIndex', {
            url: '/agreementForAdminIndex',
            templateUrl: 'views/dashboard/agreementAdmin/agreementForAdminIndex.html',
            controller: 'AgreementForAdminIndexCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/agreementAdmin/agreementForAdminIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.agreementForAdminIndex.agreementForAdminList', {
            url: '/agreementForAdminList',
            templateUrl: 'views/dashboard/agreementAdmin/agreementForAdminList.html',
            controller: 'AgreementForAdminListCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/agreementAdmin/agreementForAdminListController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.agreementForAdminIndex.agreementForAdminInfo', {
            url: '/agreementForAdminInfo',
            controller: 'AgreementForAdminInfoCtrl',
            templateUrl: 'views/dashboard/agreementAdmin/agreementForAdminInfo.html',
            params: {
                "agreementId": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/agreementAdmin/agreementForAdminInfoController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferForAdminIndex', {
            url: '/transferForAdminIndex',
            templateUrl: 'views/dashboard/transferAdmin/transferForAdminIndex.html',
            controller: 'TransferForAdminIndexCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/transferAdmin/transferForAdminIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferForAdminIndex.transferForAdminList', {
            url: '/transferForAdminList',
            templateUrl: 'views/dashboard/transferAdmin/transferForAdminList.html',
            controller: 'TransferListForAdminCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/transferAdmin/transferForAdminListController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferForAdminIndex.transferForAdminInfo', {
            url: '/transferForAdminInfo',
            controller: 'TransferForAdminInfoCtrl',
            templateUrl: 'views/dashboard/transferAdmin/transferForAdminInfo.html',
            params: {
                "transferId": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/transferAdmin/transferForAdminInfoController.js',
                            'scripts/controllers/modal/promptModalController.js',
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferRunningIndex', {
            url: '/transferRunningIndex',
            templateUrl: 'views/dashboard/transferRunning/transferRunningIndex.html',
            controller: 'TransferRunningIndexCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/transferRunning/transferRunningIndexController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferRunningIndex.transferRunningList', {
            url: '/transferRunningList',
            templateUrl: 'views/dashboard/transferRunning/transferRunningList.html',
            controller: 'TransferRunningListCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/controllers/transferRunning/transferRunningListController.js',
                            'scripts/controllers/modal/promptModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferRunningIndex.transferRunningInfo', {
            url: '/transferRunningInfo',
            controller: 'TransferRunningInfoCtrl',
            templateUrl: 'views/dashboard/transferRunning/transferRunningInfo.html',
            params: {
                "transferId": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/transferRunning/transferRunningInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/modal/confirmModalController.js',
                            'scripts/controllers/modal/modifyTransferOrgDetailModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferSummaryListForCS', {
            url: '/transferSummaryListForCS',
            controller: 'TransferSummaryListForCSCtrl',
            templateUrl: 'views/dashboard/transferSummary/transferSummaryListForCS.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/dateTools/WdatePicker.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/transferSummary/transferSummaryListForCSController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.transferRunningInfoForEpAdmin', {
            url: '/transferRunningInfoForEpAdmin',
            controller: 'TransferRunningInfoCtrl',
            templateUrl: 'views/dashboard/transferRunning/transferRunningInfo.html',
            params: {
                "transferId": null,
                "bizId": null,
                "applyId":null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/transferRunning/transferRunningInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/modal/confirmModalController.js',
                            'scripts/controllers/modal/modifyTransferOrgDetailModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.transferRunningInfoForEpAdminFinished', {
            url: '/transferRunningInfoForEpAdminFinished',
            controller: 'TransferRunningInfoCtrl',
            templateUrl: 'views/dashboard/transferRunning/transferRunningInfo.html',
            params: {
                "transferId": null,
                "bizId": null,
                "btnFlag":null,
                "applyId":null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/transferRunning/transferRunningInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/modal/modifyTransferOrgDetailModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.unfinishedTaskIndex.approveTransferRunningInfo', {
            url: '/approveTransferRunningInfo',
            controller: 'ApproveTransferRunningInfoCtrl',
            templateUrl: 'views/dashboard/admin/approveTransferRunningInfo.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/admin/approveTransferRunningInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/modal/modifyTransferOrgDetailModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.finishedTaskIndex.approveTransferRunningInfoFinished', {
            url: '/approveTransferRunningInfoFinished',
            controller: 'ApproveTransferRunningInfoCtrl',
            templateUrl: 'views/dashboard/admin/approveTransferRunningInfo.html',
            params: {
                "bizId": null,
                "applyId": null,
                "btnFlag": null,
                "from": null
            },
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/main.js',
                            'scripts/directives/timeline/timeline.js',
                            'scripts/directives/notifications/notifications.js',
                            'scripts/directives/chat/chat.js',
                            'scripts/directives/dashboard/stats/stats.js',
                            'scripts/controllers/admin/approveTransferRunningInfoController.js',
                            'scripts/controllers/admin/approveDisagreeModalController.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/modal/modifyTransferOrgDetailModalController.js',
                            'scripts/controllers/admin/approveDetailModalController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.transferSummaryListForCZ', {
            url: '/transferSummaryListForCZ',
            controller: 'TransferSummaryListForCZCtrl',
            templateUrl: 'views/dashboard/transferSummary/transferSummaryListForCZ.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/dataTables/dataTables.bootstrap.min.css',
                            'lib/dataTables/dataTables.bootstrap.min.js',
                            'lib/dataTables/jquery.dataTables.min.css',
                            'lib/dataTables/jquery.dataTables.min.js',
                            'scripts/directives/dateTools/WdatePicker.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/transferSummary/transferSummaryListForCZController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.chart', {
            templateUrl: 'views/chart.html',
            url: '/chart',
            controller: 'ChartCtrl',
            resolve: {
                loadMyFile: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'chart.js',
                        files: [
                            'bower_components/angular-chart.js/dist_bak/angular-chart.min.js',
                            'bower_components/angular-chart.js/dist_bak/angular-chart.css'
                        ]
                    }),
                        $ocLazyLoad.load({
                            name: 'sbAdminApp',
                            files: ['scripts/controllers/chartContoller.js']
                        })
                }
            }
        })
        .state('dashboard.table', {
            templateUrl: 'views/table.html',
            url: '/table'
        })
        .state('dashboard.testTree', {
            templateUrl: 'views/testTree.html',
            controller: 'TestTreeCtrl',
            url: '/testTree',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/testTreeController.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.panels-wells', {
            templateUrl: 'views/ui-elements/panels-wells.html',
            url: '/panels-wells',
            controller: 'TabCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/tabController.js',
                        ]
                    })
                }
            }
        })
        .state('dashboard.buttons', {
            templateUrl: 'views/ui-elements/buttons.html',
            url: '/buttons'
        })
        .state('dashboard.notifications', {
            templateUrl: 'views/ui-elements/notifications.html',
            url: '/notifications',
            controller: 'NotificationsCtrl',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/notificationsController.js',
                        ]
                    })
                }
            }
        })
        .state('dashboard.typography', {
            templateUrl: 'views/ui-elements/typography.html',
            url: '/typography'
        })
        .state('dashboard.icons', {
            templateUrl: 'views/ui-elements/icons.html',
            url: '/icons'
        })
        .state('dashboard.grid', {
            templateUrl: 'views/ui-elements/grid.html',
            url: '/grid'
        })
        .state('dashboard.batchOperation', {
            url: '/batchOperation',
            controller: 'batchOperationController',
            templateUrl: 'views/dashboard/sysadmin/batchOperation.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'lib/crypto-js/crypto-js.js',
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/sysadmin/batchOperationController.js'
                        ]
                    })
                }
            }
        }).state('dashboard.setBoxSuttle', {
            url: '/setBoxSuttle',
            controller: 'SetBoxSuttleCtrl',
            templateUrl: 'views/dashboard/setBoxSuttle/setBoxSuttle.html',
            resolve: {
                loadMyFiles: function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'sbAdminApp',
                        files: [
                            'scripts/controllers/modal/promptModalController.js',
                            'scripts/controllers/setBoxSuttle/setBoxSuttleController.js'
                        ]
                    })
                }
            }
        });
    /* $httpProvider.interceptors.push(['$rootScope','$injector','$q',function($rootScope,$injector,$q){
     return {
     'request':function(config){
     return config;
     },
     'response': function (config) {
     if(angular.equals("POST",config.config.method) || angular.equals("post",config.config.method)  )
     {
     //如果想跳转页面，需注入$injector，再获取$state
     var $state = $injector.get('$state');
     //$state.go("login");
     console.log("response=====>>"+JSON.stringify($state.current));
     }
     return config;
     }
     };
     }]);*/
}]);
iwoboApp.run(['$state', '$rootScope', 'localStorageService', '$modal', '$log', 'Init', function ($state, $rootScope, localStorageService, $modal, $log, Init) {
    console.log("===========iwobo app running====================================");
    // $rootScope.baseUrl = 'http://lovewobo.com';
    $rootScope.baseUrl = 'http://localhost:9002/api';
    //$rootScope.baseUrl = 'http://60.30.64.249:7080/rd_2nd';
    $rootScope.baseUrlPath = '';
    $rootScope.uuid = '';
    $rootScope.platform = "";
    $rootScope.logintitle = '';
    $rootScope.loginPic = '';
    $rootScope.userPortrait = '';
    $rootScope.ifLogin = '1';  //0-登录 1-未登录
    $rootScope.nickName = '';
    $rootScope.tel = '';
    $rootScope.mail = '';
    $rootScope.loginUrl = 'login';
    $rootScope.title = '管理面板';
    $rootScope.downFlag = true;
    $rootScope.downNum = 1;
    $rootScope.appId = '';
    $rootScope.appName = '请选择应用';
    $rootScope.APPS = new Array();
    $rootScope.logo = 'images/logo.png';
    //公司注册登录信息
    $rootScope.epName = "";
    $rootScope.epArea = "";
    $rootScope.epCode = "";
    //localStorageService.IWBSESSION = "";
    //时间控件是否点击
    $rootScope.dateClick = true;

    //页面按钮显示提示信息
    $rootScope.checkApp = function () {
        $('#element').popover('show');
    };
}]);

    
