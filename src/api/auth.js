var Vue = require('vue')
Vue.use(require('vue-resource'))
import timei from '../extend/vue-resource-timeout'

Vue.http.interceptors.push(timei)


export default {
    login(params) {
        return new Promise(function (resolve, reject) {
            Vue.http.post('/service/auth/login', params, {
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
                    resolve(res.body)
                }
            }).catch(function (e) {
                if (e.body.code == "error") {
                    reject(e.body.msg)
                }
            })
        })
    },
    logout() {
        return new Promise(function (resolve, reject) {
            Vue.http.get('/service/auth/logout', {
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
                    resolve()
                }
            })
        })
    },
    getUser() {
        return new Promise(function (resolve, reject) {
            Vue.http.get('/service/auth/getUser', {
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
                    if (res.body.name) {
                        resolve(res.body)
                    }
                    else {
                        reject("error")
                    }
                }
            })
        })
    }
}