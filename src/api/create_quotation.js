var request = require('../extend/http-request')
var path = '/service/private/create_quotation/'
export default {
    createQuotation(params) {
        return request.post(path + 'createQuotation', params)
    },
    saveDraft(params) {
        return request.post(path + 'saveDraft', params)
    }
}