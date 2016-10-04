var Vue = require('vue')
Vue.use(require('vue-resource'))
import timei from '../extend/vue-resource-timeout'
import authCallback from '../extend/auth-callback'

Vue.http.interceptors.push(timei)
Vue.http.interceptors.push(authCallback)


export default {
    login(params) {
        return new Promise(function (resolve, reject) {
            Vue.http.post('/service/public/auth/login', params, {
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
    logout() {
        return new Promise(function (resolve, reject) {
            Vue.http.get('/service/public/auth/logout', {
                _timeout: 5000,
                onTimeout: (request) => {
                    reject("timeout")
                }
            }).then(function (res) {
                if (res.ok) {
                    resolve()
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
    getUser() {
        return new Promise(function (resolve, reject) {
            Vue.http.get('/service/public/auth/getUser', {
                _timeout: 5000,
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