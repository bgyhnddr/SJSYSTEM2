var Vue = require('vue')

export default {
    create_quotation(params) {
        return new Promise(function(resolve, reject) {
            Vue.http.post('/service/private/create_quotation/create_quotation', params, {
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