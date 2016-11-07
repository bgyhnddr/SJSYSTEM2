export function configRouter(router) {
    router.map({
        '/index': {
            component: require('../components/Master.vue'),
            subRoutes: {
                'ProjectManagement': {
                    component: require('../components/ProjectManagement.vue'),
                    subRoutes: {
                        'Project': {
                            component: require('../components/CreateProject.vue')
                        },
                        'Project/:id': {
                            component: require('../components/Project.vue')
                        },
                        'Project/:id/:mode': {
                            component: require('../components/Project.vue')
                        },
                        'ProjectList/:type': {
                            component: require('../components/ProjectList.vue')
                        }
                    }
                },
                'DataManagement': {
                    component: require('../components/DataManagement.vue'),
                    subRoutes: {
                        'PropertyManagementCo': {
                            component: require('../components/PropertyManagementCoSetting.vue')
                        },
                        'Staff': {
                            component: require('../components/StaffSetting.vue')
                        },
                        'Building': {
                            component: require('../components/BuildingSetting.vue')
                        },
                        'ProjectManager': {
                            component: require('../components/ProjectManagerSetting.vue')
                        },
                        'ProjectType': {
                            component: require('../components/ProjectTypeSetting.vue')
                        },
                        'ProjectType/:type': {
                            component: require('../components/ProjectItemSetting.vue')
                        },
                        'ProjectType/:type/:item/upload': {
                            component: require('../components/ProjectUploadTemplateSetting.vue')
                        },
                        'ProjectType/:type/:item/job': {
                            component: require('../components/ProjectJobTemplateSetting.vue')
                        },
                        'OutSourceContractor': {
                            component: require('../components/OutSourceContractorSetting.vue')
                        }
                    }
                },
                'RBACManagement': {
                    component: require('../components/RBACManagement.vue'),
                    subRoutes: {
                        'User': {
                            component: require('../components/UserSetting.vue')
                        },
                        'Role': {
                            component: require('../components/RoleSetting.vue')
                        },
                        'Permission': {
                            component: require('../components/PermissionSetting.vue')
                        }
                    }
                }
            }
        }
    })
    router.redirect({
        '/': '/index'
    })
}