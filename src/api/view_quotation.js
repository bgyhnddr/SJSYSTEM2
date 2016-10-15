var request = require('../extend/http-request')
var path = '/service/private/view_quotation/'
export default {
    getQuotation(params) {
        return request.get(path + 'getQuotation', params)
    },
    getProject(params) {
        return request.get(path + 'getProject', params)
    },
    getQuotationJobs(params) {
        return request.get(path + 'getQuotationJobs', params)
    }
}