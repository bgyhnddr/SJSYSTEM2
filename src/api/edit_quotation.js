var request = require('../extend/http-request')
var path = '/service/private/edit_quotation/'
export default {
    editQuotation(params) {
        return request.post(path + 'editQuotation', params)
    }
}