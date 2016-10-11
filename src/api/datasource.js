var Vue = require('vue')

export default {
    getPropertyManagementCos(page, count, filterKey) {
        return new Promise(function(resolve, reject) {
            Vue.http.get('/service/private/datasource/getPropertyManagementCos', {
                _timeout: 5000,
                params: {
                    page,
                    count,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    } else {
                        reject("error")
                    }
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    submitPropertyManagementCo(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/submitPropertyManagementCo', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    deletePropertyManagementCo(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/deletePropertyManagementCo', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    getStaffs(page, count, filterKey) {
        return new Promise(function(resolve, reject) {
            Vue.http.get('/service/private/datasource/getStaffs', {
                _timeout: 5000,
                params: {
                    page,
                    count,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    } else {
                        reject("error")
                    }
                }
            }).catch(function(e) {
                console.log(e)
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    submitStaff(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/submitStaff', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    deleteStaff(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/deleteStaff', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    getBuildings(page, count, filterKey) {
        return new Promise(function(resolve, reject) {
            Vue.http.get('/service/private/datasource/getBuildings', {
                _timeout: 5000,
                params: {
                    page,
                    count,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    } else {
                        reject("error")
                    }
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    submitBuilding(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/submitBuilding', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    deleteBuilding(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/deleteBuilding', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    getProjectManagers(page, count, filterKey) {
        return new Promise(function(resolve, reject) {
            Vue.http.get('/service/private/datasource/getProjectManagers', {
                _timeout: 5000,
                params: {
                    page,
                    count,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    } else {
                        reject("error")
                    }
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    submitProjectManager(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/submitProjectManager', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    deleteProjectManager(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/deleteProjectManager', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    getProjectTypes(page, count, filterKey) {
        return new Promise(function(resolve, reject) {
            Vue.http.get('/service/private/datasource/getProjectTypes', {
                _timeout: 5000,
                params: {
                    page,
                    count,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    } else {
                        reject("error")
                    }
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    submitProjectType(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/submitProjectType', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    deleteProjectType(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/deleteProjectType', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    getProjectItems(type, page, count, filterKey) {
        return new Promise(function(resolve, reject) {
            Vue.http.get('/service/private/datasource/getProjectItems', {
                _timeout: 5000,
                params: {
                    type,
                    page,
                    count,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    } else {
                        reject("error")
                    }
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    submitProjectItem(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/submitProjectItem', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    deleteProjectItem(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/deleteProjectItem', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    getUploadTemplates(item, filterKey) {
        return new Promise(function(resolve, reject) {
            Vue.http.get('/service/private/datasource/getUploadTemplates', {
                _timeout: 5000,
                params: {
                    item,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    } else {
                        reject("error")
                    }
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    submitUploadTemplate(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/submitUploadTemplate', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    deleteUploadTemplate(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/deleteUploadTemplate', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    upUploadTemplate(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/upUploadTemplate', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    downUploadTemplate(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/downUploadTemplate', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    getJobTemplates(item, filterKey) {
        return new Promise(function(resolve, reject) {
            Vue.http.get('/service/private/datasource/getJobTemplates', {
                _timeout: 5000,
                params: {
                    item,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    } else {
                        reject("error")
                    }
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    submitJobTemplate(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/submitJobTemplate', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    deleteJobTemplate(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/deleteJobTemplate', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    upJobTemplate(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/upJobTemplate', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    downJobTemplate(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/downJobTemplate', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    getOutSourceContractors(page, count, filterKey) {
        return new Promise(function(resolve, reject) {
            Vue.http.get('/service/private/datasource/getOutSourceContractors', {
                _timeout: 5000,
                params: {
                    page,
                    count,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    } else {
                        reject("error")
                    }
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    submitOutSourceContractor(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/submitOutSourceContractor', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    },
    deleteOutSourceContractor(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/datasource/deleteOutSourceContractor', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function(res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function(e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                } else {
                    reject(e.body)
                }
            })
        })
    }
}