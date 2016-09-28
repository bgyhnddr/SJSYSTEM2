var Vue = require('vue')
Vue.use(require('vue-resource'))
import timei from '../extend/vue-resource-timeout'

Vue.http.interceptors.push(timei)


export default {
    getTestData(url, page, count, filterKey) {
        return new Promise(function (resolve, reject) {
            Vue.http.get(url, {
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
            }, function (e) {
                window.alert(e.body)
                reject("error")
            }).catch(e => window.alert(e))
        })
    }
}