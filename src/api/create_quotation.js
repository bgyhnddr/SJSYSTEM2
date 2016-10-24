var request = require('../extend/http-request')
var path = '/service/private/create_quotation/'
export default {
    createQuotation(params) {
        return request.post(path + 'createQuotation', params)
    },
    saveDraft(params) {
        return request.post(path + 'saveDraft', params)
    },
    submitQuotationJob(params) {
        return request.post(path + 'submitQuotationJob', params)
    },
    deleteQuotationJob(params) {
        return request.post(path + 'deleteQuotationJob', params)
    },
    upQuotationJob(params) {
        return request.post(path + 'upQuotationJob', params)
    },
    downQuotationJob(params) {
        return request.post(path + 'downQuotationJob', params)
    },
    saveQuotation(params) {
        return request.post(path + 'saveQuotation', params)
    },
    editQuotation(params) {
        return request.post(path + 'editQuotation', params)
    },
    saveContract(params) {
        return request.post(path + 'saveContract', params)
    }
}