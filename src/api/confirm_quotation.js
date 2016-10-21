var request = require('../extend/http-request')
var path = '/service/private/confirm_quotation/'
export default {
    confirmQuotation(params) {
        return request.post(path + 'confirmQuotation', params)
    }
}