var Vue = require('vue')
Vue.use(require('vue-resource'))
import timei from '../extend/vue-resource-timeout'

Vue.http.interceptors.push(timei)


export default {
    getUsers(page, count, filterKey) {
        return new Promise(function (resolve, reject) {
            Vue.http.get('/service/private/RBAC/getUsers', {
                _timeout: 5000,
                params: {
                    page,
                    count,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    }
                    else {
                        reject("error")
                    }
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    addUser(params) {
        return new Promise(function (resolve, reject) {
            Vue.http.post('/service/private/RBAC/addUser', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    deleteUser(params) {
        return new Promise(function (resolve, reject) {
            Vue.http.post('/service/private/RBAC/deleteUser', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    resetPassword(params) {
        return new Promise(function (resolve, reject) {
            Vue.http.post('/service/private/RBAC/resetPassword', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    getRoles(page, count, filterKey) {
        return new Promise(function (resolve, reject) {
            Vue.http.get('/service/private/RBAC/getRoles', {
                _timeout: 5000,
                params: {
                    page,
                    count,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    }
                    else {
                        reject("error")
                    }
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    submitRole(params) {
        return new Promise(function (resolve, reject) {
            Vue.http.post('/service/private/RBAC/submitRole', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    deleteRole(params) {
        return new Promise(function (resolve, reject) {
            Vue.http.post('/service/private/RBAC/deleteRole', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    getPermissions(page, count, filterKey) {
        return new Promise(function (resolve, reject) {
            Vue.http.get('/service/private/RBAC/getPermissions', {
                _timeout: 5000,
                params: {
                    page,
                    count,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    }
                    else {
                        reject("error")
                    }
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    submitPermission(params) {
        return new Promise(function (resolve, reject) {
            Vue.http.post('/service/private/RBAC/submitPermission', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    deletePermission(params) {
        return new Promise(function (resolve, reject) {
            Vue.http.post('/service/private/RBAC/deletePermission', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    getUserRoles(user, page, count, filterKey) {
        return new Promise(function (resolve, reject) {
            Vue.http.get('/service/private/RBAC/getUserRoles', {
                _timeout: 5000,
                params: {
                    user,
                    page,
                    count,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    }
                    else {
                        reject("error")
                    }
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    submitUserRole(params) {
        return new Promise(function (resolve, reject) {
            Vue.http.post('/service/private/RBAC/submitUserRole', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    deleteUserRole(params) {
        return new Promise(function (resolve, reject) {
            Vue.http.post('/service/private/RBAC/deleteUserRole', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    getRolePermissions(role, page, count, filterKey) {
        return new Promise(function (resolve, reject) {
            Vue.http.get('/service/private/RBAC/getRolePermissions', {
                _timeout: 5000,
                params: {
                    role,
                    page,
                    count,
                    filterKey
                },
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    if (res.body) {
                        resolve(res.body)
                    }
                    else {
                        reject("error")
                    }
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    submitRolePermission(params) {
        return new Promise(function (resolve, reject) {
            Vue.http.post('/service/private/RBAC/submitRolePermission', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    },
    deleteRolePermission(params) {
        return new Promise(function (resolve, reject) {
            Vue.http.post('/service/private/RBAC/deleteRolePermission', params, {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    resolve(res.body)
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
                else
                {
                    reject(e.body)
                }
            })
        })
    }
}