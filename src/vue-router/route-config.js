export function configRouter(router) {
    router.map({
        '/index': {
            component: require('../components/Master.vue'),
            subRoutes: {
                'DataManagement': {
                    component: require('../components/DataManagement.vue')
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