var request = require('../extend/http-request')
var path = '/service/private/create_po/'
export default {
    submitPO(params) {
        return request.post(path + 'submitPO', params)
    },
    addQuotation(params) {
        return request.post(path + 'addQuotation', params)
    },
    submitPODetail(params) {
        return request.post(path + 'submitPODetail', params)
    },
    deletePODetail(params) {
        return request.post(path + 'deletePODetail', params)
    },
    uploadPODetailAttachment(params) {
        return request.post(path + 'uploadPODetailAttachment', params)
    },
    deletePODetailAttachment(params) {
        return request.post(path + 'deletePODetailAttachment', params)
    },
    finishPO(params) {
        return request.post(path + 'finishPO', params)
    }
}