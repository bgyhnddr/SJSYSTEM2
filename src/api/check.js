var request = require('../extend/http-request')
var path = '/service/private/check/'
export default {
    submitCheck(params) {
        return request.post(path + 'submitCheck', params)
    },
    savePODetailCheckNo(params) {
        return request.post(path + 'savePODetailCheckNo', params)
    },
    savePODetailCheck(params) {
        return request.post(path + 'savePODetailCheck', params)
    }
}