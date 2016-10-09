export function configRouter(router) {
    router.map({
        '/index': {
            component: require('../components/Master.vue'),
            subRoutes: {
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
                        'ProjectItem/:type': {
                            component: require('../components/ProjectItemSetting.vue')
                        },
                        'ProjectTemplate/:item': {
                            component: require('../components/ProjectTemplateSetting.vue')
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
        },
        '/uploadtest': {
            component: require('../components/uploadTest.vue')
        }
    })
    router.redirect({
        '/': '/index'
    })
}