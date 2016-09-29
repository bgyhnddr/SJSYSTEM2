export function configRouter(router) {
    router.map({
        '/index':
        {
            component: require('../components/Master.vue'),
            subRoutes:
            {
                'table': {
                    component: require('../components/table.vue')
                },
                'DataManagement':{
                    component: require('../components/DataManagement.vue')
                }
            }
        }
    })
    router.redirect({
        '/': '/index'
    })
}