export function configRouter(router) {
    router.map({
        '/index':
        {
            component: require('../components/Master.vue'),
            subRoutes:
            {
                'table': {
                    component: require('../components/table.vue')
                }
            }
        }
    })
    router.redirect({
        '/': '/index'
    })


}