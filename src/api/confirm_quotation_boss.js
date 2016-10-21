var request = require('../extend/http-request')
var path = '/service/private/confirm_quotation_boss/'
export default {
    confirmQuotation(params) {
        return request.post(path + 'confirmQuotation', params)
    }
}