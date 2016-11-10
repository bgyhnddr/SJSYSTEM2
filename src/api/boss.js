var request = require('../extend/http-request')
var path = '/service/private/boss/'
export default {
    confirmQuotation(params) {
        return request.post(path + 'confirmQuotation', params)
    },
    submitConfirmInfo(params) {
        return request.post(path + 'submitConfirmInfo', params)
    },
    approvePODetail(params) {
        return request.post(path + 'approvePODetail', params)
    }
}