var request = require('../extend/http-request')
var path = '/service/private/confirm_quotation/'
export default {
    createQuotation(params) {
        return request.post(path + 'createQuotation', params)
    }
}