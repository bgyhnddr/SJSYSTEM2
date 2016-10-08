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
    }
}