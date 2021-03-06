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
                },
                'POManagement': {
                    component: require('../components/POManagement.vue'),
                    subRoutes: {
                        'PO': {
                            component: require('../components/PO.vue')
                        },
                        'PO/:id': {
                            component: require('../components/PO.vue')
                        },
                        'POList/:type': {
                            component: require('../components/PoList.vue')
                        }
                    }
                },
                'ReportManager':{
                    component: require('../components/ReportManager.vue'),
                    subRoutes: {
                        'Hour': {
                            component: require('../components/HourQuery.vue')
                        }
                    }
                },
                'Setting': {
                    component: require('../components/Setting.vue')
                }
            }
        },
        '/quotation/:id': {
            component: require('../components/QuotationPrint.vue')
        },
        '/invoice/:id': {
            component: require('../components/InvoicePrint.vue')
        },
        '/report/hours':{
            component: require('../components/HoursReport.vue')
        }
    })
    router.redirect({
        '/': '/index'
    })

    router.redirect({
        '/index/ProjectManagement': '/index/ProjectManagement/ProjectList/all'
    })

    router.redirect({
        '/index/POManagement': '/index/POManagement/POList/all'
    })
}
