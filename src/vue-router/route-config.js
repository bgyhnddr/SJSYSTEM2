export function configRouter(router) {
    router.map({
        '/index': {
            component: function(resolve) {
                require(['../components/Master.vue'], resolve)
            },
            subRoutes: {
                'ProjectManagement': {
                    component: function(resolve) {
                        require(['../components/ProjectManagement.vue'], resolve)
                    },
                    subRoutes: {
                        'Project': {
                            component: function(resolve) {
                                require(['../components/CreateProject.vue'], resolve)
                            }
                        },
                        'Project/:id': {
                            component: function(resolve) {
                                require(['../components/Project.vue'], resolve)
                            }
                        },
                        'Project/:id/:mode': {
                            component: function(resolve) {
                                require(['../components/Project.vue'], resolve)
                            }
                        }
                    }
                },
                'DataManagement': {
                    component: function(resolve) {
                        require(['../components/DataManagement.vue'], resolve)
                    },
                    subRoutes: {
                        'PropertyManagementCo': {
                            component: function(resolve) {
                                require(['../components/PropertyManagementCoSetting.vue'], resolve)
                            }
                        },
                        'Staff': {
                            component: function(resolve) {
                                require(['../components/StaffSetting.vue'], resolve)
                            }
                        },
                        'Building': {
                            component: function(resolve) {
                                require(['../components/BuildingSetting.vue'], resolve)
                            }
                        },
                        'ProjectManager': {
                            component: function(resolve) {
                                require(['../components/ProjectManagerSetting.vue'], resolve)
                            }
                        },
                        'ProjectType': {
                            component: function(resolve) {
                                require(['../components/ProjectTypeSetting.vue'], resolve)
                            }
                        },
                        'ProjectType/:type': {
                            component: function(resolve) {
                                require(['../components/ProjectItemSetting.vue'], resolve)
                            }
                        },
                        'ProjectType/:type/:item/upload': {
                            component: function(resolve) {
                                require(['../components/ProjectUploadTemplateSetting.vue'], resolve)
                            }
                        },
                        'ProjectType/:type/:item/job': {
                            component: function(resolve) {
                                require(['../components/ProjectJobTemplateSetting.vue'], resolve)
                            }
                        },
                        'OutSourceContractor': {
                            component: function(resolve) {
                                require(['../components/OutSourceContractorSetting.vue'], resolve)
                            }
                        }
                    }
                },
                'RBACManagement': {
                    component: function(resolve) {
                        require(['../components/RBACManagement.vue'], resolve)
                    },
                    subRoutes: {
                        'User': {
                            component: function(resolve) {
                                require(['../components/UserSetting.vue'], resolve)
                            }
                        },
                        'Role': {
                            component: function(resolve) {
                                require(['../components/RoleSetting.vue'], resolve)
                            }
                        },
                        'Permission': {
                            component: function(resolve) {
                                require(['../components/PermissionSetting.vue'], resolve)
                            }
                        }
                    }
                }
            }
        },
        '/uploadtest': {
            component: require('../components/uploadTest.vue')
        }
    })
    router.redirect({
        '/': '/index'
    })
}